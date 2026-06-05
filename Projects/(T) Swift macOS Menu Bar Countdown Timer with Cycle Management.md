---
status: done
priority: "0"
dateCreated: 2025-11-17T00:18:30.369-05:00
dateModified: 2026-04-28T03:15:00.964-04:00
tags:
  - task
  - personal
parent:
  - "[[(T) Optimize]]"
completedDate: 2026-04-28
aliases:
  - (T) Stacking Counter
  - (T) Xcode Application
---
## ToDo
- [ ] Should I add a section to let me know that when I level-up, my difficult increases or decreases?
- [ ] Maybe it’s best that I don’t know how long a section is? Because if it’s past a certain point, then I want it to be slower I guess? But it also could be smart because the longer I work, the slower someone will typically get anyway. So it’s best to be able to slow down a little bit the longer you work? 
	- After cleaning up for around an hour, this is what I feel. I wish to slow down a little bit (because the initial stuff will always be a little fast but hard to keep up with). 
	- It’s important to try things in practice as well. You can think as much as you want, but you need to see how you actually feel and perform given a situation.
	- Then again, if I can’t keep up, it will lower itself naturally anyway. Best case scenario is always staying around the middle
- [ ] Add section so I can keep history categories? So it doesn't always start over when making new session?
	- Maybe best not to give that flexibility because then I'm more likely to switch away from it? 
- [ ] Also speedrun commandR doesn’t seem to be taking average of pervious again? What happened.
	- Seems to be inconsistent with it..
	- If I press Control + Space very fast, it doesn’t seem to save the time?
	- Might not be broken anymore after latest updates. 
## Usage
- Don't need a counter for stacking, just need an end goal and to make sure to complete the tasks at a decent pace.
	- [ ] Could add a sub counter that goes off to make sure I stick to important things. Like complete 10 misc. tasks for example
- Idea
	- Have 1 minute for completing a task and $\pm 20$ minutes to stay within the range. When you have saved a lot of time, then you can start doing tasks that take a lot longer 
## Synthesis
- [Claude Conversation](https://claude.ai/chat/88c9ebda-fbf3-4acf-a6f4-2571915c7730)
- https://claude.ai/chat/dac83dee-e2a0-4d3f-8dd5-410930f4e843
	- Current
### Problems
- Gemini does not seem to be able to produce functional Claude code
	- Might need to lint it to prevent extra whitespace
#### No Build on Initial Download from Google Drive
- Go to `CommandRcounter/CommandRCounter/CommandRCounter.entitlements.xml` and remove the `.xml` from this. 
## V5
- Added a new "Countdown Mode"
- Calculates time left for # of tasks
```javascript
import Cocoa
import SwiftUI
import UserNotifications

class MenuBarController {
    private var statusBarItem: NSStatusItem!
    private var eventTap: CFMachPort?
    private var runLoopSource: CFRunLoopSource?
    private var eventTapSelfPtr: UnsafeMutableRawPointer?
    private var commandRCount: Int = 0 {
        didSet {
            updateStatusBarTitle()

            if commandRCount == notificationThreshold {
                sendNotification()
            }

            // In stacking mode the timer is managed manually by the event handler
            if commandRCount >= 0 && currentMode == .default {
                startCountdownTimer()
            }
        }
    }

    private var countdownDuration: Int = 5
    private var countdownTimer: Timer?
    private var timeLeft: Int = 0
    private var sound: NSSound?
    private var soundIsPlaying = false
    private var isPaused: Bool = false {
        didSet {
            updateStatusBarTitle()
            updatePauseResumeMenuItem()
        }
    }
    private var sleepStartDate: Date?

    private enum TimerMode: String {
        case `default` = "Default Mode"
        case stacking = "Stacking Mode"
        case countdown = "Countdown Mode"
    }

    private var currentMode: TimerMode = .default {
        didSet { updateModeMenuItem() }
    }

    private var modeMenuItem: NSMenuItem!

    private let thresholdDefaultsKey = "NotificationThreshold"
    private let timeThresholdDefaultsKey = "TimeAccumulationThreshold"
    private let countdownDefaultsKey = "CountdownDuration"
    private let cycleItemsDefaultsKey = "CycleItems"
    private let cycleIndexDefaultsKey = "CycleIndex"
    private let cycleDurationsDefaultsKey = "CycleDurations"
    private let showCycleLabelOverlayKey = "ShowCycleLabelOverlay"
    private let stackingGoalDefaultsKey = "StackingGoal"
    private let stackingUpperLimitDefaultsKey = "StackingUpperLimit"
    private let countdownTargetDefaultsKey = "CountdownTarget"
    private let stackingGoalPositiveOnlyKey = "StackingGoalPositiveOnly"

    private var showCycleLabelOverlay: Bool {
        get {
            // Default to true if never set
            guard UserDefaults.standard.object(forKey: showCycleLabelOverlayKey) != nil else { return true }
            return UserDefaults.standard.bool(forKey: showCycleLabelOverlayKey)
        }
        set {
            UserDefaults.standard.set(newValue, forKey: showCycleLabelOverlayKey)
        }
    }

    private var pauseResumeMenuItem: NSMenuItem!

    // MARK: - Undo state
    private var previousCount: Int = 0
    private var previousTimeLeft: Int = 0
    private var previousCycleIndex: Int = 0

    // MARK: - Stacking Mode state
    // stackingTotalTimeLeft: 0 at level start; increases when section banked early, decreases after section exhausted
    // stackingSectionTimeLeft: counts to 0 (never negative); only then does total start decrementing
    // stackingSectionExhausted: gates whether the total ticks (only true after section hits 0)
    // stackingCurrentAvg: 0 = use global default; updated at every level transition
    // stackingSplitTotalElapsed / stackingSplitCount: running sum/count for this level's splits (avg computed at transition)
    // stackingCurrentSplitElapsed: wall-clock seconds since last Ctrl+Space (resets each press)
    private var stackingIsActive: Bool = false
    private var stackingLevel: Int = 1
    private var stackingTotalTimeLeft: Int = 0
    private var stackingSectionTimeLeft: Int = 0
    private var stackingSectionExhausted: Bool = false
    private var stackingCurrentAvg: Int = 0          // frozen timeSplit for current level
    private var stackingSplitTotalElapsed: Double = 0 // kept for undo compatibility
    private var stackingSplitCount: Int = 0           // kept for undo compatibility
    private var stackingCurrentSplitElapsed: Int = 0
    // Global accumulators across all levels — drive timeSplit on level change
    private var stackingGlobalSumCount: Double = 0
    private var stackingGlobalTotalSplits: Int = 0
    // Delta from last banked split (positive = early, negative = over)
    private var stackingLastSplitDelta: Int = 0
    // Set by the timer when total crosses -goal; cleared after Ctrl+Space applies the downgrade
    private var stackingPendingDowngrade: Bool = false

    // Undo snapshot
    private var previousStackingIsActive: Bool = false
    private var previousStackingLevel: Int = 1
    private var previousStackingTotalTimeLeft: Int = 0
    private var previousStackingSectionTimeLeft: Int = 0
    private var previousStackingSectionExhausted: Bool = false
    private var previousStackingCurrentAvg: Int = 0
    private var previousStackingSplitTotalElapsed: Double = 0
    private var previousStackingSplitCount: Int = 0
    private var previousStackingCurrentSplitElapsed: Int = 0
    private var previousStackingGlobalSumCount: Double = 0
    private var previousStackingGlobalTotalSplits: Int = 0
    private var previousStackingLastSplitDelta: Int = 0
    private var previousStackingPendingDowngrade: Bool = false

    // MARK: - Countdown Mode state
    // cdIsActive: set on first Ctrl+Space
    // cdRemaining: presses left until done (counts down from countdownTarget)
    // cdAheadBehind: running buffer; only ticks when cdSectionTimeLeft ≤ 0
    // cdTotalAheadBehind: accumulated goal-chunks transferred from cdAheadBehind
    // cdSectionTimeLeft: per-segment countdown, resets to countdownDuration each press
    // cdCurrentSplitElapsed: wall-clock seconds since last press
    // cdLastSplitDelta: frozen - actual for last split (overlay use)
    // cdPendingTransfer: set by timer when cdAheadBehind crosses ±goal; applied on next press
    // cdLevel: mirrors stacking level concept, driven by cdTotalAheadBehind goal-chunks
    // cdFinished: true after last press; freezes display
    private var cdIsActive: Bool = false
    private var cdRemaining: Int = 0
    private var cdAheadBehind: Int = 0
    private var cdTotalAheadBehind: Int = 0
    private var cdSectionTimeLeft: Int = 0
    private var cdCurrentSplitElapsed: Int = 0
    private var cdLastSplitDelta: Int = 0
    private var cdPendingTransfer: Int = 0   // +1 = pending upgrade, -1 = pending downgrade, 0 = none
    private var cdLevel: Int = 1
    private var cdFinished: Bool = false
    private var cdTotalTimeLeft: Int = 0     // ticks -1/s; only other influence is cdTotalAheadBehind delta on press

    // Undo snapshot for countdown
    private var prevCdIsActive: Bool = false
    private var prevCdRemaining: Int = 0
    private var prevCdAheadBehind: Int = 0
    private var prevCdTotalAheadBehind: Int = 0
    private var prevCdSectionTimeLeft: Int = 0
    private var prevCdCurrentSplitElapsed: Int = 0
    private var prevCdLastSplitDelta: Int = 0
    private var prevCdPendingTransfer: Int = 0
    private var prevCdLevel: Int = 1
    private var prevCdFinished: Bool = false
    private var prevCdTotalTimeLeft: Int = 0

    // MARK: - Cycle

    private var cycleItems: [String] {
        get { return UserDefaults.standard.stringArray(forKey: cycleItemsDefaultsKey) ?? [] }
        set { UserDefaults.standard.set(newValue, forKey: cycleItemsDefaultsKey) }
    }

    private var cycleIndex: Int {
        get { return UserDefaults.standard.integer(forKey: cycleIndexDefaultsKey) }
        set { UserDefaults.standard.set(newValue, forKey: cycleIndexDefaultsKey) }
    }

    // Parallel array to cycleItems — 0 means "use global countdownDuration"
    private var cycleDurations: [Int] {
        get { return (UserDefaults.standard.array(forKey: cycleDurationsDefaultsKey) as? [Int]) ?? [] }
        set { UserDefaults.standard.set(newValue, forKey: cycleDurationsDefaultsKey) }
    }

    // Returns the duration for the current cycle item, falling back to global countdownDuration
    private var currentCycleDuration: Int {
        let durations = cycleDurations
        let idx = cycleIndex % max(cycleItems.count, 1)
        if idx < durations.count && durations[idx] > 0 { return durations[idx] }
        return countdownDuration
    }

    private var currentCycleLabel: String {
        let items = cycleItems
        guard !items.isEmpty else { return "Counter" }
        return items[cycleIndex % items.count]
    }

    private func advanceCycleIndex() {
        let items = cycleItems
        guard !items.isEmpty else { return }
        cycleIndex = (cycleIndex + 1) % items.count
    }

    // MARK: - Persisted thresholds

    private var timeNotificationThreshold: Int {
        get {
            let value = UserDefaults.standard.integer(forKey: timeThresholdDefaultsKey)
            return value > 0 ? value : 30 * 60
        }
        set { UserDefaults.standard.set(newValue, forKey: timeThresholdDefaultsKey) }
    }

    private var notificationThreshold: Int {
        get {
            let value = UserDefaults.standard.integer(forKey: thresholdDefaultsKey)
            return value > 0 ? value : 30
        }
        set { UserDefaults.standard.set(newValue, forKey: thresholdDefaultsKey) }
    }

    // Goal (in seconds) for stacking level transitions. Reaching +goal = level up; -goal = level down.
    private var stackingGoal: Int {
        get {
            let v = UserDefaults.standard.integer(forKey: stackingGoalDefaultsKey)
            return v > 0 ? v : 15 * 60
        }
        set { UserDefaults.standard.set(newValue, forKey: stackingGoalDefaultsKey) }
    }

    // Upper limit (in seconds) for stackingTotalTimeLeft. 0 = no limit.
    private var stackingUpperLimit: Int {
        get { return UserDefaults.standard.integer(forKey: stackingUpperLimitDefaultsKey) }
        set { UserDefaults.standard.set(newValue, forKey: stackingUpperLimitDefaultsKey) }
    }

    // Number of Ctrl+Space presses to complete in Countdown Mode. 0 = not set.
    private var countdownTarget: Int {
        get {
            let v = UserDefaults.standard.integer(forKey: countdownTargetDefaultsKey)
            return v > 0 ? v : 10
        }
        set { UserDefaults.standard.set(newValue, forKey: countdownTargetDefaultsKey) }
    }

    // When true, the stacking goal only triggers on the positive side (ahead); going behind has no penalty.
    private var stackingGoalPositiveOnly: Bool {
        get { return UserDefaults.standard.bool(forKey: stackingGoalPositiveOnlyKey) }
        set { UserDefaults.standard.set(newValue, forKey: stackingGoalPositiveOnlyKey) }
    }

    // MARK: - Init

    init() {
        countdownDuration = UserDefaults.standard.integer(forKey: countdownDefaultsKey)
        if countdownDuration <= 0 { countdownDuration = 5 }

        statusBarItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        updateStatusBarTitle()
        statusBarItem.menu = createMenu()
        updateModeMenuItem() // set initial checkmark for Default Mode

        requestNotificationPermission()
        startGlobalEventMonitor()
        registerSleepLockObservers()
    }

    deinit {
        stopGlobalEventMonitor()
        NSWorkspace.shared.notificationCenter.removeObserver(self)
        DistributedNotificationCenter.default().removeObserver(self)
    }

    // MARK: - Menu

    private func createMenu() -> NSMenu {
        let menu = NSMenu()

        pauseResumeMenuItem = NSMenuItem(title: "Pause Timer", action: #selector(togglePauseResume), keyEquivalent: "")
        pauseResumeMenuItem.target = self
        menu.addItem(pauseResumeMenuItem)

        // Mode submenu — one click to switch directly to any mode
        modeMenuItem = NSMenuItem(title: "Switch Mode", action: nil, keyEquivalent: "")
        let modeSubMenu = NSMenu(title: "Switch Mode")
        for mode in [TimerMode.default, .stacking, .countdown] {
            let item = NSMenuItem(title: mode.rawValue, action: #selector(selectMode(_:)), keyEquivalent: "")
            item.target = self
            item.representedObject = mode.rawValue
            modeSubMenu.addItem(item)
        }
        modeMenuItem.submenu = modeSubMenu
        menu.addItem(modeMenuItem)

        let cycleItem = NSMenuItem(title: "Manage Cycle", action: #selector(manageCycle), keyEquivalent: "")
        cycleItem.target = self
        menu.addItem(cycleItem)

        let thresholdItem = NSMenuItem(title: "Counter Threshold", action: #selector(setNotificationThreshold), keyEquivalent: "")
        thresholdItem.target = self
        menu.addItem(thresholdItem)

        let timeThresholdItem = NSMenuItem(title: "Time Threshold", action: #selector(setTimeNotificationThreshold), keyEquivalent: "")
        timeThresholdItem.target = self
        menu.addItem(timeThresholdItem)

        let statsItem = NSMenuItem(title: "Stats", action: #selector(showStats), keyEquivalent: "")
        statsItem.target = self
        menu.addItem(statsItem)

        let resetItem = NSMenuItem(title: "Reset Counter", action: #selector(resetCounter), keyEquivalent: "")
        resetItem.target = self
        menu.addItem(resetItem)

        menu.addItem(NSMenuItem.separator())

        let quitItem = NSMenuItem(title: "Quit", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        quitItem.target = NSApp
        menu.addItem(quitItem)

        return menu
    }

    // MARK: - Alert helper

    /// Presents an NSAlert centered on screen using beginSheetModal (async, no QoS inversion).
    /// Creates a transparent helper window as the sheet parent, then closes it on completion.
    private func presentAlert(_ alert: NSAlert, firstResponder: NSView? = nil, completion: @escaping (NSApplication.ModalResponse) -> Void) {
        let helperWindow = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 0, height: 0),
            styleMask: .borderless,
            backing: .buffered,
            defer: false
        )
        // Prevent double-free: NSWindow's isReleasedWhenClosed defaults to true,
        // which causes the window to deallocate on close() while ARC still holds
        // a strong reference inside the closure — resulting in EXC_BAD_ACCESS.
        helperWindow.isReleasedWhenClosed = false
        helperWindow.isOpaque = false
        helperWindow.backgroundColor = .clear
        helperWindow.level = .floating
        helperWindow.center()
        NSApp.activate(ignoringOtherApps: true)
        helperWindow.makeKeyAndOrderFront(nil)

        alert.beginSheetModal(for: helperWindow) { response in
            completion(response) // read field values before window closes
            helperWindow.close()
        }

        if let fr = firstResponder {
            DispatchQueue.main.async {
                alert.window.makeFirstResponder(fr)
            }
        }
    }

    // MARK: - Cycle management

    @objc private func manageCycle() {
        let alert = NSAlert()
        alert.messageText = "Manage Cycle"
        alert.informativeText = "Enter entries as \"Label\" or \"Label:duration\" separated by commas.\nExample: Admin:10m, Learning:15m, Building\nOmit duration to use the global default below."
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.addButton(withTitle: "Cancel")

        let container = NSView(frame: NSRect(x: 0, y: 0, width: 360, height: 224))

        let items = cycleItems
        let durations = cycleDurations
        let currentValue = items.enumerated().map { i, label -> String in
            let dur = i < durations.count ? durations[i] : 0
            return dur > 0 ? "\(label):\(formatDuration(dur))" : label
        }.joined(separator: ", ")

        let labelsField = NSTextField(frame: NSRect(x: 0, y: 200, width: 360, height: 24))
        labelsField.stringValue = currentValue
        labelsField.placeholderString = "Admin:10m, Learning:15m, Building"

        let indexLabel = NSTextField(labelWithString: "Start at index (0-based):")
        indexLabel.frame = NSRect(x: 0, y: 176, width: 180, height: 17)
        let indexField = NSTextField(frame: NSRect(x: 185, y: 174, width: 60, height: 22))
        indexField.stringValue = "\(cycleIndex)"

        let globalDurLabel = NSTextField(labelWithString: "Global default duration:")
        globalDurLabel.frame = NSRect(x: 0, y: 150, width: 180, height: 17)
        let globalDurField = NSTextField(frame: NSRect(x: 185, y: 148, width: 80, height: 22))
        globalDurField.stringValue = formatDuration(countdownDuration)
        globalDurField.placeholderString = "e.g. 10m"

        let goalLabel = NSTextField(labelWithString: "Stacking goal (±level threshold):")
        goalLabel.frame = NSRect(x: 0, y: 124, width: 210, height: 17)
        let goalField = NSTextField(frame: NSRect(x: 215, y: 122, width: 80, height: 22))
        goalField.stringValue = formatDuration(stackingGoal)
        goalField.placeholderString = "e.g. 15m"

        let positiveOnlyCheckbox = NSButton(checkboxWithTitle: "Positive threshold only (no penalty for going behind)", target: nil, action: nil)
        positiveOnlyCheckbox.frame = NSRect(x: 0, y: 98, width: 360, height: 22)
        positiveOnlyCheckbox.state = stackingGoalPositiveOnly ? .on : .off

        let upperLimitLabel = NSTextField(labelWithString: "Stacking upper limit (blank = none):")
        upperLimitLabel.frame = NSRect(x: 0, y: 72, width: 220, height: 17)
        let upperLimitField = NSTextField(frame: NSRect(x: 225, y: 70, width: 80, height: 22))
        upperLimitField.stringValue = stackingUpperLimit > 0 ? formatDuration(stackingUpperLimit) : ""
        upperLimitField.placeholderString = "e.g. 10m"

        let cdTargetLabel = NSTextField(labelWithString: "Countdown target (# of presses):")
        cdTargetLabel.frame = NSRect(x: 0, y: 46, width: 220, height: 17)
        let cdTargetField = NSTextField(frame: NSRect(x: 225, y: 44, width: 80, height: 22))
        cdTargetField.stringValue = "\(countdownTarget)"
        cdTargetField.placeholderString = "e.g. 10"

        let overlayCheckbox = NSButton(checkboxWithTitle: "Show Cycle Label on Press", target: nil, action: nil)
        overlayCheckbox.frame = NSRect(x: 0, y: 12, width: 360, height: 22)
        overlayCheckbox.state = showCycleLabelOverlay ? .on : .off

        container.addSubview(labelsField)
        container.addSubview(indexLabel)
        container.addSubview(indexField)
        container.addSubview(globalDurLabel)
        container.addSubview(globalDurField)
        container.addSubview(goalLabel)
        container.addSubview(goalField)
        container.addSubview(positiveOnlyCheckbox)
        container.addSubview(upperLimitLabel)
        container.addSubview(upperLimitField)
        container.addSubview(cdTargetLabel)
        container.addSubview(cdTargetField)
        container.addSubview(overlayCheckbox)
        alert.accessoryView = container

        presentAlert(alert, firstResponder: labelsField) { [weak self] response in
            guard let self = self, response == .alertFirstButtonReturn else { return }

            self.showCycleLabelOverlay = (overlayCheckbox.state == .on)

            self.stackingGoalPositiveOnly = (positiveOnlyCheckbox.state == .on)

            let globalDurInput = globalDurField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)
            if let newSeconds = self.parseDuration(globalDurInput), newSeconds > 0 {
                self.countdownDuration = newSeconds
                UserDefaults.standard.set(newSeconds, forKey: self.countdownDefaultsKey)
            }

            let goalInput = goalField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)
            if let goalSeconds = self.parseDuration(goalInput), goalSeconds > 0 {
                self.stackingGoal = goalSeconds
            }

            let upperLimitInput = upperLimitField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)
            if upperLimitInput.isEmpty {
                self.stackingUpperLimit = 0  // no limit
            } else if let limitSeconds = self.parseDuration(upperLimitInput), limitSeconds > 0 {
                self.stackingUpperLimit = limitSeconds
            }

            let cdTargetInput = cdTargetField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)
            if let target = Int(cdTargetInput), target > 0 {
                self.countdownTarget = target
            }

            let raw = labelsField.stringValue
            let entries = raw.split(separator: ",").map { $0.trimmingCharacters(in: .whitespaces) }.filter { !$0.isEmpty }
            var newLabels: [String] = []
            var newDurations: [Int] = []

            for entry in entries {
                if let colonRange = entry.range(of: ":") {
                    let label = String(entry[entry.startIndex..<colonRange.lowerBound]).trimmingCharacters(in: .whitespaces)
                    let durStr = String(entry[colonRange.upperBound...]).trimmingCharacters(in: .whitespaces)
                    newLabels.append(label)
                    newDurations.append(self.parseDuration(durStr) ?? 0)
                } else {
                    newLabels.append(entry)
                    newDurations.append(0)
                }
            }

            self.cycleItems = newLabels
            self.cycleDurations = newDurations

            if let requested = Int(indexField.stringValue), requested >= 0, requested < newLabels.count {
                self.cycleIndex = requested
            } else {
                self.cycleIndex = 0
            }
            self.updateStatusBarTitle()
        }
    }

    // MARK: - Stacking Mode helpers

    /// Number of fully completed tasks (splits banked) in the current stacking session.
    /// Zero until the second Ctrl+Space press (first split is tallied at that point).
    private var stackingCompletedTaskCount: Int {
        return stackingSplitCount
    }

    /// Handles a level-up (+1) or level-down (-1) transition in stacking mode.
    /// firstTimer resets to 0. timeSplit is recomputed from the global avg across all splits
    /// and then frozen until the next level change.
    private func performLevelTransition(direction: Int) {
        stackingLevel = max(1, stackingLevel + direction)

        // firstTimer always starts fresh at 0 — no carryover
        stackingTotalTimeLeft = 0

        // Recompute frozen timeSplit from global avg across every split ever banked
        if stackingGlobalTotalSplits > 0 {
            let globalAvg = stackingGlobalSumCount / Double(stackingGlobalTotalSplits)
            stackingCurrentAvg = Int((globalAvg * 1.25).rounded())
        } else {
            stackingCurrentAvg = countdownDuration
        }

        // Reset per-level split accumulators
        stackingSplitTotalElapsed = 0
        stackingSplitCount = 0
        stackingCurrentSplitElapsed = 0

        // Apply the now-frozen avg as the new section time
        stackingSectionTimeLeft = stackingCurrentAvg
        stackingSectionExhausted = false
    }

    // MARK: - Mode toggle

    /// Called by submenu items — switches directly to the chosen mode.
    @objc private func selectMode(_ sender: NSMenuItem) {
        guard let rawValue = sender.representedObject as? String,
              let chosen = TimerMode(rawValue: rawValue),
              chosen != currentMode else { return }
        currentMode = chosen
        resetAllModeState()
        updateStatusBarTitle()
    }

    /// Legacy toggle kept for any existing callers; now just cycles forward.
    @objc private func toggleMode() {
        switch currentMode {
        case .default:   currentMode = .stacking
        case .stacking:  currentMode = .countdown
        case .countdown: currentMode = .default
        }
        resetAllModeState()
        updateStatusBarTitle()
    }

    /// Resets all mode-specific runtime state (called on any mode switch or full reset).
    private func resetAllModeState() {
        countdownTimer?.invalidate()
        countdownTimer = nil
        sleepStartDate = nil
        // Stacking
        stackingIsActive = false
        stackingLevel = 1
        stackingTotalTimeLeft = 0
        stackingSectionTimeLeft = 0
        stackingSectionExhausted = false
        stackingCurrentAvg = 0
        stackingSplitTotalElapsed = 0
        stackingSplitCount = 0
        stackingCurrentSplitElapsed = 0
        stackingGlobalSumCount = 0
        stackingGlobalTotalSplits = 0
        stackingLastSplitDelta = 0
        stackingPendingDowngrade = false
        // Countdown
        cdIsActive = false
        cdRemaining = countdownTarget
        cdAheadBehind = 0
        cdTotalAheadBehind = 0
        cdSectionTimeLeft = countdownDuration
        cdCurrentSplitElapsed = 0
        cdLastSplitDelta = 0
        cdPendingTransfer = 0
        cdLevel = 1
        cdFinished = false
        cdTotalTimeLeft = 0
    }

    private func updateModeMenuItem() {
        // Update checkmarks on submenu items to reflect active mode
        guard let subMenu = modeMenuItem.submenu else { return }
        for item in subMenu.items {
            item.state = (item.representedObject as? String) == currentMode.rawValue ? .on : .off
        }
    }

    private func updatePauseResumeMenuItem() {
        pauseResumeMenuItem.title = isPaused ? "Resume Timer" : "Pause Timer"
    }

    // MARK: - Status bar title

    /// Formats seconds as M:SS, allowing negatives (e.g. -1:05 for -65s).
    private func formatTimeAllowNeg(_ seconds: Int) -> String {
        let neg = seconds < 0
        let abs_s = abs(seconds)
        let m = abs_s / 60
        let s = abs_s % 60
        return "\(neg ? "-" : "")\(m):\(String(format: "%02d", s))"
    }

    private func updateStatusBarTitle() {
        let title: String

        switch currentMode {
        case .default:
            var t = "\(currentCycleLabel): \(commandRCount)"
            if countdownTimer != nil && timeLeft > 0 {
                let minutes = timeLeft / 60
                let seconds = timeLeft % 60
                let icon = isPaused ? "⏸" : "⏳"
                t += " | \(icon) \(String(format: "%d:%02d", minutes, seconds))"
            }
            title = t

        case .stacking:
            if stackingIsActive {
                let levelStr = "L\(stackingLevel)"
                let totalStr = formatTimeAllowNeg(stackingTotalTimeLeft)
                let sectionStr = formatTimeAllowNeg(stackingSectionTimeLeft)
                title = "\(levelStr) | \(totalStr) | \(sectionStr)"
            } else {
                // Not yet started: show idle state
                title = "L\(stackingLevel) | 0:00 | \(formatTimeAllowNeg(countdownDuration))"
            }

        case .countdown:
            if cdFinished {
                title = "Countdown: 0 | Done"
            } else if cdIsActive {
                let finishDate = Date().addingTimeInterval(TimeInterval(max(0, cdTotalTimeLeft)))
                let timeFormatter = DateFormatter()
                timeFormatter.dateFormat = "h:mm a"
                let finishStr = timeFormatter.string(from: finishDate)

                let totalSignedSecs = cdTotalAheadBehind
                let totalSign = totalSignedSecs >= 0 ? "+" : "-"
                let absTotal = abs(totalSignedSecs)
                let totalH = absTotal / 3600
                let totalM = (absTotal % 3600) / 60
                let totalS = absTotal % 60
                let totalStr = "\(totalSign)\(String(format: "%d:%02d:%02d", totalH, totalM, totalS))"

                let aheadStr    = formatTimeAllowNeg(cdAheadBehind)
                let sectionStr  = formatTimeAllowNeg(cdSectionTimeLeft)
                let totalTimeStr = formatTimeAllowNeg(cdTotalTimeLeft)

                title = "Countdown: \(cdRemaining) | \(totalTimeStr) | \(aheadStr) | \(sectionStr) | \(finishStr) \(totalStr)"
            } else {
                // Idle: show target and expected total
                let expectedTotal = countdownTarget * countdownDuration
                let finishDate = Date().addingTimeInterval(TimeInterval(expectedTotal))
                let timeFormatter = DateFormatter()
                timeFormatter.dateFormat = "h:mm a"
                let finishStr = timeFormatter.string(from: finishDate)
                let totalTimeStr = formatTimeAllowNeg(expectedTotal)
                title = "Countdown: \(countdownTarget) | \(totalTimeStr) | 0:00 | \(formatTimeAllowNeg(countdownDuration)) | \(finishStr) +0:00:00"
            }
        }

        statusBarItem.button?.title = title
    }

    // MARK: - Stats Menu Action
    
    @objc private func showStats() {
        let alert = NSAlert()
        alert.messageText = "Stats"
        alert.informativeText = "Counter: \(commandRCount)"
        if currentMode == .stacking {
            alert.informativeText += "\nCompleted Tasks: \(stackingCompletedTaskCount)"
        } else if currentMode == .countdown {
            let done = countdownTarget - cdRemaining
            alert.informativeText += "\nCompleted: \(done) / \(countdownTarget)"
            if cdIsActive {
                alert.informativeText += "\nTotal time left: \(formatTimeAllowNeg(cdTotalTimeLeft))"
                alert.informativeText += "\nAhead/Behind: \(formatTimeAllowNeg(cdAheadBehind))"
            }
        }
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        presentAlert(alert) { _ in }
    }

    // MARK: - Reset

    @objc private func resetCounter() {
        // Save state for undo (same as Ctrl+Space)
        previousCount = commandRCount
        previousTimeLeft = timeLeft
        previousCycleIndex = cycleIndex
        previousStackingIsActive = stackingIsActive
        previousStackingLevel = stackingLevel
        previousStackingTotalTimeLeft = stackingTotalTimeLeft
        previousStackingSectionTimeLeft = stackingSectionTimeLeft
        previousStackingSectionExhausted = stackingSectionExhausted
        previousStackingCurrentAvg = stackingCurrentAvg
        previousStackingSplitTotalElapsed = stackingSplitTotalElapsed
        previousStackingSplitCount = stackingSplitCount
        previousStackingCurrentSplitElapsed = stackingCurrentSplitElapsed

        previousStackingGlobalSumCount = stackingGlobalSumCount
        previousStackingGlobalTotalSplits = stackingGlobalTotalSplits
        previousStackingLastSplitDelta = stackingLastSplitDelta
        previousStackingPendingDowngrade = stackingPendingDowngrade

        prevCdIsActive = cdIsActive
        prevCdRemaining = cdRemaining
        prevCdAheadBehind = cdAheadBehind
        prevCdTotalAheadBehind = cdTotalAheadBehind
        prevCdSectionTimeLeft = cdSectionTimeLeft
        prevCdCurrentSplitElapsed = cdCurrentSplitElapsed
        prevCdLastSplitDelta = cdLastSplitDelta
        prevCdPendingTransfer = cdPendingTransfer
        prevCdLevel = cdLevel
        prevCdFinished = cdFinished
        prevCdTotalTimeLeft = cdTotalTimeLeft

        commandRCount = 0
        stopSound()
        timeLeft = 0
        isPaused = false
        resetAllModeState()
        updateStatusBarTitle()
    }

    // MARK: - Alert inputs

    @objc private func setNotificationThreshold() {
        let alert = NSAlert()
        alert.messageText = "Counter Threshold"
        alert.informativeText = "Enter the number of Control + Space presses before a notification is sent."
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.addButton(withTitle: "Cancel")

        let inputField = NSTextField(frame: NSRect(x: 0, y: 0, width: 200, height: 24))
        inputField.stringValue = "\(notificationThreshold)"
        alert.accessoryView = inputField

        presentAlert(alert, firstResponder: inputField) { [weak self] response in
            guard let self = self, response == .alertFirstButtonReturn else { return }
            if let newValue = Int(inputField.stringValue), newValue > 0 {
                self.notificationThreshold = newValue
            }
        }
    }

    @objc private func setCountdownDuration() {
        let alert = NSAlert()
        alert.messageText = "Countdown Duration"
        alert.informativeText = "Enter countdown duration (e.g. 90s, 1m30s, 2m)."
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.addButton(withTitle: "Cancel")

        let inputField = NSTextField(frame: NSRect(x: 0, y: 0, width: 200, height: 24))
        inputField.stringValue = formatDuration(countdownDuration)
        alert.accessoryView = inputField

        presentAlert(alert, firstResponder: inputField) { [weak self] response in
            guard let self = self, response == .alertFirstButtonReturn else { return }
            let input = inputField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)
            if let newSeconds = self.parseDuration(input) {
                self.countdownDuration = newSeconds
                UserDefaults.standard.set(newSeconds, forKey: self.countdownDefaultsKey)
            }
        }
    }

    @objc private func setTimeNotificationThreshold() {
        let alert = NSAlert()
        alert.messageText = "Set Time Notification Threshold"
        alert.informativeText = "Enter the number of minutes of accumulated time before a notification is sent."
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.addButton(withTitle: "Cancel")

        let inputField = NSTextField(frame: NSRect(x: 0, y: 0, width: 200, height: 24))
        inputField.stringValue = "\(timeNotificationThreshold / 60)"
        alert.accessoryView = inputField

        presentAlert(alert, firstResponder: inputField) { [weak self] response in
            guard let self = self, response == .alertFirstButtonReturn else { return }
            if let newValue = Int(inputField.stringValue), newValue > 0 {
                self.timeNotificationThreshold = newValue * 60
            }
        }
    }

    // MARK: - Sleep / Lock observers

    private func registerSleepLockObservers() {
        let workspaceNC = NSWorkspace.shared.notificationCenter
        
        // System sleep, screen sleep, and screen lock
        workspaceNC.addObserver(self, selector: #selector(handleSleepOrLock),
                                name: NSWorkspace.willSleepNotification, object: nil)
        workspaceNC.addObserver(self, selector: #selector(handleSleepOrLock),
                                name: NSWorkspace.screensDidSleepNotification, object: nil)
        DistributedNotificationCenter.default().addObserver(self, selector: #selector(handleSleepOrLock),
                                                            name: NSNotification.Name("com.apple.screenIsLocked"),
                                                            object: nil)
        
        // System wake, screen wake, and screen unlock
        workspaceNC.addObserver(self, selector: #selector(handleWakeOrUnlock),
                                name: NSWorkspace.didWakeNotification, object: nil)
        workspaceNC.addObserver(self, selector: #selector(handleWakeOrUnlock),
                                name: NSWorkspace.screensDidWakeNotification, object: nil)
        DistributedNotificationCenter.default().addObserver(self, selector: #selector(handleWakeOrUnlock),
                                                            name: NSNotification.Name("com.apple.screenIsUnlocked"),
                                                            object: nil)
    }

    @objc private func handleSleepOrLock() {
        guard !isPaused else { return }
        
        // Stop audio immediately
        stopSound()
        
        // Only set sleepStart if we haven't already captured it during this sleep transition
        if sleepStartDate == nil {
            sleepStartDate = Date()
        }
    }
    
    @objc private func handleWakeOrUnlock() {
        guard let sleepStart = sleepStartDate else { return }
        sleepStartDate = nil
        
        guard !isPaused else { return }
        
        let elapsedSeconds = Int(Date().timeIntervalSince(sleepStart))
        guard elapsedSeconds > 0 else { return }
        
        applyElapsedSleepTime(elapsedSeconds)
    }
    
    private func applyElapsedSleepTime(_ elapsed: Int) {
        switch currentMode {
        case .default:
            if countdownTimer != nil && timeLeft > 0 {
                timeLeft = max(0, timeLeft - elapsed)
                updateStatusBarTitle()
                
                if timeLeft == 0 {
                    countdownTimer?.invalidate()
                    countdownTimer = nil
                    updateStatusBarTitle()
                    playSoundLoop()
                }
            }
            
        case .stacking:
            if stackingIsActive {
                let S = stackingSectionTimeLeft
                stackingSectionTimeLeft -= elapsed
                stackingCurrentSplitElapsed += elapsed
                
                var decrements = 0
                if S <= 0 {
                    decrements = elapsed
                } else if S <= elapsed {
                    decrements = elapsed - S + 1
                }
                
                if decrements > 0 {
                    stackingTotalTimeLeft -= decrements
                    if stackingTotalTimeLeft <= -stackingGoal && !stackingPendingDowngrade {
                        stackingPendingDowngrade = true
                    }
                }
                updateStatusBarTitle()
            }

        case .countdown:
            if cdIsActive && !cdFinished {
                let S = cdSectionTimeLeft
                cdSectionTimeLeft -= elapsed
                cdCurrentSplitElapsed += elapsed

                var decrements = 0
                if S <= 0 {
                    decrements = elapsed
                } else if S <= elapsed {
                    decrements = elapsed - S + 1
                }

                if decrements > 0 && cdPendingTransfer == 0 {
                    cdAheadBehind -= decrements
                    if !stackingGoalPositiveOnly && cdAheadBehind <= -stackingGoal {
                        cdPendingTransfer = -1
                    }
                }
                updateStatusBarTitle()
            }
        }
    }

    // MARK: - Event monitor

    private func startGlobalEventMonitor() {
        let mask = CGEventMask(1 << CGEventType.keyDown.rawValue)
        let selfPtr = Unmanaged.passRetained(self).toOpaque()
        eventTapSelfPtr = selfPtr

        guard let tap = CGEvent.tapCreate(
            tap: .cgSessionEventTap,
            place: .headInsertEventTap,
            options: .defaultTap,
            eventsOfInterest: mask,
            callback: { proxy, type, event, refcon -> Unmanaged<CGEvent>? in
                guard let refcon = refcon else { return Unmanaged.passRetained(event) }
                let controller = Unmanaged<MenuBarController>.fromOpaque(refcon).takeUnretainedValue()
                return controller.handleCGEvent(type: type, event: event)
            },
            userInfo: selfPtr
        ) else {
            Unmanaged<MenuBarController>.fromOpaque(selfPtr).release()
            eventTapSelfPtr = nil
            print("CGEventTap creation failed — grant Accessibility permission in System Settings")
            return
        }

        eventTap = tap
        runLoopSource = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, tap, 0)
        CFRunLoopAddSource(CFRunLoopGetMain(), runLoopSource, .commonModes)
        CGEvent.tapEnable(tap: tap, enable: true)
    }

    private func handleCGEvent(type: CGEventType, event: CGEvent) -> Unmanaged<CGEvent>? {
        guard type == .keyDown else { return Unmanaged.passRetained(event) }

        let keyCode = event.getIntegerValueField(.keyboardEventKeycode)
        let flags = event.flags

        let hasControl = flags.contains(.maskControl)
        let hasShift   = flags.contains(.maskShift)
        let hasCommand = flags.contains(.maskCommand)

        let isCtrlSpace      = keyCode == 49 && hasControl && !hasShift && !hasCommand
        let isCtrlShiftSpace = keyCode == 49 && hasControl &&  hasShift && !hasCommand
        let isCmdCtrlC       = keyCode == 34 && hasControl &&  hasCommand

        guard isCtrlSpace || isCtrlShiftSpace || isCmdCtrlC else {
            return Unmanaged.passRetained(event) // not our shortcut — pass through
        }

        // ── Stacking mode: apply all state mutations synchronously so the menu bar
        //    updates on this run loop turn. The async block handles sound + overlay only.
        if isCtrlSpace && currentMode == .stacking {
            // Save undo snapshot
            previousCount                  = commandRCount
            previousTimeLeft               = timeLeft
            previousCycleIndex             = cycleIndex
            previousStackingIsActive       = stackingIsActive
            previousStackingLevel          = stackingLevel
            previousStackingTotalTimeLeft  = stackingTotalTimeLeft
            previousStackingSectionTimeLeft = stackingSectionTimeLeft
            previousStackingSectionExhausted = stackingSectionExhausted
            previousStackingCurrentAvg     = stackingCurrentAvg
            previousStackingSplitTotalElapsed = stackingSplitTotalElapsed
            previousStackingSplitCount     = stackingSplitCount
            previousStackingCurrentSplitElapsed = stackingCurrentSplitElapsed
            previousStackingGlobalSumCount = stackingGlobalSumCount
            previousStackingGlobalTotalSplits = stackingGlobalTotalSplits
            previousStackingLastSplitDelta = stackingLastSplitDelta
            previousStackingPendingDowngrade = stackingPendingDowngrade

            commandRCount += 1

            if !stackingIsActive {
                // First press
                stackingIsActive           = true
                stackingLevel              = 1
                stackingTotalTimeLeft      = 0
                stackingSectionTimeLeft    = countdownDuration
                stackingSectionExhausted   = false
                stackingCurrentAvg         = 0
                stackingSplitTotalElapsed  = 0
                stackingSplitCount         = 0
                stackingCurrentSplitElapsed = 0
                stackingGlobalSumCount     = 0
                stackingGlobalTotalSplits  = 0
                stackingLastSplitDelta     = 0
            } else {
                // Subsequent press: bank section time, tally split
                let sectionRemaining = stackingSectionTimeLeft
                if sectionRemaining > 0 { stackingTotalTimeLeft += sectionRemaining }

                // Cap total at upper limit if one is set
                let limit = stackingUpperLimit
                if limit > 0 && stackingTotalTimeLeft > limit {
                    stackingTotalTimeLeft = limit
                }

                let splitDuration = stackingCurrentSplitElapsed
                let frozenAvg = stackingCurrentAvg > 0 ? stackingCurrentAvg : countdownDuration
                stackingLastSplitDelta = frozenAvg - splitDuration

                stackingGlobalSumCount    += Double(splitDuration)
                stackingGlobalTotalSplits += 1
                stackingSplitTotalElapsed += Double(splitDuration)
                stackingSplitCount        += 1
                stackingCurrentSplitElapsed = 0

                var levelChange = 0
                if stackingPendingDowngrade && !stackingGoalPositiveOnly {
                    stackingPendingDowngrade = false
                    levelChange = -1
                } else if stackingPendingDowngrade {
                    // positive-only: clear the flag but don't apply the downgrade
                    stackingPendingDowngrade = false
                } else if stackingTotalTimeLeft >= stackingGoal {
                    levelChange = +1
                }

                if levelChange != 0 {
                    performLevelTransition(direction: levelChange)
                } else {
                    let frozen = stackingCurrentAvg > 0 ? stackingCurrentAvg : countdownDuration
                    stackingSectionTimeLeft  = frozen
                    stackingSectionExhausted = false
                }
            }

            updateStatusBarTitle()

            // Async block: sound, timer start, overlay only
            let wasFirstPress = !previousStackingIsActive
            let levelChanged  = stackingLevel != previousStackingLevel
            let wentUp        = stackingLevel > previousStackingLevel
            let capturedLevel = stackingLevel
            let capturedTotal = stackingTotalTimeLeft
            let capturedDelta = stackingLastSplitDelta
            let capturedAvg   = stackingCurrentAvg

            DispatchQueue.main.async { [weak self] in
                guard let self = self else { return }
                self.stopSound()
                if self.commandRCount > 1 { self.advanceCycleIndex() }
                self.isPaused = false
                self.playResetSound()
                if wasFirstPress { self.startCountdownTimer() }

                if self.showCycleLabelOverlay {
                    let levelStr = "L\(capturedLevel)"
                    if levelChanged {
                        let tag    = wentUp ? "(Upgrade)" : "(Downgrade)"
                        let avgStr = self.formatTimeAllowNeg(capturedAvg)
                        self.showOverlay("\(levelStr) \(tag) | \(avgStr)", levelUp: wentUp)
                    } else {
                        let totalStr = self.formatTimeAllowNeg(capturedTotal)
                        let delta    = capturedDelta
                        let deltaStr = delta >= 0
                            ? "+\(self.formatTimeAllowNeg(delta))"
                            : self.formatTimeAllowNeg(delta)
                        self.showOverlay("\(levelStr) | \(totalStr) | \(deltaStr)", splitDeltaPositive: delta >= 0)
                    }
                }
            }
            return nil // consume event
        }

        // ── Countdown mode: same synchronous pattern as stacking
        if isCtrlSpace && currentMode == .countdown {
            guard !cdFinished else { return nil } // already done, swallow silently

            // Save undo snapshot
            previousCount      = commandRCount
            previousTimeLeft   = timeLeft
            previousCycleIndex = cycleIndex
            prevCdIsActive             = cdIsActive
            prevCdRemaining            = cdRemaining
            prevCdAheadBehind          = cdAheadBehind
            prevCdTotalAheadBehind     = cdTotalAheadBehind
            prevCdSectionTimeLeft      = cdSectionTimeLeft
            prevCdCurrentSplitElapsed  = cdCurrentSplitElapsed
            prevCdLastSplitDelta       = cdLastSplitDelta
            prevCdPendingTransfer      = cdPendingTransfer
            prevCdLevel                = cdLevel
            prevCdFinished             = cdFinished
            prevCdTotalTimeLeft        = cdTotalTimeLeft

            commandRCount += 1

            if !cdIsActive {
                // First press — start session
                cdIsActive            = true
                cdRemaining           = countdownTarget   // will be decremented on 2nd press
                cdAheadBehind         = 0
                cdTotalAheadBehind    = 0
                cdSectionTimeLeft     = countdownDuration
                cdCurrentSplitElapsed = 0
                cdLastSplitDelta      = 0
                cdPendingTransfer     = 0
                cdLevel               = 1
                cdFinished            = false
                cdTotalTimeLeft       = countdownTarget * countdownDuration
            } else {
                // Subsequent press: bank remaining section time into aheadBehind
                let sectionRemaining = cdSectionTimeLeft
                if sectionRemaining > 0 { cdAheadBehind += sectionRemaining }

                // Compute split delta (frozen avg = countdownDuration)
                cdLastSplitDelta = countdownDuration - cdCurrentSplitElapsed
                cdCurrentSplitElapsed = 0

                let totalAheadBehindBefore = cdTotalAheadBehind

                // Apply any pending negative transfer flagged by the timer
                if cdPendingTransfer < 0 && !stackingGoalPositiveOnly {
                    // Drain all accumulated negative chunks
                    let chunks = (-cdAheadBehind) / stackingGoal
                    if chunks > 0 {
                        cdTotalAheadBehind -= chunks * stackingGoal
                        cdLevel = max(1, cdLevel - chunks)
                        cdAheadBehind += chunks * stackingGoal
                    }
                    cdPendingTransfer = 0
                } else if cdPendingTransfer < 0 {
                    // positive-only: clear flag, no penalty applied
                    cdPendingTransfer = 0
                }

                // Check positive threshold right here — banking is the only way aheadBehind grows
                if cdAheadBehind >= stackingGoal {
                    let chunks = cdAheadBehind / stackingGoal
                    cdTotalAheadBehind += chunks * stackingGoal
                    cdLevel += chunks
                    cdAheadBehind -= chunks * stackingGoal
                }

                // Adjust total time left by whatever changed in cdTotalAheadBehind this press
                let totalAheadBehindDelta = cdTotalAheadBehind - totalAheadBehindBefore
                cdTotalTimeLeft -= totalAheadBehindDelta

                // Decrement remaining after banking (this press counts as completing a segment)
                cdRemaining = max(0, cdRemaining - 1)

                if cdRemaining == 0 {
                    // Final press
                    cdFinished = true
                    cdSectionTimeLeft = 0
                } else {
                    cdSectionTimeLeft = countdownDuration
                }
            }

            updateStatusBarTitle()

            // Async: sound, timer start, overlay
            let wasFirstCdPress = !prevCdIsActive
            let capturedLevel   = cdLevel
            let capturedAhead   = cdAheadBehind
            let capturedDelta   = cdLastSplitDelta
            let finished        = cdFinished

            DispatchQueue.main.async { [weak self] in
                guard let self = self else { return }
                self.stopSound()
                if self.commandRCount > 1 { self.advanceCycleIndex() }
                self.isPaused = false

                if finished {
                    self.sendCountdownCompleteNotification()
                    self.countdownTimer?.invalidate()
                    self.countdownTimer = nil
                    self.playSoundLoop()
                } else {
                    self.playResetSound()
                    if wasFirstCdPress { self.startCountdownTimer() }
                }

                if self.showCycleLabelOverlay {
                    if finished {
                        self.showOverlay("✓ Done! L\(capturedLevel)")
                    } else {
                        let aheadStr  = self.formatTimeAllowNeg(capturedAhead)
                        let delta     = capturedDelta
                        let deltaStr  = delta >= 0
                            ? "+\(self.formatTimeAllowNeg(delta))"
                            : self.formatTimeAllowNeg(delta)
                        self.showOverlay("L\(capturedLevel) | \(aheadStr) | \(deltaStr)",
                                         splitDeltaPositive: delta >= 0)
                    }
                }
            }
            return nil
        }
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }

            if isCmdCtrlC {
                self.togglePauseResume()

            } else if isCtrlShiftSpace {
                self.stopSound()
                self.countdownTimer?.invalidate()
                self.countdownTimer = nil
                self.commandRCount = self.previousCount
                self.timeLeft = self.previousTimeLeft
                self.cycleIndex = self.previousCycleIndex
                // Restore stacking state snapshot
                self.stackingIsActive = self.previousStackingIsActive
                self.stackingLevel = self.previousStackingLevel
                self.stackingTotalTimeLeft = self.previousStackingTotalTimeLeft
                self.stackingSectionTimeLeft = self.previousStackingSectionTimeLeft
                self.stackingSectionExhausted = self.previousStackingSectionExhausted
                self.stackingCurrentAvg = self.previousStackingCurrentAvg
                self.stackingSplitTotalElapsed = self.previousStackingSplitTotalElapsed
                self.stackingSplitCount = self.previousStackingSplitCount
                self.stackingCurrentSplitElapsed = self.previousStackingCurrentSplitElapsed
                self.stackingGlobalSumCount = self.previousStackingGlobalSumCount
                self.stackingGlobalTotalSplits = self.previousStackingGlobalTotalSplits
                self.stackingLastSplitDelta = self.previousStackingLastSplitDelta
                self.stackingPendingDowngrade = self.previousStackingPendingDowngrade
                // Restore countdown state snapshot
                self.cdIsActive            = self.prevCdIsActive
                self.cdRemaining           = self.prevCdRemaining
                self.cdAheadBehind         = self.prevCdAheadBehind
                self.cdTotalAheadBehind    = self.prevCdTotalAheadBehind
                self.cdSectionTimeLeft     = self.prevCdSectionTimeLeft
                self.cdCurrentSplitElapsed = self.prevCdCurrentSplitElapsed
                self.cdLastSplitDelta      = self.prevCdLastSplitDelta
                self.cdPendingTransfer     = self.prevCdPendingTransfer
                self.cdLevel               = self.prevCdLevel
                self.cdFinished            = self.prevCdFinished
                self.cdTotalTimeLeft       = self.prevCdTotalTimeLeft
                self.isPaused = false
                if self.currentMode == .stacking {
                    if self.stackingIsActive {
                        self.startCountdownTimer()
                    } else {
                        self.updateStatusBarTitle()
                    }
                } else if self.currentMode == .countdown {
                    if self.cdIsActive && !self.cdFinished {
                        self.startCountdownTimer()
                    } else {
                        self.updateStatusBarTitle()
                    }
                } else {
                    if self.timeLeft > 0 {
                        self.startCountdownTimer()
                    } else {
                        self.updateStatusBarTitle()
                    }
                }

            } else if isCtrlSpace {
                self.previousCount = self.commandRCount
                self.previousTimeLeft = self.timeLeft
                self.previousCycleIndex = self.cycleIndex
                // (stacking undo snapshot is saved synchronously before this block)

                self.stopSound()
                if self.commandRCount > 0 {
                    self.advanceCycleIndex()
                }
                self.commandRCount += 1
                self.isPaused = false
                self.playResetSound()

                switch self.currentMode {
                case .default:
                    self.timeLeft = self.currentCycleDuration

                case .stacking:
                    break // handled synchronously before this async block

                case .countdown:
                    break // handled synchronously before this async block
                }

                // Default mode overlay
                self.startCountdownTimer()
                if self.showCycleLabelOverlay && !self.cycleItems.isEmpty {
                    let mins = self.timeLeft / 60
                    let secs = self.timeLeft % 60
                    self.showOverlay("\(self.currentCycleLabel) : \(mins):\(String(format: "%02d", secs))")
                }
            }
        }

        return nil // consume — prevents macOS alert sound
    }

    private func stopGlobalEventMonitor() {
        if let tap = eventTap {
            CGEvent.tapEnable(tap: tap, enable: false)
            if let source = runLoopSource {
                CFRunLoopRemoveSource(CFRunLoopGetMain(), source, .commonModes)
            }
            eventTap = nil
            runLoopSource = nil
        }
        if let ptr = eventTapSelfPtr {
            Unmanaged<MenuBarController>.fromOpaque(ptr).release()
            eventTapSelfPtr = nil
        }
    }

    // MARK: - Notifications

    private func requestNotificationPermission() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound]) { granted, error in
            if let error = error {
                print("Notification authorization error: \(error)")
            }
        }
    }

    private func sendNotification() {
        let content = UNMutableNotificationContent()
        content.title = "Counter Reached \(notificationThreshold)"
        content.body = "You have triggered Control + Space \(notificationThreshold) times!"
        content.sound = .default

        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: nil)
        UNUserNotificationCenter.current().add(request, withCompletionHandler: nil)
    }

    private func sendTimeNotification() {
        let minutes = timeNotificationThreshold / 60
        let content = UNMutableNotificationContent()
        content.title = "Accumulated Time Threshold Reached"
        content.body = "\(minutes) minutes stacked!"
        content.sound = .default
        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: nil)
        UNUserNotificationCenter.current().add(request, withCompletionHandler: nil)
    }

    private func sendCountdownCompleteNotification() {
        let content = UNMutableNotificationContent()
        content.title = "Countdown Complete"
        content.body = "All \(countdownTarget) segments finished!"
        content.sound = .default
        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: nil)
        UNUserNotificationCenter.current().add(request, withCompletionHandler: nil)
    }

    // MARK: - Timer

    private func startCountdownTimer() {
        updateStatusBarTitle()

        // MARK: Stacking mode timer — runs continuously, never auto-stops
        if currentMode == .stacking {
            guard countdownTimer == nil else { return } // already running
            countdownTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
                guard let self = self else { return }
                if self.isPaused { return }

                self.stackingSectionTimeLeft -= 1
                self.stackingCurrentSplitElapsed += 1
                // firstTimer only ticks down once secondTimer is exhausted
                if self.stackingSectionTimeLeft <= 0 {
                    self.stackingTotalTimeLeft -= 1
                    // Flag a pending downgrade when total crosses the negative threshold;
                    // skipped when positive-only mode is on.
                    if !self.stackingGoalPositiveOnly &&
                       self.stackingTotalTimeLeft <= -self.stackingGoal &&
                       !self.stackingPendingDowngrade {
                        self.stackingPendingDowngrade = true
                    }
                }
                self.updateStatusBarTitle()
            }
            RunLoop.main.add(countdownTimer!, forMode: .common)
            return
        }

        // MARK: Countdown mode timer — ticks section and aheadBehind; stops when finished
        if currentMode == .countdown {
            guard countdownTimer == nil else { return }
            countdownTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] timer in
                guard let self = self else { return }
                if self.isPaused || self.cdFinished { return }

                self.cdSectionTimeLeft -= 1
                self.cdCurrentSplitElapsed += 1
                self.cdTotalTimeLeft -= 1

                // aheadBehind only ticks when section is exhausted (same gate as stacking)
                if self.cdSectionTimeLeft <= 0 {
                    self.cdAheadBehind -= 1
                    // Flag a pending negative transfer when aheadBehind crosses -goal;
                    // skipped when positive-only mode is on.
                    if !self.stackingGoalPositiveOnly &&
                       self.cdAheadBehind <= -self.stackingGoal &&
                       self.cdPendingTransfer == 0 {
                        self.cdPendingTransfer = -1
                    }
                }
                self.updateStatusBarTitle()
            }
            RunLoop.main.add(countdownTimer!, forMode: .common)
            return
        }

        // MARK: Default mode timer — counts down to zero then stops
        countdownTimer?.invalidate()
        countdownTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] timer in
            guard let self = self else { return }
            if self.isPaused { return }

            self.timeLeft -= 1
            self.updateStatusBarTitle()

            if self.timeLeft <= 0 {
                timer.invalidate()
                self.countdownTimer = nil
                self.timeLeft = 0
                self.updateStatusBarTitle()
                self.playSoundLoop()
            }
        }

        RunLoop.main.add(countdownTimer!, forMode: .common)
    }

    @objc private func togglePauseResume() {
        isPaused.toggle()

        if isPaused {
            stopSound()
            showOverlay("⏸ Paused")
        } else {
            if currentMode == .stacking {
                if countdownTimer == nil && stackingIsActive {
                    startCountdownTimer()
                }
                let sectionStr = formatTimeAllowNeg(stackingSectionTimeLeft)
                let resumeLabel = cycleItems.isEmpty ? "▶ Resumed | \(sectionStr)" : "▶ \(currentCycleLabel) | \(sectionStr)"
                showOverlay(resumeLabel)
            } else if currentMode == .countdown {
                if countdownTimer == nil && cdIsActive && !cdFinished {
                    startCountdownTimer()
                }
                let sectionStr = formatTimeAllowNeg(cdSectionTimeLeft)
                showOverlay("▶ Resumed | \(cdRemaining) left | \(sectionStr)")
            } else {
                if countdownTimer == nil && timeLeft > 0 {
                    startCountdownTimer()
                }
                let timeStr = timeLeft > 0 ? " | \(timeLeft / 60):\(String(format: "%02d", timeLeft % 60))" : ""
                let resumeLabel = cycleItems.isEmpty ? "▶ Resumed\(timeStr)" : "▶ \(currentCycleLabel)\(timeStr)"
                showOverlay(resumeLabel)
            }
        }
    }

    // MARK: - HUD Overlay

    private var overlayWindow: NSWindow?
    private var overlayFadeTimer: Timer?

    private func showOverlay(_ message: String, splitDeltaPositive: Bool? = nil, levelUp: Bool? = nil) {
        // Cancel any previous overlay immediately
        overlayFadeTimer?.invalidate()
        overlayFadeTimer = nil
        overlayWindow?.close() // Use close() to remove from AppKit window list
        overlayWindow = nil

        let padding: CGFloat = 24
        let font = NSFont.systemFont(ofSize: 28, weight: .semibold)

        // Build attributed string: color only the last segment (after final " | ") when delta is present
        let attrString: NSMutableAttributedString
        let centered = NSMutableParagraphStyle()
        centered.alignment = .center

        let fullRange = NSRange(message.startIndex..., in: message)
        let baseAttrs: [NSAttributedString.Key: Any] = [
            .font: font,
            .foregroundColor: NSColor.white,
            .paragraphStyle: centered
        ]

        if let isUp = levelUp, let parenRange = message.range(of: "(") {
            // Level change overlay: color the "(Upgrade)" or "(Downgrade)" tag
            attrString = NSMutableAttributedString(string: message, attributes: baseAttrs)
            let tagColor: NSColor = isUp
                ? NSColor(red: 0.25, green: 0.85, blue: 0.45, alpha: 1)
                : NSColor(red: 1,    green: 0.35, blue: 0.35, alpha: 1)
            // Color only the "(Upgrade)" / "(Downgrade)" tag — stop at the next " | " if present
            let tagEnd = message.range(of: " | ", range: parenRange.lowerBound..<message.endIndex)?.lowerBound ?? message.endIndex
            attrString.addAttribute(.foregroundColor, value: tagColor,
                                    range: NSRange(parenRange.lowerBound..<tagEnd, in: message))
        } else if let isPositive = splitDeltaPositive, let pipeRange = message.range(of: " | ", options: .backwards) {
            attrString = NSMutableAttributedString(string: message, attributes: baseAttrs)
            let deltaColor: NSColor = isPositive
                ? NSColor(red: 0.25, green: 0.85, blue: 0.45, alpha: 1)
                : NSColor(red: 1,    green: 0.35, blue: 0.35, alpha: 1)
            attrString.addAttribute(.foregroundColor, value: deltaColor,
                                    range: NSRange(pipeRange.upperBound..., in: message))
        } else {
            attrString = NSMutableAttributedString(string: message, attributes: baseAttrs)
        }
        _ = fullRange // suppress unused warning

        let textSize = (message as NSString).size(withAttributes: [.font: font])
        let winSize = NSSize(width: textSize.width + padding * 2,
                            height: textSize.height + padding * 1.4)

        let mouseLocation = NSEvent.mouseLocation
        let screen = NSScreen.screens.first(where: { NSMouseInRect(mouseLocation, $0.frame, false) })
                     ?? NSScreen.screens[0]
        let origin = NSPoint(
            x: screen.frame.midX - winSize.width / 2,
            y: screen.visibleFrame.midY - winSize.height / 2
        )

        let win = NSPanel(
            contentRect: NSRect(origin: origin, size: winSize),
            styleMask: [.borderless, .nonactivatingPanel],
            backing: .buffered,
            defer: false
        )
        win.isReleasedWhenClosed = false // Allow ARC to manage deallocation on close()
        win.isOpaque = false
        win.backgroundColor = .clear
        win.level = .screenSaver
        win.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary, .transient]
        win.ignoresMouseEvents = true
        win.hasShadow = true
        win.becomesKeyOnlyIfNeeded = true

        let container = NSView(frame: NSRect(origin: .zero, size: winSize))
        container.wantsLayer = true
        container.layer?.backgroundColor = NSColor(white: 0.1, alpha: 0.82).cgColor
        container.layer?.cornerRadius = 14
        container.layer?.masksToBounds = true

        let label = NSTextField(labelWithString: "")
        label.attributedStringValue = attrString
        label.font = font
        label.alignment = .center
        label.frame = NSRect(x: 0, y: padding * 0.7,
                             width: winSize.width, height: textSize.height)
        container.addSubview(label)
        win.contentView = container

        win.alphaValue = 1.0
        win.orderFrontRegardless()
        overlayWindow = win

        // Use [weak self, win] to prevent strong reference cycles and call close()
        overlayFadeTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: false) { [weak self, win] _ in
            win.close()
            self?.overlayFadeTimer = nil
            self?.overlayWindow = nil
        }
    }

    // MARK: - Sound

    private func playResetSound() {
        guard let sound = NSSound(named: NSSound.Name("Hero")) else { return }
        sound.play()
        self.sound = sound
        self.soundIsPlaying = true
    }

    private func playSoundLoop() {
        guard let sound = NSSound(named: NSSound.Name("Glass")) else { return }
        sound.loops = true
        sound.play()
        self.sound = sound
        self.soundIsPlaying = true
    }

    private func stopSound() {
        sound?.stop()
        sound = nil
        soundIsPlaying = false
    }

    // MARK: - Duration parsing

    private func parseDuration(_ input: String) -> Int? {
        var totalSeconds = 0
        let regex = try! NSRegularExpression(pattern: "(\\d+)([mh]?s?)", options: .caseInsensitive)
        let matches = regex.matches(in: input, range: NSRange(input.startIndex..., in: input))

        for match in matches {
            guard let numRange = Range(match.range(at: 1), in: input),
                  let unitRange = Range(match.range(at: 2), in: input) else {
                continue
            }

            let number = Int(input[numRange]) ?? 0
            let unit = input[unitRange].lowercased()

            if unit.contains("m") && !unit.contains("s") {
                totalSeconds += number * 60
            } else if unit.contains("ms") || (unit.contains("m") && unit.contains("s")) {
                totalSeconds += number * 60
            } else {
                totalSeconds += number
            }
        }

        return totalSeconds > 0 ? totalSeconds : nil
    }

    private func formatDuration(_ seconds: Int) -> String {
        let minutes = seconds / 60
        let secs = seconds % 60
        return minutes > 0 ? "\(minutes)m\(secs)s" : "\(secs)s"
    }
}
```
## V4
- Added a stacking upper limit. Leaving it blank makes it so there is no limit. 
- Timer no longer goes to sleep if computer falls asleep
```javascript
import Cocoa
import SwiftUI
import UserNotifications

class MenuBarController {
    private var statusBarItem: NSStatusItem!
    private var eventTap: CFMachPort?
    private var runLoopSource: CFRunLoopSource?
    private var eventTapSelfPtr: UnsafeMutableRawPointer?
    private var commandRCount: Int = 0 {
        didSet {
            updateStatusBarTitle()

            if commandRCount == notificationThreshold {
                sendNotification()
            }

            // In stacking mode the timer is managed manually by the event handler
            if commandRCount >= 0 && currentMode == .default {
                startCountdownTimer()
            }
        }
    }

    private var countdownDuration: Int = 5
    private var countdownTimer: Timer?
    private var timeLeft: Int = 0
    private var sound: NSSound?
    private var soundIsPlaying = false
    private var isPaused: Bool = false {
        didSet {
            updateStatusBarTitle()
            updatePauseResumeMenuItem()
        }
    }
    private var sleepStartDate: Date?

    private enum TimerMode: String {
        case `default` = "Default Mode"
        case stacking = "Stacking Mode"
    }

    private var currentMode: TimerMode = .default {
        didSet { updateModeMenuItem() }
    }

    private var modeMenuItem: NSMenuItem!

    private let thresholdDefaultsKey = "NotificationThreshold"
    private let timeThresholdDefaultsKey = "TimeAccumulationThreshold"
    private let countdownDefaultsKey = "CountdownDuration"
    private let cycleItemsDefaultsKey = "CycleItems"
    private let cycleIndexDefaultsKey = "CycleIndex"
    private let cycleDurationsDefaultsKey = "CycleDurations"
    private let showCycleLabelOverlayKey = "ShowCycleLabelOverlay"
    private let stackingGoalDefaultsKey = "StackingGoal"
    private let stackingUpperLimitDefaultsKey = "StackingUpperLimit"

    private var showCycleLabelOverlay: Bool {
        get {
            // Default to true if never set
            guard UserDefaults.standard.object(forKey: showCycleLabelOverlayKey) != nil else { return true }
            return UserDefaults.standard.bool(forKey: showCycleLabelOverlayKey)
        }
        set {
            UserDefaults.standard.set(newValue, forKey: showCycleLabelOverlayKey)
        }
    }

    private var pauseResumeMenuItem: NSMenuItem!

    // MARK: - Undo state
    private var previousCount: Int = 0
    private var previousTimeLeft: Int = 0
    private var previousCycleIndex: Int = 0

    // MARK: - Stacking Mode state
    // stackingTotalTimeLeft: 0 at level start; increases when section banked early, decreases after section exhausted
    // stackingSectionTimeLeft: counts to 0 (never negative); only then does total start decrementing
    // stackingSectionExhausted: gates whether the total ticks (only true after section hits 0)
    // stackingCurrentAvg: 0 = use global default; updated at every level transition
    // stackingSplitTotalElapsed / stackingSplitCount: running sum/count for this level's splits (avg computed at transition)
    // stackingCurrentSplitElapsed: wall-clock seconds since last Ctrl+Space (resets each press)
    private var stackingIsActive: Bool = false
    private var stackingLevel: Int = 1
    private var stackingTotalTimeLeft: Int = 0
    private var stackingSectionTimeLeft: Int = 0
    private var stackingSectionExhausted: Bool = false
    private var stackingCurrentAvg: Int = 0          // frozen timeSplit for current level
    private var stackingSplitTotalElapsed: Double = 0 // kept for undo compatibility
    private var stackingSplitCount: Int = 0           // kept for undo compatibility
    private var stackingCurrentSplitElapsed: Int = 0
    // Global accumulators across all levels — drive timeSplit on level change
    private var stackingGlobalSumCount: Double = 0
    private var stackingGlobalTotalSplits: Int = 0
    // Delta from last banked split (positive = early, negative = over)
    private var stackingLastSplitDelta: Int = 0
    // Set by the timer when total crosses -goal; cleared after Ctrl+Space applies the downgrade
    private var stackingPendingDowngrade: Bool = false

    // Undo snapshot
    private var previousStackingIsActive: Bool = false
    private var previousStackingLevel: Int = 1
    private var previousStackingTotalTimeLeft: Int = 0
    private var previousStackingSectionTimeLeft: Int = 0
    private var previousStackingSectionExhausted: Bool = false
    private var previousStackingCurrentAvg: Int = 0
    private var previousStackingSplitTotalElapsed: Double = 0
    private var previousStackingSplitCount: Int = 0
    private var previousStackingCurrentSplitElapsed: Int = 0
    private var previousStackingGlobalSumCount: Double = 0
    private var previousStackingGlobalTotalSplits: Int = 0
    private var previousStackingLastSplitDelta: Int = 0
    private var previousStackingPendingDowngrade: Bool = false

    // MARK: - Cycle

    private var cycleItems: [String] {
        get { return UserDefaults.standard.stringArray(forKey: cycleItemsDefaultsKey) ?? [] }
        set { UserDefaults.standard.set(newValue, forKey: cycleItemsDefaultsKey) }
    }

    private var cycleIndex: Int {
        get { return UserDefaults.standard.integer(forKey: cycleIndexDefaultsKey) }
        set { UserDefaults.standard.set(newValue, forKey: cycleIndexDefaultsKey) }
    }

    // Parallel array to cycleItems — 0 means "use global countdownDuration"
    private var cycleDurations: [Int] {
        get { return (UserDefaults.standard.array(forKey: cycleDurationsDefaultsKey) as? [Int]) ?? [] }
        set { UserDefaults.standard.set(newValue, forKey: cycleDurationsDefaultsKey) }
    }

    // Returns the duration for the current cycle item, falling back to global countdownDuration
    private var currentCycleDuration: Int {
        let durations = cycleDurations
        let idx = cycleIndex % max(cycleItems.count, 1)
        if idx < durations.count && durations[idx] > 0 { return durations[idx] }
        return countdownDuration
    }

    private var currentCycleLabel: String {
        let items = cycleItems
        guard !items.isEmpty else { return "Counter" }
        return items[cycleIndex % items.count]
    }

    private func advanceCycleIndex() {
        let items = cycleItems
        guard !items.isEmpty else { return }
        cycleIndex = (cycleIndex + 1) % items.count
    }

    // MARK: - Persisted thresholds

    private var timeNotificationThreshold: Int {
        get {
            let value = UserDefaults.standard.integer(forKey: timeThresholdDefaultsKey)
            return value > 0 ? value : 30 * 60
        }
        set { UserDefaults.standard.set(newValue, forKey: timeThresholdDefaultsKey) }
    }

    private var notificationThreshold: Int {
        get {
            let value = UserDefaults.standard.integer(forKey: thresholdDefaultsKey)
            return value > 0 ? value : 30
        }
        set { UserDefaults.standard.set(newValue, forKey: thresholdDefaultsKey) }
    }

    // Goal (in seconds) for stacking level transitions. Reaching +goal = level up; -goal = level down.
    private var stackingGoal: Int {
        get {
            let v = UserDefaults.standard.integer(forKey: stackingGoalDefaultsKey)
            return v > 0 ? v : 15 * 60
        }
        set { UserDefaults.standard.set(newValue, forKey: stackingGoalDefaultsKey) }
    }

    // Upper limit (in seconds) for stackingTotalTimeLeft. 0 = no limit.
    private var stackingUpperLimit: Int {
        get { return UserDefaults.standard.integer(forKey: stackingUpperLimitDefaultsKey) }
        set { UserDefaults.standard.set(newValue, forKey: stackingUpperLimitDefaultsKey) }
    }

    // MARK: - Init

    init() {
        countdownDuration = UserDefaults.standard.integer(forKey: countdownDefaultsKey)
        if countdownDuration <= 0 { countdownDuration = 5 }

        statusBarItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        updateStatusBarTitle()
        statusBarItem.menu = createMenu()

        requestNotificationPermission()
        startGlobalEventMonitor()
        registerSleepLockObservers()
    }

    deinit {
        stopGlobalEventMonitor()
        NSWorkspace.shared.notificationCenter.removeObserver(self)
        DistributedNotificationCenter.default().removeObserver(self)
    }

    // MARK: - Menu

    private func createMenu() -> NSMenu {
        let menu = NSMenu()

        pauseResumeMenuItem = NSMenuItem(title: "Pause Timer", action: #selector(togglePauseResume), keyEquivalent: "")
        pauseResumeMenuItem.target = self
        menu.addItem(pauseResumeMenuItem)

        modeMenuItem = NSMenuItem(title: "Switch to \(TimerMode.stacking.rawValue)", action: #selector(toggleMode), keyEquivalent: "")
        modeMenuItem.target = self
        menu.addItem(modeMenuItem)

        let cycleItem = NSMenuItem(title: "Manage Cycle", action: #selector(manageCycle), keyEquivalent: "")
        cycleItem.target = self
        menu.addItem(cycleItem)

        let thresholdItem = NSMenuItem(title: "Counter Threshold", action: #selector(setNotificationThreshold), keyEquivalent: "")
        thresholdItem.target = self
        menu.addItem(thresholdItem)

        let timeThresholdItem = NSMenuItem(title: "Time Threshold", action: #selector(setTimeNotificationThreshold), keyEquivalent: "")
        timeThresholdItem.target = self
        menu.addItem(timeThresholdItem)

        let statsItem = NSMenuItem(title: "Stats", action: #selector(showStats), keyEquivalent: "")
        statsItem.target = self
        menu.addItem(statsItem)

        let resetItem = NSMenuItem(title: "Reset Counter", action: #selector(resetCounter), keyEquivalent: "")
        resetItem.target = self
        menu.addItem(resetItem)

        menu.addItem(NSMenuItem.separator())

        let quitItem = NSMenuItem(title: "Quit", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        quitItem.target = NSApp
        menu.addItem(quitItem)

        return menu
    }

    // MARK: - Alert helper

    /// Presents an NSAlert centered on screen using beginSheetModal (async, no QoS inversion).
    /// Creates a transparent helper window as the sheet parent, then closes it on completion.
    private func presentAlert(_ alert: NSAlert, firstResponder: NSView? = nil, completion: @escaping (NSApplication.ModalResponse) -> Void) {
        let helperWindow = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 0, height: 0),
            styleMask: .borderless,
            backing: .buffered,
            defer: false
        )
        // Prevent double-free: NSWindow's isReleasedWhenClosed defaults to true,
        // which causes the window to deallocate on close() while ARC still holds
        // a strong reference inside the closure — resulting in EXC_BAD_ACCESS.
        helperWindow.isReleasedWhenClosed = false
        helperWindow.isOpaque = false
        helperWindow.backgroundColor = .clear
        helperWindow.level = .floating
        helperWindow.center()
        NSApp.activate(ignoringOtherApps: true)
        helperWindow.makeKeyAndOrderFront(nil)

        alert.beginSheetModal(for: helperWindow) { response in
            completion(response) // read field values before window closes
            helperWindow.close()
        }

        if let fr = firstResponder {
            DispatchQueue.main.async {
                alert.window.makeFirstResponder(fr)
            }
        }
    }

    // MARK: - Cycle management

    @objc private func manageCycle() {
        let alert = NSAlert()
        alert.messageText = "Manage Cycle"
        alert.informativeText = "Enter entries as \"Label\" or \"Label:duration\" separated by commas.\nExample: Admin:10m, Learning:15m, Building\nOmit duration to use the global default below."
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.addButton(withTitle: "Cancel")

        let container = NSView(frame: NSRect(x: 0, y: 0, width: 360, height: 168))

        let items = cycleItems
        let durations = cycleDurations
        let currentValue = items.enumerated().map { i, label -> String in
            let dur = i < durations.count ? durations[i] : 0
            return dur > 0 ? "\(label):\(formatDuration(dur))" : label
        }.joined(separator: ", ")

        let labelsField = NSTextField(frame: NSRect(x: 0, y: 144, width: 360, height: 24))
        labelsField.stringValue = currentValue
        labelsField.placeholderString = "Admin:10m, Learning:15m, Building"

        let indexLabel = NSTextField(labelWithString: "Start at index (0-based):")
        indexLabel.frame = NSRect(x: 0, y: 120, width: 180, height: 17)
        let indexField = NSTextField(frame: NSRect(x: 185, y: 118, width: 60, height: 22))
        indexField.stringValue = "\(cycleIndex)"

        let globalDurLabel = NSTextField(labelWithString: "Global default duration:")
        globalDurLabel.frame = NSRect(x: 0, y: 94, width: 180, height: 17)
        let globalDurField = NSTextField(frame: NSRect(x: 185, y: 92, width: 80, height: 22))
        globalDurField.stringValue = formatDuration(countdownDuration)
        globalDurField.placeholderString = "e.g. 10m"

        let goalLabel = NSTextField(labelWithString: "Stacking goal (±level threshold):")
        goalLabel.frame = NSRect(x: 0, y: 68, width: 210, height: 17)
        let goalField = NSTextField(frame: NSRect(x: 215, y: 66, width: 80, height: 22))
        goalField.stringValue = formatDuration(stackingGoal)
        goalField.placeholderString = "e.g. 15m"

        let upperLimitLabel = NSTextField(labelWithString: "Stacking upper limit (blank = none):")
        upperLimitLabel.frame = NSRect(x: 0, y: 42, width: 220, height: 17)
        let upperLimitField = NSTextField(frame: NSRect(x: 225, y: 40, width: 80, height: 22))
        upperLimitField.stringValue = stackingUpperLimit > 0 ? formatDuration(stackingUpperLimit) : ""
        upperLimitField.placeholderString = "e.g. 10m"

        let overlayCheckbox = NSButton(checkboxWithTitle: "Show Cycle Label on Press", target: nil, action: nil)
        overlayCheckbox.frame = NSRect(x: 0, y: 10, width: 360, height: 22)
        overlayCheckbox.state = showCycleLabelOverlay ? .on : .off

        container.addSubview(labelsField)
        container.addSubview(indexLabel)
        container.addSubview(indexField)
        container.addSubview(globalDurLabel)
        container.addSubview(globalDurField)
        container.addSubview(goalLabel)
        container.addSubview(goalField)
        container.addSubview(upperLimitLabel)
        container.addSubview(upperLimitField)
        container.addSubview(overlayCheckbox)
        alert.accessoryView = container

        presentAlert(alert, firstResponder: labelsField) { [weak self] response in
            guard let self = self, response == .alertFirstButtonReturn else { return }

            self.showCycleLabelOverlay = (overlayCheckbox.state == .on)

            let globalDurInput = globalDurField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)
            if let newSeconds = self.parseDuration(globalDurInput), newSeconds > 0 {
                self.countdownDuration = newSeconds
                UserDefaults.standard.set(newSeconds, forKey: self.countdownDefaultsKey)
            }

            let goalInput = goalField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)
            if let goalSeconds = self.parseDuration(goalInput), goalSeconds > 0 {
                self.stackingGoal = goalSeconds
            }

            let upperLimitInput = upperLimitField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)
            if upperLimitInput.isEmpty {
                self.stackingUpperLimit = 0  // no limit
            } else if let limitSeconds = self.parseDuration(upperLimitInput), limitSeconds > 0 {
                self.stackingUpperLimit = limitSeconds
            }

            let raw = labelsField.stringValue
            let entries = raw.split(separator: ",").map { $0.trimmingCharacters(in: .whitespaces) }.filter { !$0.isEmpty }
            var newLabels: [String] = []
            var newDurations: [Int] = []

            for entry in entries {
                if let colonRange = entry.range(of: ":") {
                    let label = String(entry[entry.startIndex..<colonRange.lowerBound]).trimmingCharacters(in: .whitespaces)
                    let durStr = String(entry[colonRange.upperBound...]).trimmingCharacters(in: .whitespaces)
                    newLabels.append(label)
                    newDurations.append(self.parseDuration(durStr) ?? 0)
                } else {
                    newLabels.append(entry)
                    newDurations.append(0)
                }
            }

            self.cycleItems = newLabels
            self.cycleDurations = newDurations

            if let requested = Int(indexField.stringValue), requested >= 0, requested < newLabels.count {
                self.cycleIndex = requested
            } else {
                self.cycleIndex = 0
            }
            self.updateStatusBarTitle()
        }
    }

    // MARK: - Stacking Mode helpers

    /// Number of fully completed tasks (splits banked) in the current stacking session.
    /// Zero until the second Ctrl+Space press (first split is tallied at that point).
    private var stackingCompletedTaskCount: Int {
        return stackingSplitCount
    }

    /// Handles a level-up (+1) or level-down (-1) transition in stacking mode.
    /// firstTimer resets to 0. timeSplit is recomputed from the global avg across all splits
    /// and then frozen until the next level change.
    private func performLevelTransition(direction: Int) {
        stackingLevel = max(1, stackingLevel + direction)

        // firstTimer always starts fresh at 0 — no carryover
        stackingTotalTimeLeft = 0

        // Recompute frozen timeSplit from global avg across every split ever banked
        if stackingGlobalTotalSplits > 0 {
            let globalAvg = stackingGlobalSumCount / Double(stackingGlobalTotalSplits)
            stackingCurrentAvg = Int((globalAvg * 1.25).rounded())
        } else {
            stackingCurrentAvg = countdownDuration
        }

        // Reset per-level split accumulators
        stackingSplitTotalElapsed = 0
        stackingSplitCount = 0
        stackingCurrentSplitElapsed = 0

        // Apply the now-frozen avg as the new section time
        stackingSectionTimeLeft = stackingCurrentAvg
        stackingSectionExhausted = false
    }

    // MARK: - Mode toggle

    @objc private func toggleMode() {
        currentMode = (currentMode == .default) ? .stacking : .default
        // Reset stacking state whenever mode switches
        countdownTimer?.invalidate()
        countdownTimer = nil
        sleepStartDate = nil
        stackingIsActive = false
        stackingLevel = 1
        stackingTotalTimeLeft = 0
        stackingSectionTimeLeft = 0
        stackingSectionExhausted = false
        stackingCurrentAvg = 0
        stackingSplitTotalElapsed = 0
        stackingSplitCount = 0
        stackingCurrentSplitElapsed = 0
        stackingGlobalSumCount = 0
        stackingGlobalTotalSplits = 0
        stackingLastSplitDelta = 0
        stackingPendingDowngrade = false
        updateStatusBarTitle()
    }

    private func updateModeMenuItem() {
        let newTitle = currentMode == .default
            ? "Switch to \(TimerMode.stacking.rawValue)"
            : "Switch to \(TimerMode.default.rawValue)"
        modeMenuItem.title = newTitle
    }

    private func updatePauseResumeMenuItem() {
        pauseResumeMenuItem.title = isPaused ? "Resume Timer" : "Pause Timer"
    }

    // MARK: - Status bar title

    /// Formats seconds as M:SS, allowing negatives (e.g. -1:05 for -65s).
    private func formatTimeAllowNeg(_ seconds: Int) -> String {
        let neg = seconds < 0
        let abs_s = abs(seconds)
        let m = abs_s / 60
        let s = abs_s % 60
        return "\(neg ? "-" : "")\(m):\(String(format: "%02d", s))"
    }

    private func updateStatusBarTitle() {
        let title: String

        switch currentMode {
        case .default:
            var t = "\(currentCycleLabel): \(commandRCount)"
            if countdownTimer != nil && timeLeft > 0 {
                let minutes = timeLeft / 60
                let seconds = timeLeft % 60
                let icon = isPaused ? "⏸" : "⏳"
                t += " | \(icon) \(String(format: "%d:%02d", minutes, seconds))"
            }
            title = t

        case .stacking:
            if stackingIsActive {
                let levelStr = "L\(stackingLevel)"
                let totalStr = formatTimeAllowNeg(stackingTotalTimeLeft)
                let sectionStr = formatTimeAllowNeg(stackingSectionTimeLeft)
                title = "\(levelStr) | \(totalStr) | \(sectionStr)"
            } else {
                // Not yet started: show idle state
                title = "L\(stackingLevel) | 0:00 | \(formatTimeAllowNeg(countdownDuration))"
            }
        }

        statusBarItem.button?.title = title
    }

    // MARK: - Stats Menu Action
    
    @objc private func showStats() {
        let alert = NSAlert()
        alert.messageText = "Stats"
        alert.informativeText = "Counter: \(commandRCount)"
        if currentMode == .stacking {
            alert.informativeText += "\nCompleted Tasks: \(stackingCompletedTaskCount)"
        }
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        presentAlert(alert) { _ in }
    }

    // MARK: - Reset

    @objc private func resetCounter() {
        // Save state for undo (same as Ctrl+Space)
        previousCount = commandRCount
        previousTimeLeft = timeLeft
        previousCycleIndex = cycleIndex
        previousStackingIsActive = stackingIsActive
        previousStackingLevel = stackingLevel
        previousStackingTotalTimeLeft = stackingTotalTimeLeft
        previousStackingSectionTimeLeft = stackingSectionTimeLeft
        previousStackingSectionExhausted = stackingSectionExhausted
        previousStackingCurrentAvg = stackingCurrentAvg
        previousStackingSplitTotalElapsed = stackingSplitTotalElapsed
        previousStackingSplitCount = stackingSplitCount
        previousStackingCurrentSplitElapsed = stackingCurrentSplitElapsed

        previousStackingGlobalSumCount = stackingGlobalSumCount
        previousStackingGlobalTotalSplits = stackingGlobalTotalSplits
        previousStackingLastSplitDelta = stackingLastSplitDelta
        previousStackingPendingDowngrade = stackingPendingDowngrade

        commandRCount = 0
        stopSound()
        countdownTimer?.invalidate()
        countdownTimer = nil
        sleepStartDate = nil
        timeLeft = 0
        stackingIsActive = false
        stackingLevel = 1
        stackingTotalTimeLeft = 0
        stackingSectionTimeLeft = 0
        stackingSectionExhausted = false
        stackingCurrentAvg = 0
        stackingSplitTotalElapsed = 0
        stackingSplitCount = 0
        stackingCurrentSplitElapsed = 0
        stackingGlobalSumCount = 0
        stackingGlobalTotalSplits = 0
        stackingLastSplitDelta = 0
        stackingPendingDowngrade = false
        isPaused = false
        updateStatusBarTitle()
    }

    // MARK: - Alert inputs

    @objc private func setNotificationThreshold() {
        let alert = NSAlert()
        alert.messageText = "Counter Threshold"
        alert.informativeText = "Enter the number of Control + Space presses before a notification is sent."
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.addButton(withTitle: "Cancel")

        let inputField = NSTextField(frame: NSRect(x: 0, y: 0, width: 200, height: 24))
        inputField.stringValue = "\(notificationThreshold)"
        alert.accessoryView = inputField

        presentAlert(alert, firstResponder: inputField) { [weak self] response in
            guard let self = self, response == .alertFirstButtonReturn else { return }
            if let newValue = Int(inputField.stringValue), newValue > 0 {
                self.notificationThreshold = newValue
            }
        }
    }

    @objc private func setCountdownDuration() {
        let alert = NSAlert()
        alert.messageText = "Countdown Duration"
        alert.informativeText = "Enter countdown duration (e.g. 90s, 1m30s, 2m)."
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.addButton(withTitle: "Cancel")

        let inputField = NSTextField(frame: NSRect(x: 0, y: 0, width: 200, height: 24))
        inputField.stringValue = formatDuration(countdownDuration)
        alert.accessoryView = inputField

        presentAlert(alert, firstResponder: inputField) { [weak self] response in
            guard let self = self, response == .alertFirstButtonReturn else { return }
            let input = inputField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)
            if let newSeconds = self.parseDuration(input) {
                self.countdownDuration = newSeconds
                UserDefaults.standard.set(newSeconds, forKey: self.countdownDefaultsKey)
            }
        }
    }

    @objc private func setTimeNotificationThreshold() {
        let alert = NSAlert()
        alert.messageText = "Set Time Notification Threshold"
        alert.informativeText = "Enter the number of minutes of accumulated time before a notification is sent."
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.addButton(withTitle: "Cancel")

        let inputField = NSTextField(frame: NSRect(x: 0, y: 0, width: 200, height: 24))
        inputField.stringValue = "\(timeNotificationThreshold / 60)"
        alert.accessoryView = inputField

        presentAlert(alert, firstResponder: inputField) { [weak self] response in
            guard let self = self, response == .alertFirstButtonReturn else { return }
            if let newValue = Int(inputField.stringValue), newValue > 0 {
                self.timeNotificationThreshold = newValue * 60
            }
        }
    }

    // MARK: - Sleep / Lock observers

    private func registerSleepLockObservers() {
        let workspaceNC = NSWorkspace.shared.notificationCenter
        
        // System sleep, screen sleep, and screen lock
        workspaceNC.addObserver(self, selector: #selector(handleSleepOrLock),
                                name: NSWorkspace.willSleepNotification, object: nil)
        workspaceNC.addObserver(self, selector: #selector(handleSleepOrLock),
                                name: NSWorkspace.screensDidSleepNotification, object: nil)
        DistributedNotificationCenter.default().addObserver(self, selector: #selector(handleSleepOrLock),
                                                            name: NSNotification.Name("com.apple.screenIsLocked"),
                                                            object: nil)
        
        // System wake, screen wake, and screen unlock
        workspaceNC.addObserver(self, selector: #selector(handleWakeOrUnlock),
                                name: NSWorkspace.didWakeNotification, object: nil)
        workspaceNC.addObserver(self, selector: #selector(handleWakeOrUnlock),
                                name: NSWorkspace.screensDidWakeNotification, object: nil)
        DistributedNotificationCenter.default().addObserver(self, selector: #selector(handleWakeOrUnlock),
                                                            name: NSNotification.Name("com.apple.screenIsUnlocked"),
                                                            object: nil)
    }

    @objc private func handleSleepOrLock() {
        guard !isPaused else { return }
        
        // Stop audio immediately
        stopSound()
        
        // Only set sleepStart if we haven't already captured it during this sleep transition
        if sleepStartDate == nil {
            sleepStartDate = Date()
        }
    }
    
    @objc private func handleWakeOrUnlock() {
        guard let sleepStart = sleepStartDate else { return }
        sleepStartDate = nil
        
        guard !isPaused else { return }
        
        let elapsedSeconds = Int(Date().timeIntervalSince(sleepStart))
        guard elapsedSeconds > 0 else { return }
        
        applyElapsedSleepTime(elapsedSeconds)
    }
    
    private func applyElapsedSleepTime(_ elapsed: Int) {
        switch currentMode {
        case .default:
            if countdownTimer != nil && timeLeft > 0 {
                timeLeft = max(0, timeLeft - elapsed)
                updateStatusBarTitle()
                
                if timeLeft == 0 {
                    countdownTimer?.invalidate()
                    countdownTimer = nil
                    updateStatusBarTitle()
                    playSoundLoop()
                }
            }
            
        case .stacking:
            if stackingIsActive {
                let S = stackingSectionTimeLeft
                stackingSectionTimeLeft -= elapsed
                stackingCurrentSplitElapsed += elapsed
                
                var decrements = 0
                if S <= 0 {
                    decrements = elapsed
                } else if S <= elapsed {
                    decrements = elapsed - S + 1
                }
                
                if decrements > 0 {
                    stackingTotalTimeLeft -= decrements
                    if stackingTotalTimeLeft <= -stackingGoal && !stackingPendingDowngrade {
                        stackingPendingDowngrade = true
                    }
                }
                updateStatusBarTitle()
            }
        }
    }

    // MARK: - Event monitor

    private func startGlobalEventMonitor() {
        let mask = CGEventMask(1 << CGEventType.keyDown.rawValue)
        let selfPtr = Unmanaged.passRetained(self).toOpaque()
        eventTapSelfPtr = selfPtr

        guard let tap = CGEvent.tapCreate(
            tap: .cgSessionEventTap,
            place: .headInsertEventTap,
            options: .defaultTap,
            eventsOfInterest: mask,
            callback: { proxy, type, event, refcon -> Unmanaged<CGEvent>? in
                guard let refcon = refcon else { return Unmanaged.passRetained(event) }
                let controller = Unmanaged<MenuBarController>.fromOpaque(refcon).takeUnretainedValue()
                return controller.handleCGEvent(type: type, event: event)
            },
            userInfo: selfPtr
        ) else {
            Unmanaged<MenuBarController>.fromOpaque(selfPtr).release()
            eventTapSelfPtr = nil
            print("CGEventTap creation failed — grant Accessibility permission in System Settings")
            return
        }

        eventTap = tap
        runLoopSource = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, tap, 0)
        CFRunLoopAddSource(CFRunLoopGetMain(), runLoopSource, .commonModes)
        CGEvent.tapEnable(tap: tap, enable: true)
    }

    private func handleCGEvent(type: CGEventType, event: CGEvent) -> Unmanaged<CGEvent>? {
        guard type == .keyDown else { return Unmanaged.passRetained(event) }

        let keyCode = event.getIntegerValueField(.keyboardEventKeycode)
        let flags = event.flags

        let hasControl = flags.contains(.maskControl)
        let hasShift   = flags.contains(.maskShift)
        let hasCommand = flags.contains(.maskCommand)

        let isCtrlSpace      = keyCode == 49 && hasControl && !hasShift && !hasCommand
        let isCtrlShiftSpace = keyCode == 49 && hasControl &&  hasShift && !hasCommand
        let isCmdCtrlC       = keyCode == 34 && hasControl &&  hasCommand

        guard isCtrlSpace || isCtrlShiftSpace || isCmdCtrlC else {
            return Unmanaged.passRetained(event) // not our shortcut — pass through
        }

        // ── Stacking mode: apply all state mutations synchronously so the menu bar
        //    updates on this run loop turn. The async block handles sound + overlay only.
        if isCtrlSpace && currentMode == .stacking {
            // Save undo snapshot
            previousCount                  = commandRCount
            previousTimeLeft               = timeLeft
            previousCycleIndex             = cycleIndex
            previousStackingIsActive       = stackingIsActive
            previousStackingLevel          = stackingLevel
            previousStackingTotalTimeLeft  = stackingTotalTimeLeft
            previousStackingSectionTimeLeft = stackingSectionTimeLeft
            previousStackingSectionExhausted = stackingSectionExhausted
            previousStackingCurrentAvg     = stackingCurrentAvg
            previousStackingSplitTotalElapsed = stackingSplitTotalElapsed
            previousStackingSplitCount     = stackingSplitCount
            previousStackingCurrentSplitElapsed = stackingCurrentSplitElapsed
            previousStackingGlobalSumCount = stackingGlobalSumCount
            previousStackingGlobalTotalSplits = stackingGlobalTotalSplits
            previousStackingLastSplitDelta = stackingLastSplitDelta
            previousStackingPendingDowngrade = stackingPendingDowngrade

            commandRCount += 1

            if !stackingIsActive {
                // First press
                stackingIsActive           = true
                stackingLevel              = 1
                stackingTotalTimeLeft      = 0
                stackingSectionTimeLeft    = countdownDuration
                stackingSectionExhausted   = false
                stackingCurrentAvg         = 0
                stackingSplitTotalElapsed  = 0
                stackingSplitCount         = 0
                stackingCurrentSplitElapsed = 0
                stackingGlobalSumCount     = 0
                stackingGlobalTotalSplits  = 0
                stackingLastSplitDelta     = 0
            } else {
                // Subsequent press: bank section time, tally split
                let sectionRemaining = stackingSectionTimeLeft
                if sectionRemaining > 0 { stackingTotalTimeLeft += sectionRemaining }

                // Cap total at upper limit if one is set
                let limit = stackingUpperLimit
                if limit > 0 && stackingTotalTimeLeft > limit {
                    stackingTotalTimeLeft = limit
                }

                let splitDuration = stackingCurrentSplitElapsed
                let frozenAvg = stackingCurrentAvg > 0 ? stackingCurrentAvg : countdownDuration
                stackingLastSplitDelta = frozenAvg - splitDuration

                stackingGlobalSumCount    += Double(splitDuration)
                stackingGlobalTotalSplits += 1
                stackingSplitTotalElapsed += Double(splitDuration)
                stackingSplitCount        += 1
                stackingCurrentSplitElapsed = 0

                var levelChange = 0
                if stackingPendingDowngrade {
                    stackingPendingDowngrade = false
                    levelChange = -1
                } else if stackingTotalTimeLeft >= stackingGoal {
                    levelChange = +1
                }

                if levelChange != 0 {
                    performLevelTransition(direction: levelChange)
                } else {
                    let frozen = stackingCurrentAvg > 0 ? stackingCurrentAvg : countdownDuration
                    stackingSectionTimeLeft  = frozen
                    stackingSectionExhausted = false
                }
            }

            updateStatusBarTitle()

            // Async block: sound, timer start, overlay only
            let wasFirstPress = !previousStackingIsActive
            let levelChanged  = stackingLevel != previousStackingLevel
            let wentUp        = stackingLevel > previousStackingLevel
            let capturedLevel = stackingLevel
            let capturedTotal = stackingTotalTimeLeft
            let capturedDelta = stackingLastSplitDelta
            let capturedAvg   = stackingCurrentAvg

            DispatchQueue.main.async { [weak self] in
                guard let self = self else { return }
                self.stopSound()
                if self.commandRCount > 1 { self.advanceCycleIndex() }
                self.isPaused = false
                self.playResetSound()
                if wasFirstPress { self.startCountdownTimer() }

                if self.showCycleLabelOverlay {
                    let levelStr = "L\(capturedLevel)"
                    if levelChanged {
                        let tag    = wentUp ? "(Upgrade)" : "(Downgrade)"
                        let avgStr = self.formatTimeAllowNeg(capturedAvg)
                        self.showOverlay("\(levelStr) \(tag) | \(avgStr)", levelUp: wentUp)
                    } else {
                        let totalStr = self.formatTimeAllowNeg(capturedTotal)
                        let delta    = capturedDelta
                        let deltaStr = delta >= 0
                            ? "+\(self.formatTimeAllowNeg(delta))"
                            : self.formatTimeAllowNeg(delta)
                        self.showOverlay("\(levelStr) | \(totalStr) | \(deltaStr)", splitDeltaPositive: delta >= 0)
                    }
                }
            }
            return nil // consume event
        }

        // Dispatch UI work to main thread
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }

            if isCmdCtrlC {
                self.togglePauseResume()

            } else if isCtrlShiftSpace {
                self.stopSound()
                self.countdownTimer?.invalidate()
                self.countdownTimer = nil
                self.commandRCount = self.previousCount
                self.timeLeft = self.previousTimeLeft
                self.cycleIndex = self.previousCycleIndex
                // Restore stacking state snapshot
                self.stackingIsActive = self.previousStackingIsActive
                self.stackingLevel = self.previousStackingLevel
                self.stackingTotalTimeLeft = self.previousStackingTotalTimeLeft
                self.stackingSectionTimeLeft = self.previousStackingSectionTimeLeft
                self.stackingSectionExhausted = self.previousStackingSectionExhausted
                self.stackingCurrentAvg = self.previousStackingCurrentAvg
                self.stackingSplitTotalElapsed = self.previousStackingSplitTotalElapsed
                self.stackingSplitCount = self.previousStackingSplitCount
                self.stackingCurrentSplitElapsed = self.previousStackingCurrentSplitElapsed
                self.stackingGlobalSumCount = self.previousStackingGlobalSumCount
                self.stackingGlobalTotalSplits = self.previousStackingGlobalTotalSplits
                self.stackingLastSplitDelta = self.previousStackingLastSplitDelta
                self.stackingPendingDowngrade = self.previousStackingPendingDowngrade
                self.isPaused = false
                if self.currentMode == .stacking {
                    if self.stackingIsActive {
                        self.startCountdownTimer()
                    } else {
                        self.updateStatusBarTitle()
                    }
                } else {
                    if self.timeLeft > 0 {
                        self.startCountdownTimer()
                    } else {
                        self.updateStatusBarTitle()
                    }
                }

            } else if isCtrlSpace {
                self.previousCount = self.commandRCount
                self.previousTimeLeft = self.timeLeft
                self.previousCycleIndex = self.cycleIndex
                // (stacking undo snapshot is saved synchronously before this block)

                self.stopSound()
                if self.commandRCount > 0 {
                    self.advanceCycleIndex()
                }
                self.commandRCount += 1
                self.isPaused = false
                self.playResetSound()

                switch self.currentMode {
                case .default:
                    self.timeLeft = self.currentCycleDuration

                case .stacking:
                    break // handled synchronously before this async block
                }

                // Default mode overlay
                self.startCountdownTimer()
                if self.showCycleLabelOverlay && !self.cycleItems.isEmpty {
                    let mins = self.timeLeft / 60
                    let secs = self.timeLeft % 60
                    self.showOverlay("\(self.currentCycleLabel) : \(mins):\(String(format: "%02d", secs))")
                }
            }
        }

        return nil // consume — prevents macOS alert sound
    }

    private func stopGlobalEventMonitor() {
        if let tap = eventTap {
            CGEvent.tapEnable(tap: tap, enable: false)
            if let source = runLoopSource {
                CFRunLoopRemoveSource(CFRunLoopGetMain(), source, .commonModes)
            }
            eventTap = nil
            runLoopSource = nil
        }
        if let ptr = eventTapSelfPtr {
            Unmanaged<MenuBarController>.fromOpaque(ptr).release()
            eventTapSelfPtr = nil
        }
    }

    // MARK: - Notifications

    private func requestNotificationPermission() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound]) { granted, error in
            if let error = error {
                print("Notification authorization error: \(error)")
            }
        }
    }

    private func sendNotification() {
        let content = UNMutableNotificationContent()
        content.title = "Counter Reached \(notificationThreshold)"
        content.body = "You have triggered Control + Space \(notificationThreshold) times!"
        content.sound = .default

        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: nil)
        UNUserNotificationCenter.current().add(request, withCompletionHandler: nil)
    }

    private func sendTimeNotification() {
        let minutes = timeNotificationThreshold / 60
        let content = UNMutableNotificationContent()
        content.title = "Accumulated Time Threshold Reached"
        content.body = "\(minutes) minutes stacked!"
        content.sound = .default
        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: nil)
        UNUserNotificationCenter.current().add(request, withCompletionHandler: nil)
    }

    // MARK: - Timer

    private func startCountdownTimer() {
        updateStatusBarTitle()

        // MARK: Stacking mode timer — runs continuously, never auto-stops
        if currentMode == .stacking {
            guard countdownTimer == nil else { return } // already running
            countdownTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
                guard let self = self else { return }
                if self.isPaused { return }

                self.stackingSectionTimeLeft -= 1
                self.stackingCurrentSplitElapsed += 1
                // firstTimer only ticks down once secondTimer is exhausted
                if self.stackingSectionTimeLeft <= 0 {
                    self.stackingTotalTimeLeft -= 1
                    // Flag a pending downgrade when total crosses the negative threshold;
                    // the actual transition fires on the next Ctrl+Space press
                    if self.stackingTotalTimeLeft <= -self.stackingGoal && !self.stackingPendingDowngrade {
                        self.stackingPendingDowngrade = true
                    }
                }
                self.updateStatusBarTitle()
            }
            RunLoop.main.add(countdownTimer!, forMode: .common)
            return
        }

        // MARK: Default mode timer — counts down to zero then stops
        countdownTimer?.invalidate()
        countdownTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] timer in
            guard let self = self else { return }
            if self.isPaused { return }

            self.timeLeft -= 1
            self.updateStatusBarTitle()

            if self.timeLeft <= 0 {
                timer.invalidate()
                self.countdownTimer = nil
                self.timeLeft = 0
                self.updateStatusBarTitle()
                self.playSoundLoop()
            }
        }

        RunLoop.main.add(countdownTimer!, forMode: .common)
    }

    @objc private func togglePauseResume() {
        isPaused.toggle()

        if isPaused {
            stopSound()
            showOverlay("⏸ Paused")
        } else {
            if currentMode == .stacking {
                if countdownTimer == nil && stackingIsActive {
                    startCountdownTimer()
                }
                let sectionStr = formatTimeAllowNeg(stackingSectionTimeLeft)
                let resumeLabel = cycleItems.isEmpty ? "▶ Resumed | \(sectionStr)" : "▶ \(currentCycleLabel) | \(sectionStr)"
                showOverlay(resumeLabel)
            } else {
                if countdownTimer == nil && timeLeft > 0 {
                    startCountdownTimer()
                }
                let timeStr = timeLeft > 0 ? " | \(timeLeft / 60):\(String(format: "%02d", timeLeft % 60))" : ""
                let resumeLabel = cycleItems.isEmpty ? "▶ Resumed\(timeStr)" : "▶ \(currentCycleLabel)\(timeStr)"
                showOverlay(resumeLabel)
            }
        }
    }

    // MARK: - HUD Overlay

    private var overlayWindow: NSWindow?
    private var overlayFadeTimer: Timer?

    private func showOverlay(_ message: String, splitDeltaPositive: Bool? = nil, levelUp: Bool? = nil) {
        // Cancel any previous overlay immediately
        overlayFadeTimer?.invalidate()
        overlayFadeTimer = nil
        overlayWindow?.close() // Use close() to remove from AppKit window list
        overlayWindow = nil

        let padding: CGFloat = 24
        let font = NSFont.systemFont(ofSize: 28, weight: .semibold)

        // Build attributed string: color only the last segment (after final " | ") when delta is present
        let attrString: NSMutableAttributedString
        let centered = NSMutableParagraphStyle()
        centered.alignment = .center

        let fullRange = NSRange(message.startIndex..., in: message)
        let baseAttrs: [NSAttributedString.Key: Any] = [
            .font: font,
            .foregroundColor: NSColor.white,
            .paragraphStyle: centered
        ]

        if let isUp = levelUp, let parenRange = message.range(of: "(") {
            // Level change overlay: color the "(Upgrade)" or "(Downgrade)" tag
            attrString = NSMutableAttributedString(string: message, attributes: baseAttrs)
            let tagColor: NSColor = isUp
                ? NSColor(red: 0.25, green: 0.85, blue: 0.45, alpha: 1)
                : NSColor(red: 1,    green: 0.35, blue: 0.35, alpha: 1)
            // Color only the "(Upgrade)" / "(Downgrade)" tag — stop at the next " | " if present
            let tagEnd = message.range(of: " | ", range: parenRange.lowerBound..<message.endIndex)?.lowerBound ?? message.endIndex
            attrString.addAttribute(.foregroundColor, value: tagColor,
                                    range: NSRange(parenRange.lowerBound..<tagEnd, in: message))
        } else if let isPositive = splitDeltaPositive, let pipeRange = message.range(of: " | ", options: .backwards) {
            attrString = NSMutableAttributedString(string: message, attributes: baseAttrs)
            let deltaColor: NSColor = isPositive
                ? NSColor(red: 0.25, green: 0.85, blue: 0.45, alpha: 1)
                : NSColor(red: 1,    green: 0.35, blue: 0.35, alpha: 1)
            attrString.addAttribute(.foregroundColor, value: deltaColor,
                                    range: NSRange(pipeRange.upperBound..., in: message))
        } else {
            attrString = NSMutableAttributedString(string: message, attributes: baseAttrs)
        }
        _ = fullRange // suppress unused warning

        let textSize = (message as NSString).size(withAttributes: [.font: font])
        let winSize = NSSize(width: textSize.width + padding * 2,
                            height: textSize.height + padding * 1.4)

        let mouseLocation = NSEvent.mouseLocation
        let screen = NSScreen.screens.first(where: { NSMouseInRect(mouseLocation, $0.frame, false) })
                     ?? NSScreen.screens[0]
        let origin = NSPoint(
            x: screen.frame.midX - winSize.width / 2,
            y: screen.visibleFrame.midY - winSize.height / 2
        )

        let win = NSPanel(
            contentRect: NSRect(origin: origin, size: winSize),
            styleMask: [.borderless, .nonactivatingPanel],
            backing: .buffered,
            defer: false
        )
        win.isReleasedWhenClosed = false // Allow ARC to manage deallocation on close()
        win.isOpaque = false
        win.backgroundColor = .clear
        win.level = .screenSaver
        win.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary, .transient]
        win.ignoresMouseEvents = true
        win.hasShadow = true
        win.becomesKeyOnlyIfNeeded = true

        let container = NSView(frame: NSRect(origin: .zero, size: winSize))
        container.wantsLayer = true
        container.layer?.backgroundColor = NSColor(white: 0.1, alpha: 0.82).cgColor
        container.layer?.cornerRadius = 14
        container.layer?.masksToBounds = true

        let label = NSTextField(labelWithString: "")
        label.attributedStringValue = attrString
        label.font = font
        label.alignment = .center
        label.frame = NSRect(x: 0, y: padding * 0.7,
                             width: winSize.width, height: textSize.height)
        container.addSubview(label)
        win.contentView = container

        win.alphaValue = 1.0
        win.orderFrontRegardless()
        overlayWindow = win

        // Use [weak self, win] to prevent strong reference cycles and call close()
        overlayFadeTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: false) { [weak self, win] _ in
            win.close()
            self?.overlayFadeTimer = nil
            self?.overlayWindow = nil
        }
    }

    // MARK: - Sound

    private func playResetSound() {
        guard let sound = NSSound(named: NSSound.Name("Hero")) else { return }
        sound.play()
        self.sound = sound
        self.soundIsPlaying = true
    }

    private func playSoundLoop() {
        guard let sound = NSSound(named: NSSound.Name("Glass")) else { return }
        sound.loops = true
        sound.play()
        self.sound = sound
        self.soundIsPlaying = true
    }

    private func stopSound() {
        sound?.stop()
        sound = nil
        soundIsPlaying = false
    }

    // MARK: - Duration parsing

    private func parseDuration(_ input: String) -> Int? {
        var totalSeconds = 0
        let regex = try! NSRegularExpression(pattern: "(\\d+)([mh]?s?)", options: .caseInsensitive)
        let matches = regex.matches(in: input, range: NSRange(input.startIndex..., in: input))

        for match in matches {
            guard let numRange = Range(match.range(at: 1), in: input),
                  let unitRange = Range(match.range(at: 2), in: input) else {
                continue
            }

            let number = Int(input[numRange]) ?? 0
            let unit = input[unitRange].lowercased()

            if unit.contains("m") && !unit.contains("s") {
                totalSeconds += number * 60
            } else if unit.contains("ms") || (unit.contains("m") && unit.contains("s")) {
                totalSeconds += number * 60
            } else {
                totalSeconds += number
            }
        }

        return totalSeconds > 0 ? totalSeconds : nil
    }

    private func formatDuration(_ seconds: Int) -> String {
        let minutes = seconds / 60
        let secs = seconds % 60
        return minutes > 0 ? "\(minutes)m\(secs)s" : "\(secs)s"
    }
}
```
## V3
- [Latest Conversation](https://aistudio.google.com/prompts/1HaDkBK8WduEkcor_Ige-2YgAOJ0QlRQN)
	- Also added a stats bar to see my count
	- Also moved the "Show cycle label on press" as a checkbox in the "Manage Cycle" modal
Yes, the analysis provided is accurate. There are indeed memory management issues with the way NSPanel (an NSWindow subclass) is managed inside showOverlay, and how the default timer strongly captures self.
### Why the Leak Occurs
1. **Window Accumulation (NSPanel / NSWindow):**  
    orderOut(_:) merely hides the window visually but keeps it registered in AppKit's internal global window list (NSApplication.shared.windows), which retains the window. Calling close() instead of orderOut(_:) removes it from this internal list. Setting win.isReleasedWhenClosed = false ensures that AppKit does not attempt to asynchronously free the window, allowing Swift's ARC to cleanly handle its lifecycle once the local variables and timer closures are cleared.
2. **Default Timer Retain Cycle:**  
    In the default mode timer inside startCountdownTimer(), capturing self strongly without \[weak self] creates a retain cycle when the timer is active.
### The Fixes Implemented
- In showOverlay(_:splitDeltaPositive:levelUp:), overlayWindow?.orderOut(nil) was replaced with overlayWindow?.close().
- Set win.isReleasedWhenClosed = false on the newly initialized overlay panel to let Swift handle its deallocation.
- Used a weak reference to self (\[weak self, win]) inside the overlay's fade timer block, calling win.close() to properly clean it up.
- Added a \[weak self] capture list to the default countdown timer inside startCountdownTimer().
```javascript
import Cocoa
import SwiftUI
import UserNotifications

class MenuBarController {
    private var statusBarItem: NSStatusItem!
    private var eventTap: CFMachPort?
    private var runLoopSource: CFRunLoopSource?
    private var eventTapSelfPtr: UnsafeMutableRawPointer?
    private var commandRCount: Int = 0 {
        didSet {
            updateStatusBarTitle()

            if commandRCount == notificationThreshold {
                sendNotification()
            }

            // In stacking mode the timer is managed manually by the event handler
            if commandRCount >= 0 && currentMode == .default {
                startCountdownTimer()
            }
        }
    }

    private var countdownDuration: Int = 5
    private var countdownTimer: Timer?
    private var timeLeft: Int = 0
    private var sound: NSSound?
    private var soundIsPlaying = false
    private var isPaused: Bool = false {
        didSet {
            updateStatusBarTitle()
            updatePauseResumeMenuItem()
        }
    }
    private var sleepStartDate: Date?

    private enum TimerMode: String {
        case `default` = "Default Mode"
        case stacking = "Stacking Mode"
    }

    private var currentMode: TimerMode = .default {
        didSet { updateModeMenuItem() }
    }

    private var modeMenuItem: NSMenuItem!

    private let thresholdDefaultsKey = "NotificationThreshold"
    private let timeThresholdDefaultsKey = "TimeAccumulationThreshold"
    private let countdownDefaultsKey = "CountdownDuration"
    private let cycleItemsDefaultsKey = "CycleItems"
    private let cycleIndexDefaultsKey = "CycleIndex"
    private let cycleDurationsDefaultsKey = "CycleDurations"
    private let showCycleLabelOverlayKey = "ShowCycleLabelOverlay"
    private let stackingGoalDefaultsKey = "StackingGoal"

    private var showCycleLabelOverlay: Bool {
        get {
            // Default to true if never set
            guard UserDefaults.standard.object(forKey: showCycleLabelOverlayKey) != nil else { return true }
            return UserDefaults.standard.bool(forKey: showCycleLabelOverlayKey)
        }
        set {
            UserDefaults.standard.set(newValue, forKey: showCycleLabelOverlayKey)
        }
    }

    private var pauseResumeMenuItem: NSMenuItem!

    // MARK: - Undo state
    private var previousCount: Int = 0
    private var previousTimeLeft: Int = 0
    private var previousCycleIndex: Int = 0

    // MARK: - Stacking Mode state
    // stackingTotalTimeLeft: 0 at level start; increases when section banked early, decreases after section exhausted
    // stackingSectionTimeLeft: counts to 0 (never negative); only then does total start decrementing
    // stackingSectionExhausted: gates whether the total ticks (only true after section hits 0)
    // stackingCurrentAvg: 0 = use global default; updated at every level transition
    // stackingSplitTotalElapsed / stackingSplitCount: running sum/count for this level's splits (avg computed at transition)
    // stackingCurrentSplitElapsed: wall-clock seconds since last Ctrl+Space (resets each press)
    private var stackingIsActive: Bool = false
    private var stackingLevel: Int = 1
    private var stackingTotalTimeLeft: Int = 0
    private var stackingSectionTimeLeft: Int = 0
    private var stackingSectionExhausted: Bool = false
    private var stackingCurrentAvg: Int = 0          // frozen timeSplit for current level
    private var stackingSplitTotalElapsed: Double = 0 // kept for undo compatibility
    private var stackingSplitCount: Int = 0           // kept for undo compatibility
    private var stackingCurrentSplitElapsed: Int = 0
    // Global accumulators across all levels — drive timeSplit on level change
    private var stackingGlobalSumCount: Double = 0
    private var stackingGlobalTotalSplits: Int = 0
    // Delta from last banked split (positive = early, negative = over)
    private var stackingLastSplitDelta: Int = 0
    // Set by the timer when total crosses -goal; cleared after Ctrl+Space applies the downgrade
    private var stackingPendingDowngrade: Bool = false

    // Undo snapshot
    private var previousStackingIsActive: Bool = false
    private var previousStackingLevel: Int = 1
    private var previousStackingTotalTimeLeft: Int = 0
    private var previousStackingSectionTimeLeft: Int = 0
    private var previousStackingSectionExhausted: Bool = false
    private var previousStackingCurrentAvg: Int = 0
    private var previousStackingSplitTotalElapsed: Double = 0
    private var previousStackingSplitCount: Int = 0
    private var previousStackingCurrentSplitElapsed: Int = 0
    private var previousStackingGlobalSumCount: Double = 0
    private var previousStackingGlobalTotalSplits: Int = 0
    private var previousStackingLastSplitDelta: Int = 0
    private var previousStackingPendingDowngrade: Bool = false

    // MARK: - Cycle

    private var cycleItems: [String] {
        get { return UserDefaults.standard.stringArray(forKey: cycleItemsDefaultsKey) ?? [] }
        set { UserDefaults.standard.set(newValue, forKey: cycleItemsDefaultsKey) }
    }

    private var cycleIndex: Int {
        get { return UserDefaults.standard.integer(forKey: cycleIndexDefaultsKey) }
        set { UserDefaults.standard.set(newValue, forKey: cycleIndexDefaultsKey) }
    }

    // Parallel array to cycleItems — 0 means "use global countdownDuration"
    private var cycleDurations: [Int] {
        get { return (UserDefaults.standard.array(forKey: cycleDurationsDefaultsKey) as? [Int]) ?? [] }
        set { UserDefaults.standard.set(newValue, forKey: cycleDurationsDefaultsKey) }
    }

    // Returns the duration for the current cycle item, falling back to global countdownDuration
    private var currentCycleDuration: Int {
        let durations = cycleDurations
        let idx = cycleIndex % max(cycleItems.count, 1)
        if idx < durations.count && durations[idx] > 0 { return durations[idx] }
        return countdownDuration
    }

    private var currentCycleLabel: String {
        let items = cycleItems
        guard !items.isEmpty else { return "Counter" }
        return items[cycleIndex % items.count]
    }

    private func advanceCycleIndex() {
        let items = cycleItems
        guard !items.isEmpty else { return }
        cycleIndex = (cycleIndex + 1) % items.count
    }

    // MARK: - Persisted thresholds

    private var timeNotificationThreshold: Int {
        get {
            let value = UserDefaults.standard.integer(forKey: timeThresholdDefaultsKey)
            return value > 0 ? value : 30 * 60
        }
        set { UserDefaults.standard.set(newValue, forKey: timeThresholdDefaultsKey) }
    }

    private var notificationThreshold: Int {
        get {
            let value = UserDefaults.standard.integer(forKey: thresholdDefaultsKey)
            return value > 0 ? value : 30
        }
        set { UserDefaults.standard.set(newValue, forKey: thresholdDefaultsKey) }
    }

    // Goal (in seconds) for stacking level transitions. Reaching +goal = level up; -goal = level down.
    private var stackingGoal: Int {
        get {
            let v = UserDefaults.standard.integer(forKey: stackingGoalDefaultsKey)
            return v > 0 ? v : 15 * 60
        }
        set { UserDefaults.standard.set(newValue, forKey: stackingGoalDefaultsKey) }
    }

    // MARK: - Init

    init() {
        countdownDuration = UserDefaults.standard.integer(forKey: countdownDefaultsKey)
        if countdownDuration <= 0 { countdownDuration = 5 }

        statusBarItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        updateStatusBarTitle()
        statusBarItem.menu = createMenu()

        requestNotificationPermission()
        startGlobalEventMonitor()
        registerSleepLockObservers()
    }

    deinit {
        stopGlobalEventMonitor()
        NSWorkspace.shared.notificationCenter.removeObserver(self)
        DistributedNotificationCenter.default().removeObserver(self)
    }

    // MARK: - Menu

    private func createMenu() -> NSMenu {
        let menu = NSMenu()

        pauseResumeMenuItem = NSMenuItem(title: "Pause Timer", action: #selector(togglePauseResume), keyEquivalent: "")
        pauseResumeMenuItem.target = self
        menu.addItem(pauseResumeMenuItem)

        modeMenuItem = NSMenuItem(title: "Switch to \(TimerMode.stacking.rawValue)", action: #selector(toggleMode), keyEquivalent: "")
        modeMenuItem.target = self
        menu.addItem(modeMenuItem)

        let cycleItem = NSMenuItem(title: "Manage Cycle", action: #selector(manageCycle), keyEquivalent: "")
        cycleItem.target = self
        menu.addItem(cycleItem)

        let thresholdItem = NSMenuItem(title: "Counter Threshold", action: #selector(setNotificationThreshold), keyEquivalent: "")
        thresholdItem.target = self
        menu.addItem(thresholdItem)

        let timeThresholdItem = NSMenuItem(title: "Time Threshold", action: #selector(setTimeNotificationThreshold), keyEquivalent: "")
        timeThresholdItem.target = self
        menu.addItem(timeThresholdItem)

        let statsItem = NSMenuItem(title: "Stats", action: #selector(showStats), keyEquivalent: "")
        statsItem.target = self
        menu.addItem(statsItem)

        let resetItem = NSMenuItem(title: "Reset Counter", action: #selector(resetCounter), keyEquivalent: "")
        resetItem.target = self
        menu.addItem(resetItem)

        menu.addItem(NSMenuItem.separator())

        let quitItem = NSMenuItem(title: "Quit", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        quitItem.target = NSApp
        menu.addItem(quitItem)

        return menu
    }

    // MARK: - Alert helper

    /// Presents an NSAlert centered on screen using beginSheetModal (async, no QoS inversion).
    /// Creates a transparent helper window as the sheet parent, then closes it on completion.
    private func presentAlert(_ alert: NSAlert, firstResponder: NSView? = nil, completion: @escaping (NSApplication.ModalResponse) -> Void) {
        let helperWindow = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 0, height: 0),
            styleMask: .borderless,
            backing: .buffered,
            defer: false
        )
        // Prevent double-free: NSWindow's isReleasedWhenClosed defaults to true,
        // which causes the window to deallocate on close() while ARC still holds
        // a strong reference inside the closure — resulting in EXC_BAD_ACCESS.
        helperWindow.isReleasedWhenClosed = false
        helperWindow.isOpaque = false
        helperWindow.backgroundColor = .clear
        helperWindow.level = .floating
        helperWindow.center()
        NSApp.activate(ignoringOtherApps: true)
        helperWindow.makeKeyAndOrderFront(nil)

        alert.beginSheetModal(for: helperWindow) { response in
            completion(response) // read field values before window closes
            helperWindow.close()
        }

        if let fr = firstResponder {
            DispatchQueue.main.async {
                alert.window.makeFirstResponder(fr)
            }
        }
    }

    // MARK: - Cycle management

    @objc private func manageCycle() {
        let alert = NSAlert()
        alert.messageText = "Manage Cycle"
        alert.informativeText = "Enter entries as \"Label\" or \"Label:duration\" separated by commas.\nExample: Admin:10m, Learning:15m, Building\nOmit duration to use the global default below."
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.addButton(withTitle: "Cancel")

        let container = NSView(frame: NSRect(x: 0, y: 0, width: 360, height: 140))

        let items = cycleItems
        let durations = cycleDurations
        let currentValue = items.enumerated().map { i, label -> String in
            let dur = i < durations.count ? durations[i] : 0
            return dur > 0 ? "\(label):\(formatDuration(dur))" : label
        }.joined(separator: ", ")

        let labelsField = NSTextField(frame: NSRect(x: 0, y: 116, width: 360, height: 24))
        labelsField.stringValue = currentValue
        labelsField.placeholderString = "Admin:10m, Learning:15m, Building"

        let indexLabel = NSTextField(labelWithString: "Start at index (0-based):")
        indexLabel.frame = NSRect(x: 0, y: 92, width: 180, height: 17)
        let indexField = NSTextField(frame: NSRect(x: 185, y: 90, width: 60, height: 22))
        indexField.stringValue = "\(cycleIndex)"

        let globalDurLabel = NSTextField(labelWithString: "Global default duration:")
        globalDurLabel.frame = NSRect(x: 0, y: 66, width: 180, height: 17)
        let globalDurField = NSTextField(frame: NSRect(x: 185, y: 64, width: 80, height: 22))
        globalDurField.stringValue = formatDuration(countdownDuration)
        globalDurField.placeholderString = "e.g. 10m"

        let goalLabel = NSTextField(labelWithString: "Stacking goal (±level threshold):")
        goalLabel.frame = NSRect(x: 0, y: 40, width: 210, height: 17)
        let goalField = NSTextField(frame: NSRect(x: 215, y: 38, width: 80, height: 22))
        goalField.stringValue = formatDuration(stackingGoal)
        goalField.placeholderString = "e.g. 15m"

        let overlayCheckbox = NSButton(checkboxWithTitle: "Show Cycle Label on Press", target: nil, action: nil)
        overlayCheckbox.frame = NSRect(x: 0, y: 10, width: 360, height: 22)
        overlayCheckbox.state = showCycleLabelOverlay ? .on : .off

        container.addSubview(labelsField)
        container.addSubview(indexLabel)
        container.addSubview(indexField)
        container.addSubview(globalDurLabel)
        container.addSubview(globalDurField)
        container.addSubview(goalLabel)
        container.addSubview(goalField)
        container.addSubview(overlayCheckbox)
        alert.accessoryView = container

        presentAlert(alert, firstResponder: labelsField) { [weak self] response in
            guard let self = self, response == .alertFirstButtonReturn else { return }

            self.showCycleLabelOverlay = (overlayCheckbox.state == .on)

            let globalDurInput = globalDurField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)
            if let newSeconds = self.parseDuration(globalDurInput), newSeconds > 0 {
                self.countdownDuration = newSeconds
                UserDefaults.standard.set(newSeconds, forKey: self.countdownDefaultsKey)
            }

            let goalInput = goalField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)
            if let goalSeconds = self.parseDuration(goalInput), goalSeconds > 0 {
                self.stackingGoal = goalSeconds
            }

            let raw = labelsField.stringValue
            let entries = raw.split(separator: ",").map { $0.trimmingCharacters(in: .whitespaces) }.filter { !$0.isEmpty }
            var newLabels: [String] = []
            var newDurations: [Int] = []

            for entry in entries {
                if let colonRange = entry.range(of: ":") {
                    let label = String(entry[entry.startIndex..<colonRange.lowerBound]).trimmingCharacters(in: .whitespaces)
                    let durStr = String(entry[colonRange.upperBound...]).trimmingCharacters(in: .whitespaces)
                    newLabels.append(label)
                    newDurations.append(self.parseDuration(durStr) ?? 0)
                } else {
                    newLabels.append(entry)
                    newDurations.append(0)
                }
            }

            self.cycleItems = newLabels
            self.cycleDurations = newDurations

            if let requested = Int(indexField.stringValue), requested >= 0, requested < newLabels.count {
                self.cycleIndex = requested
            } else {
                self.cycleIndex = 0
            }
            self.updateStatusBarTitle()
        }
    }

    // MARK: - Stacking Mode helpers

    /// Number of fully completed tasks (splits banked) in the current stacking session.
    /// Zero until the second Ctrl+Space press (first split is tallied at that point).
    private var stackingCompletedTaskCount: Int {
        return stackingSplitCount
    }

    /// Handles a level-up (+1) or level-down (-1) transition in stacking mode.
    /// firstTimer resets to 0. timeSplit is recomputed from the global avg across all splits
    /// and then frozen until the next level change.
    private func performLevelTransition(direction: Int) {
        stackingLevel = max(1, stackingLevel + direction)

        // firstTimer always starts fresh at 0 — no carryover
        stackingTotalTimeLeft = 0

        // Recompute frozen timeSplit from global avg across every split ever banked
        if stackingGlobalTotalSplits > 0 {
            let globalAvg = stackingGlobalSumCount / Double(stackingGlobalTotalSplits)
            stackingCurrentAvg = Int((globalAvg * 1.25).rounded())
        } else {
            stackingCurrentAvg = countdownDuration
        }

        // Reset per-level split accumulators
        stackingSplitTotalElapsed = 0
        stackingSplitCount = 0
        stackingCurrentSplitElapsed = 0

        // Apply the now-frozen avg as the new section time
        stackingSectionTimeLeft = stackingCurrentAvg
        stackingSectionExhausted = false
    }

    // MARK: - Mode toggle

    @objc private func toggleMode() {
        currentMode = (currentMode == .default) ? .stacking : .default
        // Reset stacking state whenever mode switches
        countdownTimer?.invalidate()
        countdownTimer = nil
        sleepStartDate = nil
        stackingIsActive = false
        stackingLevel = 1
        stackingTotalTimeLeft = 0
        stackingSectionTimeLeft = 0
        stackingSectionExhausted = false
        stackingCurrentAvg = 0
        stackingSplitTotalElapsed = 0
        stackingSplitCount = 0
        stackingCurrentSplitElapsed = 0
        stackingGlobalSumCount = 0
        stackingGlobalTotalSplits = 0
        stackingLastSplitDelta = 0
        stackingPendingDowngrade = false
        updateStatusBarTitle()
    }

    private func updateModeMenuItem() {
        let newTitle = currentMode == .default
            ? "Switch to \(TimerMode.stacking.rawValue)"
            : "Switch to \(TimerMode.default.rawValue)"
        modeMenuItem.title = newTitle
    }

    private func updatePauseResumeMenuItem() {
        pauseResumeMenuItem.title = isPaused ? "Resume Timer" : "Pause Timer"
    }

    // MARK: - Status bar title

    /// Formats seconds as M:SS, allowing negatives (e.g. -1:05 for -65s).
    private func formatTimeAllowNeg(_ seconds: Int) -> String {
        let neg = seconds < 0
        let abs_s = abs(seconds)
        let m = abs_s / 60
        let s = abs_s % 60
        return "\(neg ? "-" : "")\(m):\(String(format: "%02d", s))"
    }

    private func updateStatusBarTitle() {
        let title: String

        switch currentMode {
        case .default:
            var t = "\(currentCycleLabel): \(commandRCount)"
            if countdownTimer != nil && timeLeft > 0 {
                let minutes = timeLeft / 60
                let seconds = timeLeft % 60
                let icon = isPaused ? "⏸" : "⏳"
                t += " | \(icon) \(String(format: "%d:%02d", minutes, seconds))"
            }
            title = t

        case .stacking:
            if stackingIsActive {
                let levelStr = "L\(stackingLevel)"
                let totalStr = formatTimeAllowNeg(stackingTotalTimeLeft)
                let sectionStr = formatTimeAllowNeg(stackingSectionTimeLeft)
                title = "\(levelStr) | \(totalStr) | \(sectionStr)"
            } else {
                // Not yet started: show idle state
                title = "L\(stackingLevel) | 0:00 | \(formatTimeAllowNeg(countdownDuration))"
            }
        }

        statusBarItem.button?.title = title
    }

    // MARK: - Stats Menu Action
    
    @objc private func showStats() {
        let alert = NSAlert()
        alert.messageText = "Stats"
        alert.informativeText = "Counter: \(commandRCount)"
        if currentMode == .stacking {
            alert.informativeText += "\nCompleted Tasks: \(stackingCompletedTaskCount)"
        }
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        presentAlert(alert) { _ in }
    }

    // MARK: - Reset

    @objc private func resetCounter() {
        // Save state for undo (same as Ctrl+Space)
        previousCount = commandRCount
        previousTimeLeft = timeLeft
        previousCycleIndex = cycleIndex
        previousStackingIsActive = stackingIsActive
        previousStackingLevel = stackingLevel
        previousStackingTotalTimeLeft = stackingTotalTimeLeft
        previousStackingSectionTimeLeft = stackingSectionTimeLeft
        previousStackingSectionExhausted = stackingSectionExhausted
        previousStackingCurrentAvg = stackingCurrentAvg
        previousStackingSplitTotalElapsed = stackingSplitTotalElapsed
        previousStackingSplitCount = stackingSplitCount
        previousStackingCurrentSplitElapsed = stackingCurrentSplitElapsed

        previousStackingGlobalSumCount = stackingGlobalSumCount
        previousStackingGlobalTotalSplits = stackingGlobalTotalSplits
        previousStackingLastSplitDelta = stackingLastSplitDelta
        previousStackingPendingDowngrade = stackingPendingDowngrade

        commandRCount = 0
        stopSound()
        countdownTimer?.invalidate()
        countdownTimer = nil
        sleepStartDate = nil
        timeLeft = 0
        stackingIsActive = false
        stackingLevel = 1
        stackingTotalTimeLeft = 0
        stackingSectionTimeLeft = 0
        stackingSectionExhausted = false
        stackingCurrentAvg = 0
        stackingSplitTotalElapsed = 0
        stackingSplitCount = 0
        stackingCurrentSplitElapsed = 0
        stackingGlobalSumCount = 0
        stackingGlobalTotalSplits = 0
        stackingLastSplitDelta = 0
        stackingPendingDowngrade = false
        isPaused = false
        updateStatusBarTitle()
    }

    // MARK: - Alert inputs

    @objc private func setNotificationThreshold() {
        let alert = NSAlert()
        alert.messageText = "Counter Threshold"
        alert.informativeText = "Enter the number of Control + Space presses before a notification is sent."
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.addButton(withTitle: "Cancel")

        let inputField = NSTextField(frame: NSRect(x: 0, y: 0, width: 200, height: 24))
        inputField.stringValue = "\(notificationThreshold)"
        alert.accessoryView = inputField

        presentAlert(alert, firstResponder: inputField) { [weak self] response in
            guard let self = self, response == .alertFirstButtonReturn else { return }
            if let newValue = Int(inputField.stringValue), newValue > 0 {
                self.notificationThreshold = newValue
            }
        }
    }

    @objc private func setCountdownDuration() {
        let alert = NSAlert()
        alert.messageText = "Countdown Duration"
        alert.informativeText = "Enter countdown duration (e.g. 90s, 1m30s, 2m)."
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.addButton(withTitle: "Cancel")

        let inputField = NSTextField(frame: NSRect(x: 0, y: 0, width: 200, height: 24))
        inputField.stringValue = formatDuration(countdownDuration)
        alert.accessoryView = inputField

        presentAlert(alert, firstResponder: inputField) { [weak self] response in
            guard let self = self, response == .alertFirstButtonReturn else { return }
            let input = inputField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)
            if let newSeconds = self.parseDuration(input) {
                self.countdownDuration = newSeconds
                UserDefaults.standard.set(newSeconds, forKey: self.countdownDefaultsKey)
            }
        }
    }

    @objc private func setTimeNotificationThreshold() {
        let alert = NSAlert()
        alert.messageText = "Set Time Notification Threshold"
        alert.informativeText = "Enter the number of minutes of accumulated time before a notification is sent."
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.addButton(withTitle: "Cancel")

        let inputField = NSTextField(frame: NSRect(x: 0, y: 0, width: 200, height: 24))
        inputField.stringValue = "\(timeNotificationThreshold / 60)"
        alert.accessoryView = inputField

        presentAlert(alert, firstResponder: inputField) { [weak self] response in
            guard let self = self, response == .alertFirstButtonReturn else { return }
            if let newValue = Int(inputField.stringValue), newValue > 0 {
                self.timeNotificationThreshold = newValue * 60
            }
        }
    }

    // MARK: - Sleep / Lock observers

    private func registerSleepLockObservers() {
        let workspaceNC = NSWorkspace.shared.notificationCenter
        
        // System sleep, screen sleep, and screen lock
        workspaceNC.addObserver(self, selector: #selector(handleSleepOrLock),
                                name: NSWorkspace.willSleepNotification, object: nil)
        workspaceNC.addObserver(self, selector: #selector(handleSleepOrLock),
                                name: NSWorkspace.screensDidSleepNotification, object: nil)
        DistributedNotificationCenter.default().addObserver(self, selector: #selector(handleSleepOrLock),
                                                            name: NSNotification.Name("com.apple.screenIsLocked"),
                                                            object: nil)
        
        // System wake, screen wake, and screen unlock
        workspaceNC.addObserver(self, selector: #selector(handleWakeOrUnlock),
                                name: NSWorkspace.didWakeNotification, object: nil)
        workspaceNC.addObserver(self, selector: #selector(handleWakeOrUnlock),
                                name: NSWorkspace.screensDidWakeNotification, object: nil)
        DistributedNotificationCenter.default().addObserver(self, selector: #selector(handleWakeOrUnlock),
                                                            name: NSNotification.Name("com.apple.screenIsUnlocked"),
                                                            object: nil)
    }

    @objc private func handleSleepOrLock() {
        guard !isPaused else { return }
        
        // Stop audio immediately
        stopSound()
        
        // Only set sleepStart if we haven't already captured it during this sleep transition
        if sleepStartDate == nil {
            sleepStartDate = Date()
        }
    }
    
    @objc private func handleWakeOrUnlock() {
        guard let sleepStart = sleepStartDate else { return }
        sleepStartDate = nil
        
        guard !isPaused else { return }
        
        let elapsedSeconds = Int(Date().timeIntervalSince(sleepStart))
        guard elapsedSeconds > 0 else { return }
        
        applyElapsedSleepTime(elapsedSeconds)
    }
    
    private func applyElapsedSleepTime(_ elapsed: Int) {
        switch currentMode {
        case .default:
            if countdownTimer != nil && timeLeft > 0 {
                timeLeft = max(0, timeLeft - elapsed)
                updateStatusBarTitle()
                
                if timeLeft == 0 {
                    countdownTimer?.invalidate()
                    countdownTimer = nil
                    updateStatusBarTitle()
                    playSoundLoop()
                }
            }
            
        case .stacking:
            if stackingIsActive {
                let S = stackingSectionTimeLeft
                stackingSectionTimeLeft -= elapsed
                stackingCurrentSplitElapsed += elapsed
                
                var decrements = 0
                if S <= 0 {
                    decrements = elapsed
                } else if S <= elapsed {
                    decrements = elapsed - S + 1
                }
                
                if decrements > 0 {
                    stackingTotalTimeLeft -= decrements
                    if stackingTotalTimeLeft <= -stackingGoal && !stackingPendingDowngrade {
                        stackingPendingDowngrade = true
                    }
                }
                updateStatusBarTitle()
            }
        }
    }

    // MARK: - Event monitor

    private func startGlobalEventMonitor() {
        let mask = CGEventMask(1 << CGEventType.keyDown.rawValue)
        let selfPtr = Unmanaged.passRetained(self).toOpaque()
        eventTapSelfPtr = selfPtr

        guard let tap = CGEvent.tapCreate(
            tap: .cgSessionEventTap,
            place: .headInsertEventTap,
            options: .defaultTap,
            eventsOfInterest: mask,
            callback: { proxy, type, event, refcon -> Unmanaged<CGEvent>? in
                guard let refcon = refcon else { return Unmanaged.passRetained(event) }
                let controller = Unmanaged<MenuBarController>.fromOpaque(refcon).takeUnretainedValue()
                return controller.handleCGEvent(type: type, event: event)
            },
            userInfo: selfPtr
        ) else {
            Unmanaged<MenuBarController>.fromOpaque(selfPtr).release()
            eventTapSelfPtr = nil
            print("CGEventTap creation failed — grant Accessibility permission in System Settings")
            return
        }

        eventTap = tap
        runLoopSource = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, tap, 0)
        CFRunLoopAddSource(CFRunLoopGetMain(), runLoopSource, .commonModes)
        CGEvent.tapEnable(tap: tap, enable: true)
    }

    private func handleCGEvent(type: CGEventType, event: CGEvent) -> Unmanaged<CGEvent>? {
        guard type == .keyDown else { return Unmanaged.passRetained(event) }

        let keyCode = event.getIntegerValueField(.keyboardEventKeycode)
        let flags = event.flags

        let hasControl = flags.contains(.maskControl)
        let hasShift   = flags.contains(.maskShift)
        let hasCommand = flags.contains(.maskCommand)

        let isCtrlSpace      = keyCode == 49 && hasControl && !hasShift && !hasCommand
        let isCtrlShiftSpace = keyCode == 49 && hasControl &&  hasShift && !hasCommand
        let isCmdCtrlC       = keyCode == 34 && hasControl &&  hasCommand

        guard isCtrlSpace || isCtrlShiftSpace || isCmdCtrlC else {
            return Unmanaged.passRetained(event) // not our shortcut — pass through
        }

        // ── Stacking mode: apply all state mutations synchronously so the menu bar
        //    updates on this run loop turn. The async block handles sound + overlay only.
        if isCtrlSpace && currentMode == .stacking {
            // Save undo snapshot
            previousCount                  = commandRCount
            previousTimeLeft               = timeLeft
            previousCycleIndex             = cycleIndex
            previousStackingIsActive       = stackingIsActive
            previousStackingLevel          = stackingLevel
            previousStackingTotalTimeLeft  = stackingTotalTimeLeft
            previousStackingSectionTimeLeft = stackingSectionTimeLeft
            previousStackingSectionExhausted = stackingSectionExhausted
            previousStackingCurrentAvg     = stackingCurrentAvg
            previousStackingSplitTotalElapsed = stackingSplitTotalElapsed
            previousStackingSplitCount     = stackingSplitCount
            previousStackingCurrentSplitElapsed = stackingCurrentSplitElapsed
            previousStackingGlobalSumCount = stackingGlobalSumCount
            previousStackingGlobalTotalSplits = stackingGlobalTotalSplits
            previousStackingLastSplitDelta = stackingLastSplitDelta
            previousStackingPendingDowngrade = stackingPendingDowngrade

            commandRCount += 1

            if !stackingIsActive {
                // First press
                stackingIsActive           = true
                stackingLevel              = 1
                stackingTotalTimeLeft      = 0
                stackingSectionTimeLeft    = countdownDuration
                stackingSectionExhausted   = false
                stackingCurrentAvg         = 0
                stackingSplitTotalElapsed  = 0
                stackingSplitCount         = 0
                stackingCurrentSplitElapsed = 0
                stackingGlobalSumCount     = 0
                stackingGlobalTotalSplits  = 0
                stackingLastSplitDelta     = 0
            } else {
                // Subsequent press: bank section time, tally split
                let sectionRemaining = stackingSectionTimeLeft
                if sectionRemaining > 0 { stackingTotalTimeLeft += sectionRemaining }

                let splitDuration = stackingCurrentSplitElapsed
                let frozenAvg = stackingCurrentAvg > 0 ? stackingCurrentAvg : countdownDuration
                stackingLastSplitDelta = frozenAvg - splitDuration

                stackingGlobalSumCount    += Double(splitDuration)
                stackingGlobalTotalSplits += 1
                stackingSplitTotalElapsed += Double(splitDuration)
                stackingSplitCount        += 1
                stackingCurrentSplitElapsed = 0

                var levelChange = 0
                if stackingPendingDowngrade {
                    stackingPendingDowngrade = false
                    levelChange = -1
                } else if stackingTotalTimeLeft >= stackingGoal {
                    levelChange = +1
                }

                if levelChange != 0 {
                    performLevelTransition(direction: levelChange)
                } else {
                    let frozen = stackingCurrentAvg > 0 ? stackingCurrentAvg : countdownDuration
                    stackingSectionTimeLeft  = frozen
                    stackingSectionExhausted = false
                }
            }

            updateStatusBarTitle()

            // Async block: sound, timer start, overlay only
            let wasFirstPress = !previousStackingIsActive
            let levelChanged  = stackingLevel != previousStackingLevel
            let wentUp        = stackingLevel > previousStackingLevel
            let capturedLevel = stackingLevel
            let capturedTotal = stackingTotalTimeLeft
            let capturedDelta = stackingLastSplitDelta
            let capturedAvg   = stackingCurrentAvg

            DispatchQueue.main.async { [weak self] in
                guard let self = self else { return }
                self.stopSound()
                if self.commandRCount > 1 { self.advanceCycleIndex() }
                self.isPaused = false
                self.playResetSound()
                if wasFirstPress { self.startCountdownTimer() }

                if self.showCycleLabelOverlay {
                    let levelStr = "L\(capturedLevel)"
                    if levelChanged {
                        let tag    = wentUp ? "(Upgrade)" : "(Downgrade)"
                        let avgStr = self.formatTimeAllowNeg(capturedAvg)
                        self.showOverlay("\(levelStr) \(tag) | \(avgStr)", levelUp: wentUp)
                    } else {
                        let totalStr = self.formatTimeAllowNeg(capturedTotal)
                        let delta    = capturedDelta
                        let deltaStr = delta >= 0
                            ? "+\(self.formatTimeAllowNeg(delta))"
                            : self.formatTimeAllowNeg(delta)
                        self.showOverlay("\(levelStr) | \(totalStr) | \(deltaStr)", splitDeltaPositive: delta >= 0)
                    }
                }
            }
            return nil // consume event
        }

        // Dispatch UI work to main thread
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }

            if isCmdCtrlC {
                self.togglePauseResume()

            } else if isCtrlShiftSpace {
                self.stopSound()
                self.countdownTimer?.invalidate()
                self.countdownTimer = nil
                self.commandRCount = self.previousCount
                self.timeLeft = self.previousTimeLeft
                self.cycleIndex = self.previousCycleIndex
                // Restore stacking state snapshot
                self.stackingIsActive = self.previousStackingIsActive
                self.stackingLevel = self.previousStackingLevel
                self.stackingTotalTimeLeft = self.previousStackingTotalTimeLeft
                self.stackingSectionTimeLeft = self.previousStackingSectionTimeLeft
                self.stackingSectionExhausted = self.previousStackingSectionExhausted
                self.stackingCurrentAvg = self.previousStackingCurrentAvg
                self.stackingSplitTotalElapsed = self.previousStackingSplitTotalElapsed
                self.stackingSplitCount = self.previousStackingSplitCount
                self.stackingCurrentSplitElapsed = self.previousStackingCurrentSplitElapsed
                self.stackingGlobalSumCount = self.previousStackingGlobalSumCount
                self.stackingGlobalTotalSplits = self.previousStackingGlobalTotalSplits
                self.stackingLastSplitDelta = self.previousStackingLastSplitDelta
                self.stackingPendingDowngrade = self.previousStackingPendingDowngrade
                self.isPaused = false
                if self.currentMode == .stacking {
                    if self.stackingIsActive {
                        self.startCountdownTimer()
                    } else {
                        self.updateStatusBarTitle()
                    }
                } else {
                    if self.timeLeft > 0 {
                        self.startCountdownTimer()
                    } else {
                        self.updateStatusBarTitle()
                    }
                }

            } else if isCtrlSpace {
                self.previousCount = self.commandRCount
                self.previousTimeLeft = self.timeLeft
                self.previousCycleIndex = self.cycleIndex
                // (stacking undo snapshot is saved synchronously before this block)

                self.stopSound()
                if self.commandRCount > 0 {
                    self.advanceCycleIndex()
                }
                self.commandRCount += 1
                self.isPaused = false
                self.playResetSound()

                switch self.currentMode {
                case .default:
                    self.timeLeft = self.currentCycleDuration

                case .stacking:
                    break // handled synchronously before this async block
                }

                // Default mode overlay
                self.startCountdownTimer()
                if self.showCycleLabelOverlay && !self.cycleItems.isEmpty {
                    let mins = self.timeLeft / 60
                    let secs = self.timeLeft % 60
                    self.showOverlay("\(self.currentCycleLabel) : \(mins):\(String(format: "%02d", secs))")
                }
            }
        }

        return nil // consume — prevents macOS alert sound
    }

    private func stopGlobalEventMonitor() {
        if let tap = eventTap {
            CGEvent.tapEnable(tap: tap, enable: false)
            if let source = runLoopSource {
                CFRunLoopRemoveSource(CFRunLoopGetMain(), source, .commonModes)
            }
            eventTap = nil
            runLoopSource = nil
        }
        if let ptr = eventTapSelfPtr {
            Unmanaged<MenuBarController>.fromOpaque(ptr).release()
            eventTapSelfPtr = nil
        }
    }

    // MARK: - Notifications

    private func requestNotificationPermission() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound]) { granted, error in
            if let error = error {
                print("Notification authorization error: \(error)")
            }
        }
    }

    private func sendNotification() {
        let content = UNMutableNotificationContent()
        content.title = "Counter Reached \(notificationThreshold)"
        content.body = "You have triggered Control + Space \(notificationThreshold) times!"
        content.sound = .default

        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: nil)
        UNUserNotificationCenter.current().add(request, withCompletionHandler: nil)
    }

    private func sendTimeNotification() {
        let minutes = timeNotificationThreshold / 60
        let content = UNMutableNotificationContent()
        content.title = "Accumulated Time Threshold Reached"
        content.body = "\(minutes) minutes stacked!"
        content.sound = .default
        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: nil)
        UNUserNotificationCenter.current().add(request, withCompletionHandler: nil)
    }

    // MARK: - Timer

    private func startCountdownTimer() {
        updateStatusBarTitle()

        // MARK: Stacking mode timer — runs continuously, never auto-stops
        if currentMode == .stacking {
            guard countdownTimer == nil else { return } // already running
            countdownTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
                guard let self = self else { return }
                if self.isPaused { return }

                self.stackingSectionTimeLeft -= 1
                self.stackingCurrentSplitElapsed += 1
                // firstTimer only ticks down once secondTimer is exhausted
                if self.stackingSectionTimeLeft <= 0 {
                    self.stackingTotalTimeLeft -= 1
                    // Flag a pending downgrade when total crosses the negative threshold;
                    // the actual transition fires on the next Ctrl+Space press
                    if self.stackingTotalTimeLeft <= -self.stackingGoal && !self.stackingPendingDowngrade {
                        self.stackingPendingDowngrade = true
                    }
                }
                self.updateStatusBarTitle()
            }
            RunLoop.main.add(countdownTimer!, forMode: .common)
            return
        }

        // MARK: Default mode timer — counts down to zero then stops
        countdownTimer?.invalidate()
        countdownTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] timer in
            guard let self = self else { return }
            if self.isPaused { return }

            self.timeLeft -= 1
            self.updateStatusBarTitle()

            if self.timeLeft <= 0 {
                timer.invalidate()
                self.countdownTimer = nil
                self.timeLeft = 0
                self.updateStatusBarTitle()
                self.playSoundLoop()
            }
        }

        RunLoop.main.add(countdownTimer!, forMode: .common)
    }

    @objc private func togglePauseResume() {
        isPaused.toggle()

        if isPaused {
            stopSound()
            showOverlay("⏸ Paused")
        } else {
            if currentMode == .stacking {
                if countdownTimer == nil && stackingIsActive {
                    startCountdownTimer()
                }
                let sectionStr = formatTimeAllowNeg(stackingSectionTimeLeft)
                let resumeLabel = cycleItems.isEmpty ? "▶ Resumed | \(sectionStr)" : "▶ \(currentCycleLabel) | \(sectionStr)"
                showOverlay(resumeLabel)
            } else {
                if countdownTimer == nil && timeLeft > 0 {
                    startCountdownTimer()
                }
                let timeStr = timeLeft > 0 ? " | \(timeLeft / 60):\(String(format: "%02d", timeLeft % 60))" : ""
                let resumeLabel = cycleItems.isEmpty ? "▶ Resumed\(timeStr)" : "▶ \(currentCycleLabel)\(timeStr)"
                showOverlay(resumeLabel)
            }
        }
    }

    // MARK: - HUD Overlay

    private var overlayWindow: NSWindow?
    private var overlayFadeTimer: Timer?

    private func showOverlay(_ message: String, splitDeltaPositive: Bool? = nil, levelUp: Bool? = nil) {
        // Cancel any previous overlay immediately
        overlayFadeTimer?.invalidate()
        overlayFadeTimer = nil
        overlayWindow?.close() // Use close() to remove from AppKit window list
        overlayWindow = nil

        let padding: CGFloat = 24
        let font = NSFont.systemFont(ofSize: 28, weight: .semibold)

        // Build attributed string: color only the last segment (after final " | ") when delta is present
        let attrString: NSMutableAttributedString
        let centered = NSMutableParagraphStyle()
        centered.alignment = .center

        let fullRange = NSRange(message.startIndex..., in: message)
        let baseAttrs: [NSAttributedString.Key: Any] = [
            .font: font,
            .foregroundColor: NSColor.white,
            .paragraphStyle: centered
        ]

        if let isUp = levelUp, let parenRange = message.range(of: "(") {
            // Level change overlay: color the "(Upgrade)" or "(Downgrade)" tag
            attrString = NSMutableAttributedString(string: message, attributes: baseAttrs)
            let tagColor: NSColor = isUp
                ? NSColor(red: 0.25, green: 0.85, blue: 0.45, alpha: 1)
                : NSColor(red: 1,    green: 0.35, blue: 0.35, alpha: 1)
            // Color only the "(Upgrade)" / "(Downgrade)" tag — stop at the next " | " if present
            let tagEnd = message.range(of: " | ", range: parenRange.lowerBound..<message.endIndex)?.lowerBound ?? message.endIndex
            attrString.addAttribute(.foregroundColor, value: tagColor,
                                    range: NSRange(parenRange.lowerBound..<tagEnd, in: message))
        } else if let isPositive = splitDeltaPositive, let pipeRange = message.range(of: " | ", options: .backwards) {
            attrString = NSMutableAttributedString(string: message, attributes: baseAttrs)
            let deltaColor: NSColor = isPositive
                ? NSColor(red: 0.25, green: 0.85, blue: 0.45, alpha: 1)
                : NSColor(red: 1,    green: 0.35, blue: 0.35, alpha: 1)
            attrString.addAttribute(.foregroundColor, value: deltaColor,
                                    range: NSRange(pipeRange.upperBound..., in: message))
        } else {
            attrString = NSMutableAttributedString(string: message, attributes: baseAttrs)
        }
        _ = fullRange // suppress unused warning

        let textSize = (message as NSString).size(withAttributes: [.font: font])
        let winSize = NSSize(width: textSize.width + padding * 2,
                            height: textSize.height + padding * 1.4)

        let mouseLocation = NSEvent.mouseLocation
        let screen = NSScreen.screens.first(where: { NSMouseInRect(mouseLocation, $0.frame, false) })
                     ?? NSScreen.screens[0]
        let origin = NSPoint(
            x: screen.frame.midX - winSize.width / 2,
            y: screen.visibleFrame.midY - winSize.height / 2
        )

        let win = NSPanel(
            contentRect: NSRect(origin: origin, size: winSize),
            styleMask: [.borderless, .nonactivatingPanel],
            backing: .buffered,
            defer: false
        )
        win.isReleasedWhenClosed = false // Allow ARC to manage deallocation on close()
        win.isOpaque = false
        win.backgroundColor = .clear
        win.level = .screenSaver
        win.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary, .transient]
        win.ignoresMouseEvents = true
        win.hasShadow = true
        win.becomesKeyOnlyIfNeeded = true

        let container = NSView(frame: NSRect(origin: .zero, size: winSize))
        container.wantsLayer = true
        container.layer?.backgroundColor = NSColor(white: 0.1, alpha: 0.82).cgColor
        container.layer?.cornerRadius = 14
        container.layer?.masksToBounds = true

        let label = NSTextField(labelWithString: "")
        label.attributedStringValue = attrString
        label.font = font
        label.alignment = .center
        label.frame = NSRect(x: 0, y: padding * 0.7,
                             width: winSize.width, height: textSize.height)
        container.addSubview(label)
        win.contentView = container

        win.alphaValue = 1.0
        win.orderFrontRegardless()
        overlayWindow = win

        // Use [weak self, win] to prevent strong reference cycles and call close()
        overlayFadeTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: false) { [weak self, win] _ in
            win.close()
            self?.overlayFadeTimer = nil
            self?.overlayWindow = nil
        }
    }

    // MARK: - Sound

    private func playResetSound() {
        guard let sound = NSSound(named: NSSound.Name("Hero")) else { return }
        sound.play()
        self.sound = sound
        self.soundIsPlaying = true
    }

    private func playSoundLoop() {
        guard let sound = NSSound(named: NSSound.Name("Glass")) else { return }
        sound.loops = true
        sound.play()
        self.sound = sound
        self.soundIsPlaying = true
    }

    private func stopSound() {
        sound?.stop()
        sound = nil
        soundIsPlaying = false
    }

    // MARK: - Duration parsing

    private func parseDuration(_ input: String) -> Int? {
        var totalSeconds = 0
        let regex = try! NSRegularExpression(pattern: "(\\d+)([mh]?s?)", options: .caseInsensitive)
        let matches = regex.matches(in: input, range: NSRange(input.startIndex..., in: input))

        for match in matches {
            guard let numRange = Range(match.range(at: 1), in: input),
                  let unitRange = Range(match.range(at: 2), in: input) else {
                continue
            }

            let number = Int(input[numRange]) ?? 0
            let unit = input[unitRange].lowercased()

            if unit.contains("m") && !unit.contains("s") {
                totalSeconds += number * 60
            } else if unit.contains("ms") || (unit.contains("m") && unit.contains("s")) {
                totalSeconds += number * 60
            } else {
                totalSeconds += number
            }
        }

        return totalSeconds > 0 ? totalSeconds : nil
    }

    private func formatDuration(_ seconds: Int) -> String {
        let minutes = seconds / 60
        let secs = seconds % 60
        return minutes > 0 ? "\(minutes)m\(secs)s" : "\(secs)s"
    }
}
```
## V2
- Changes
	- New Window centered and fixed (and always in front)
	- Able to have different times for the label rotations
	- Merged the Countdown timer (so within Manage Cycle)
	- Tells you how much time is left for given task when pressing `Control + Space`
	- Modified "Stacking" case so that it replicates my habit tracking feature. You just need to work at least 80% of your current working speed. That's it (but for real this time). Not like the google spreadsheet version. 
	- Modified UI and ensured speed.
```javascript
import Cocoa
import SwiftUI
import UserNotifications

class MenuBarController {
    private var statusBarItem: NSStatusItem!
    private var eventTap: CFMachPort?
    private var runLoopSource: CFRunLoopSource?
    private var eventTapSelfPtr: UnsafeMutableRawPointer?
    private var commandRCount: Int = 0 {
        didSet {
            updateStatusBarTitle()

            if commandRCount == notificationThreshold {
                sendNotification()
            }

            // In stacking mode the timer is managed manually by the event handler
            if commandRCount >= 0 && currentMode == .default {
                startCountdownTimer()
            }
        }
    }

    private var countdownDuration: Int = 5
    private var countdownTimer: Timer?
    private var timeLeft: Int = 0
    private var sound: NSSound?
    private var soundIsPlaying = false
    private var isPaused: Bool = false {
        didSet {
            updateStatusBarTitle()
            updatePauseResumeMenuItem()
        }
    }

    private enum TimerMode: String {
        case `default` = "Default Mode"
        case stacking = "Stacking Mode"
    }

    private var currentMode: TimerMode = .default {
        didSet { updateModeMenuItem() }
    }

    private var modeMenuItem: NSMenuItem!

    private let thresholdDefaultsKey = "NotificationThreshold"
    private let timeThresholdDefaultsKey = "TimeAccumulationThreshold"
    private let countdownDefaultsKey = "CountdownDuration"
    private let cycleItemsDefaultsKey = "CycleItems"
    private let cycleIndexDefaultsKey = "CycleIndex"
    private let cycleDurationsDefaultsKey = "CycleDurations"
    private let showCycleLabelOverlayKey = "ShowCycleLabelOverlay"
    private let stackingGoalDefaultsKey = "StackingGoal"

    private var showCycleLabelOverlay: Bool {
        get {
            // Default to true if never set
            guard UserDefaults.standard.object(forKey: showCycleLabelOverlayKey) != nil else { return true }
            return UserDefaults.standard.bool(forKey: showCycleLabelOverlayKey)
        }
        set {
            UserDefaults.standard.set(newValue, forKey: showCycleLabelOverlayKey)
            updateCycleLabelOverlayMenuItem()
        }
    }

    private var pauseResumeMenuItem: NSMenuItem!
    private var cycleLabelOverlayMenuItem: NSMenuItem!

    // MARK: - Undo state
    private var previousCount: Int = 0
    private var previousTimeLeft: Int = 0
    private var previousCycleIndex: Int = 0

    // MARK: - Stacking Mode state
    // stackingTotalTimeLeft: 0 at level start; increases when section banked early, decreases after section exhausted
    // stackingSectionTimeLeft: counts to 0 (never negative); only then does total start decrementing
    // stackingSectionExhausted: gates whether the total ticks (only true after section hits 0)
    // stackingCurrentAvg: 0 = use global default; updated at every level transition
    // stackingSplitTotalElapsed / stackingSplitCount: running sum/count for this level's splits (avg computed at transition)
    // stackingCurrentSplitElapsed: wall-clock seconds since last Ctrl+Space (resets each press)
    private var stackingIsActive: Bool = false
    private var stackingLevel: Int = 1
    private var stackingTotalTimeLeft: Int = 0
    private var stackingSectionTimeLeft: Int = 0
    private var stackingSectionExhausted: Bool = false
    private var stackingCurrentAvg: Int = 0          // frozen timeSplit for current level
    private var stackingSplitTotalElapsed: Double = 0 // kept for undo compatibility
    private var stackingSplitCount: Int = 0           // kept for undo compatibility
    private var stackingCurrentSplitElapsed: Int = 0
    // Global accumulators across all levels — drive timeSplit on level change
    private var stackingGlobalSumCount: Double = 0
    private var stackingGlobalTotalSplits: Int = 0
    // Delta from last banked split (positive = early, negative = over)
    private var stackingLastSplitDelta: Int = 0
    // Set by the timer when total crosses -goal; cleared after Ctrl+Space applies the downgrade
    private var stackingPendingDowngrade: Bool = false

    // Undo snapshot
    private var previousStackingIsActive: Bool = false
    private var previousStackingLevel: Int = 1
    private var previousStackingTotalTimeLeft: Int = 0
    private var previousStackingSectionTimeLeft: Int = 0
    private var previousStackingSectionExhausted: Bool = false
    private var previousStackingCurrentAvg: Int = 0
    private var previousStackingSplitTotalElapsed: Double = 0
    private var previousStackingSplitCount: Int = 0
    private var previousStackingCurrentSplitElapsed: Int = 0
    private var previousStackingGlobalSumCount: Double = 0
    private var previousStackingGlobalTotalSplits: Int = 0
    private var previousStackingLastSplitDelta: Int = 0
    private var previousStackingPendingDowngrade: Bool = false

    // MARK: - Cycle

    private var cycleItems: [String] {
        get { return UserDefaults.standard.stringArray(forKey: cycleItemsDefaultsKey) ?? [] }
        set { UserDefaults.standard.set(newValue, forKey: cycleItemsDefaultsKey) }
    }

    private var cycleIndex: Int {
        get { return UserDefaults.standard.integer(forKey: cycleIndexDefaultsKey) }
        set { UserDefaults.standard.set(newValue, forKey: cycleIndexDefaultsKey) }
    }

    // Parallel array to cycleItems — 0 means "use global countdownDuration"
    private var cycleDurations: [Int] {
        get { return (UserDefaults.standard.array(forKey: cycleDurationsDefaultsKey) as? [Int]) ?? [] }
        set { UserDefaults.standard.set(newValue, forKey: cycleDurationsDefaultsKey) }
    }

    // Returns the duration for the current cycle item, falling back to global countdownDuration
    private var currentCycleDuration: Int {
        let durations = cycleDurations
        let idx = cycleIndex % max(cycleItems.count, 1)
        if idx < durations.count && durations[idx] > 0 { return durations[idx] }
        return countdownDuration
    }

    private var currentCycleLabel: String {
        let items = cycleItems
        guard !items.isEmpty else { return "Counter" }
        return items[cycleIndex % items.count]
    }

    private func advanceCycleIndex() {
        let items = cycleItems
        guard !items.isEmpty else { return }
        cycleIndex = (cycleIndex + 1) % items.count
    }

    // MARK: - Persisted thresholds

    private var timeNotificationThreshold: Int {
        get {
            let value = UserDefaults.standard.integer(forKey: timeThresholdDefaultsKey)
            return value > 0 ? value : 30 * 60
        }
        set { UserDefaults.standard.set(newValue, forKey: timeThresholdDefaultsKey) }
    }

    private var notificationThreshold: Int {
        get {
            let value = UserDefaults.standard.integer(forKey: thresholdDefaultsKey)
            return value > 0 ? value : 30
        }
        set { UserDefaults.standard.set(newValue, forKey: thresholdDefaultsKey) }
    }

    // Goal (in seconds) for stacking level transitions. Reaching +goal = level up; -goal = level down.
    private var stackingGoal: Int {
        get {
            let v = UserDefaults.standard.integer(forKey: stackingGoalDefaultsKey)
            return v > 0 ? v : 15 * 60
        }
        set { UserDefaults.standard.set(newValue, forKey: stackingGoalDefaultsKey) }
    }

    // MARK: - Init

    init() {
        countdownDuration = UserDefaults.standard.integer(forKey: countdownDefaultsKey)
        if countdownDuration <= 0 { countdownDuration = 5 }

        statusBarItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        updateStatusBarTitle()
        statusBarItem.menu = createMenu()

        requestNotificationPermission()
        startGlobalEventMonitor()
        registerSleepLockObservers()
    }

    deinit {
        stopGlobalEventMonitor()
        NSWorkspace.shared.notificationCenter.removeObserver(self)
        DistributedNotificationCenter.default().removeObserver(self)
    }

    // MARK: - Menu

    private func createMenu() -> NSMenu {
        let menu = NSMenu()

        pauseResumeMenuItem = NSMenuItem(title: "Pause Timer", action: #selector(togglePauseResume), keyEquivalent: "")
        pauseResumeMenuItem.target = self
        menu.addItem(pauseResumeMenuItem)

        modeMenuItem = NSMenuItem(title: "Switch to \(TimerMode.stacking.rawValue)", action: #selector(toggleMode), keyEquivalent: "")
        modeMenuItem.target = self
        menu.addItem(modeMenuItem)

        let cycleItem = NSMenuItem(title: "Manage Cycle", action: #selector(manageCycle), keyEquivalent: "")
        cycleItem.target = self
        menu.addItem(cycleItem)

        cycleLabelOverlayMenuItem = NSMenuItem(title: "", action: #selector(toggleCycleLabelOverlay), keyEquivalent: "")
        cycleLabelOverlayMenuItem.target = self
        updateCycleLabelOverlayMenuItem()
        menu.addItem(cycleLabelOverlayMenuItem)

        let thresholdItem = NSMenuItem(title: "Counter Threshold", action: #selector(setNotificationThreshold), keyEquivalent: "")
        thresholdItem.target = self
        menu.addItem(thresholdItem)

        let timeThresholdItem = NSMenuItem(title: "Time Threshold", action: #selector(setTimeNotificationThreshold), keyEquivalent: "")
        timeThresholdItem.target = self
        menu.addItem(timeThresholdItem)

        let resetItem = NSMenuItem(title: "Reset Counter", action: #selector(resetCounter), keyEquivalent: "")
        resetItem.target = self
        menu.addItem(resetItem)

        menu.addItem(NSMenuItem.separator())

        let quitItem = NSMenuItem(title: "Quit", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        quitItem.target = NSApp
        menu.addItem(quitItem)

        return menu
    }

    // MARK: - Alert helper

    /// Presents an NSAlert centered on screen using beginSheetModal (async, no QoS inversion).
    /// Creates a transparent helper window as the sheet parent, then closes it on completion.
    private func presentAlert(_ alert: NSAlert, firstResponder: NSView? = nil, completion: @escaping (NSApplication.ModalResponse) -> Void) {
        let helperWindow = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 0, height: 0),
            styleMask: .borderless,
            backing: .buffered,
            defer: false
        )
        // Prevent double-free: NSWindow's isReleasedWhenClosed defaults to true,
        // which causes the window to deallocate on close() while ARC still holds
        // a strong reference inside the closure — resulting in EXC_BAD_ACCESS.
        helperWindow.isReleasedWhenClosed = false
        helperWindow.isOpaque = false
        helperWindow.backgroundColor = .clear
        helperWindow.level = .floating
        helperWindow.center()
        NSApp.activate(ignoringOtherApps: true)
        helperWindow.makeKeyAndOrderFront(nil)

        alert.beginSheetModal(for: helperWindow) { response in
            completion(response) // read field values before window closes
            helperWindow.close()
        }

        if let fr = firstResponder {
            DispatchQueue.main.async {
                alert.window.makeFirstResponder(fr)
            }
        }
    }

    // MARK: - Cycle management

    @objc private func manageCycle() {
        let alert = NSAlert()
        alert.messageText = "Manage Cycle"
        alert.informativeText = "Enter entries as \"Label\" or \"Label:duration\" separated by commas.\nExample: Admin:10m, Learning:15m, Building\nOmit duration to use the global default below."
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.addButton(withTitle: "Cancel")

        let container = NSView(frame: NSRect(x: 0, y: 0, width: 360, height: 110))

        let items = cycleItems
        let durations = cycleDurations
        let currentValue = items.enumerated().map { i, label -> String in
            let dur = i < durations.count ? durations[i] : 0
            return dur > 0 ? "\(label):\(formatDuration(dur))" : label
        }.joined(separator: ", ")

        let labelsField = NSTextField(frame: NSRect(x: 0, y: 86, width: 360, height: 24))
        labelsField.stringValue = currentValue
        labelsField.placeholderString = "Admin:10m, Learning:15m, Building"

        let indexLabel = NSTextField(labelWithString: "Start at index (0-based):")
        indexLabel.frame = NSRect(x: 0, y: 62, width: 180, height: 17)
        let indexField = NSTextField(frame: NSRect(x: 185, y: 60, width: 60, height: 22))
        indexField.stringValue = "\(cycleIndex)"

        let globalDurLabel = NSTextField(labelWithString: "Global default duration:")
        globalDurLabel.frame = NSRect(x: 0, y: 36, width: 180, height: 17)
        let globalDurField = NSTextField(frame: NSRect(x: 185, y: 34, width: 80, height: 22))
        globalDurField.stringValue = formatDuration(countdownDuration)
        globalDurField.placeholderString = "e.g. 10m"

        let goalLabel = NSTextField(labelWithString: "Stacking goal (±level threshold):")
        goalLabel.frame = NSRect(x: 0, y: 10, width: 210, height: 17)
        let goalField = NSTextField(frame: NSRect(x: 215, y: 8, width: 80, height: 22))
        goalField.stringValue = formatDuration(stackingGoal)
        goalField.placeholderString = "e.g. 15m"

        container.addSubview(labelsField)
        container.addSubview(indexLabel)
        container.addSubview(indexField)
        container.addSubview(globalDurLabel)
        container.addSubview(globalDurField)
        container.addSubview(goalLabel)
        container.addSubview(goalField)
        alert.accessoryView = container

        presentAlert(alert, firstResponder: labelsField) { [weak self] response in
            guard let self = self, response == .alertFirstButtonReturn else { return }

            let globalDurInput = globalDurField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)
            if let newSeconds = self.parseDuration(globalDurInput), newSeconds > 0 {
                self.countdownDuration = newSeconds
                UserDefaults.standard.set(newSeconds, forKey: self.countdownDefaultsKey)
            }

            let goalInput = goalField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)
            if let goalSeconds = self.parseDuration(goalInput), goalSeconds > 0 {
                self.stackingGoal = goalSeconds
            }

            let raw = labelsField.stringValue
            let entries = raw.split(separator: ",").map { $0.trimmingCharacters(in: .whitespaces) }.filter { !$0.isEmpty }
            var newLabels: [String] = []
            var newDurations: [Int] = []

            for entry in entries {
                if let colonRange = entry.range(of: ":") {
                    let label = String(entry[entry.startIndex..<colonRange.lowerBound]).trimmingCharacters(in: .whitespaces)
                    let durStr = String(entry[colonRange.upperBound...]).trimmingCharacters(in: .whitespaces)
                    newLabels.append(label)
                    newDurations.append(self.parseDuration(durStr) ?? 0)
                } else {
                    newLabels.append(entry)
                    newDurations.append(0)
                }
            }

            self.cycleItems = newLabels
            self.cycleDurations = newDurations

            if let requested = Int(indexField.stringValue), requested >= 0, requested < newLabels.count {
                self.cycleIndex = requested
            } else {
                self.cycleIndex = 0
            }
            self.updateStatusBarTitle()
        }
    }

    @objc private func toggleCycleLabelOverlay() {
        showCycleLabelOverlay.toggle()
    }

    private func updateCycleLabelOverlayMenuItem() {
        cycleLabelOverlayMenuItem.title = showCycleLabelOverlay
            ? "Hide Cycle Label on Press"
            : "Show Cycle Label on Press"
    }

    // MARK: - Stacking Mode helpers

    /// Number of fully completed tasks (splits banked) in the current stacking session.
    /// Zero until the second Ctrl+Space press (first split is tallied at that point).
    private var stackingCompletedTaskCount: Int {
        return stackingSplitCount
    }

    /// Handles a level-up (+1) or level-down (-1) transition in stacking mode.
    /// firstTimer resets to 0. timeSplit is recomputed from the global avg across all splits
    /// and then frozen until the next level change.
    private func performLevelTransition(direction: Int) {
        stackingLevel = max(1, stackingLevel + direction)

        // firstTimer always starts fresh at 0 — no carryover
        stackingTotalTimeLeft = 0

        // Recompute frozen timeSplit from global avg across every split ever banked
        if stackingGlobalTotalSplits > 0 {
            let globalAvg = stackingGlobalSumCount / Double(stackingGlobalTotalSplits)
            stackingCurrentAvg = Int((globalAvg * 1.25).rounded())
        } else {
            stackingCurrentAvg = countdownDuration
        }

        // Reset per-level split accumulators
        stackingSplitTotalElapsed = 0
        stackingSplitCount = 0
        stackingCurrentSplitElapsed = 0

        // Apply the now-frozen avg as the new section time
        stackingSectionTimeLeft = stackingCurrentAvg
        stackingSectionExhausted = false
    }

    // MARK: - Mode toggle

    @objc private func toggleMode() {
        currentMode = (currentMode == .default) ? .stacking : .default
        // Reset stacking state whenever mode switches
        countdownTimer?.invalidate()
        countdownTimer = nil
        stackingIsActive = false
        stackingLevel = 1
        stackingTotalTimeLeft = 0
        stackingSectionTimeLeft = 0
        stackingSectionExhausted = false
        stackingCurrentAvg = 0
        stackingSplitTotalElapsed = 0
        stackingSplitCount = 0
        stackingCurrentSplitElapsed = 0
        stackingGlobalSumCount = 0
        stackingGlobalTotalSplits = 0
        stackingLastSplitDelta = 0
        stackingPendingDowngrade = false
        updateStatusBarTitle()
    }

    private func updateModeMenuItem() {
        let newTitle = currentMode == .default
            ? "Switch to \(TimerMode.stacking.rawValue)"
            : "Switch to \(TimerMode.default.rawValue)"
        modeMenuItem.title = newTitle
    }

    private func updatePauseResumeMenuItem() {
        pauseResumeMenuItem.title = isPaused ? "Resume Timer" : "Pause Timer"
    }

    // MARK: - Status bar title

    /// Formats seconds as M:SS, allowing negatives (e.g. -1:05 for -65s).
    private func formatTimeAllowNeg(_ seconds: Int) -> String {
        let neg = seconds < 0
        let abs_s = abs(seconds)
        let m = abs_s / 60
        let s = abs_s % 60
        return "\(neg ? "-" : "")\(m):\(String(format: "%02d", s))"
    }

    private func updateStatusBarTitle() {
        let title: String

        switch currentMode {
        case .default:
            var t = "\(currentCycleLabel): \(commandRCount)"
            if countdownTimer != nil && timeLeft > 0 {
                let minutes = timeLeft / 60
                let seconds = timeLeft % 60
                let icon = isPaused ? "⏸" : "⏳"
                t += " | \(icon) \(String(format: "%d:%02d", minutes, seconds))"
            }
            title = t

        case .stacking:
            if stackingIsActive {
                let levelStr = "L\(stackingLevel)"
                let totalStr = formatTimeAllowNeg(stackingTotalTimeLeft)
                let sectionStr = formatTimeAllowNeg(stackingSectionTimeLeft)
                title = "\(levelStr) | \(totalStr) | \(sectionStr)"
            } else {
                // Not yet started: show idle state
                title = "L\(stackingLevel) | 0:00 | \(formatTimeAllowNeg(countdownDuration))"
            }
        }

        statusBarItem.button?.title = title
    }

    // MARK: - Reset

    @objc private func resetCounter() {
        // Save state for undo (same as Ctrl+Space)
        previousCount = commandRCount
        previousTimeLeft = timeLeft
        previousCycleIndex = cycleIndex
        previousStackingIsActive = stackingIsActive
        previousStackingLevel = stackingLevel
        previousStackingTotalTimeLeft = stackingTotalTimeLeft
        previousStackingSectionTimeLeft = stackingSectionTimeLeft
        previousStackingSectionExhausted = stackingSectionExhausted
        previousStackingCurrentAvg = stackingCurrentAvg
        previousStackingSplitTotalElapsed = stackingSplitTotalElapsed
        previousStackingSplitCount = stackingSplitCount
        previousStackingCurrentSplitElapsed = stackingCurrentSplitElapsed

        previousStackingGlobalSumCount = stackingGlobalSumCount
        previousStackingGlobalTotalSplits = stackingGlobalTotalSplits
        previousStackingLastSplitDelta = stackingLastSplitDelta
        previousStackingPendingDowngrade = stackingPendingDowngrade

        commandRCount = 0
        stopSound()
        countdownTimer?.invalidate()
        countdownTimer = nil
        timeLeft = 0
        stackingIsActive = false
        stackingLevel = 1
        stackingTotalTimeLeft = 0
        stackingSectionTimeLeft = 0
        stackingSectionExhausted = false
        stackingCurrentAvg = 0
        stackingSplitTotalElapsed = 0
        stackingSplitCount = 0
        stackingCurrentSplitElapsed = 0
        stackingGlobalSumCount = 0
        stackingGlobalTotalSplits = 0
        stackingLastSplitDelta = 0
        stackingPendingDowngrade = false
        isPaused = false
        updateStatusBarTitle()
    }

    // MARK: - Alert inputs

    @objc private func setNotificationThreshold() {
        let alert = NSAlert()
        alert.messageText = "Counter Threshold"
        alert.informativeText = "Enter the number of Control + Space presses before a notification is sent."
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.addButton(withTitle: "Cancel")

        let inputField = NSTextField(frame: NSRect(x: 0, y: 0, width: 200, height: 24))
        inputField.stringValue = "\(notificationThreshold)"
        alert.accessoryView = inputField

        presentAlert(alert, firstResponder: inputField) { [weak self] response in
            guard let self = self, response == .alertFirstButtonReturn else { return }
            if let newValue = Int(inputField.stringValue), newValue > 0 {
                self.notificationThreshold = newValue
            }
        }
    }

    @objc private func setCountdownDuration() {
        let alert = NSAlert()
        alert.messageText = "Countdown Duration"
        alert.informativeText = "Enter countdown duration (e.g. 90s, 1m30s, 2m)."
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.addButton(withTitle: "Cancel")

        let inputField = NSTextField(frame: NSRect(x: 0, y: 0, width: 200, height: 24))
        inputField.stringValue = formatDuration(countdownDuration)
        alert.accessoryView = inputField

        presentAlert(alert, firstResponder: inputField) { [weak self] response in
            guard let self = self, response == .alertFirstButtonReturn else { return }
            let input = inputField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)
            if let newSeconds = self.parseDuration(input) {
                self.countdownDuration = newSeconds
                UserDefaults.standard.set(newSeconds, forKey: self.countdownDefaultsKey)
            }
        }
    }

    @objc private func setTimeNotificationThreshold() {
        let alert = NSAlert()
        alert.messageText = "Set Time Notification Threshold"
        alert.informativeText = "Enter the number of minutes of accumulated time before a notification is sent."
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.addButton(withTitle: "Cancel")

        let inputField = NSTextField(frame: NSRect(x: 0, y: 0, width: 200, height: 24))
        inputField.stringValue = "\(timeNotificationThreshold / 60)"
        alert.accessoryView = inputField

        presentAlert(alert, firstResponder: inputField) { [weak self] response in
            guard let self = self, response == .alertFirstButtonReturn else { return }
            if let newValue = Int(inputField.stringValue), newValue > 0 {
                self.timeNotificationThreshold = newValue * 60
            }
        }
    }

    // MARK: - Sleep / Lock observers

    private func registerSleepLockObservers() {
        let workspaceNC = NSWorkspace.shared.notificationCenter
        // System sleep and screen sleep
        workspaceNC.addObserver(self, selector: #selector(handleSleepOrLock),
                                name: NSWorkspace.willSleepNotification, object: nil)
        workspaceNC.addObserver(self, selector: #selector(handleSleepOrLock),
                                name: NSWorkspace.screensDidSleepNotification, object: nil)
        // Screen lock (sent by the loginwindow process)
        DistributedNotificationCenter.default().addObserver(self, selector: #selector(handleSleepOrLock),
                                                            name: NSNotification.Name("com.apple.screenIsLocked"),
                                                            object: nil)
    }

    @objc private func handleSleepOrLock() {
        guard !isPaused else { return }
        isPaused = true
        stopSound()
    }

    // MARK: - Event monitor

    private func startGlobalEventMonitor() {
        let mask = CGEventMask(1 << CGEventType.keyDown.rawValue)
        let selfPtr = Unmanaged.passRetained(self).toOpaque()
        eventTapSelfPtr = selfPtr

        guard let tap = CGEvent.tapCreate(
            tap: .cgSessionEventTap,
            place: .headInsertEventTap,
            options: .defaultTap,
            eventsOfInterest: mask,
            callback: { proxy, type, event, refcon -> Unmanaged<CGEvent>? in
                guard let refcon = refcon else { return Unmanaged.passRetained(event) }
                let controller = Unmanaged<MenuBarController>.fromOpaque(refcon).takeUnretainedValue()
                return controller.handleCGEvent(type: type, event: event)
            },
            userInfo: selfPtr
        ) else {
            Unmanaged<MenuBarController>.fromOpaque(selfPtr).release()
            eventTapSelfPtr = nil
            print("CGEventTap creation failed — grant Accessibility permission in System Settings")
            return
        }

        eventTap = tap
        runLoopSource = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, tap, 0)
        CFRunLoopAddSource(CFRunLoopGetMain(), runLoopSource, .commonModes)
        CGEvent.tapEnable(tap: tap, enable: true)
    }

    private func handleCGEvent(type: CGEventType, event: CGEvent) -> Unmanaged<CGEvent>? {
        guard type == .keyDown else { return Unmanaged.passRetained(event) }

        let keyCode = event.getIntegerValueField(.keyboardEventKeycode)
        let flags = event.flags

        let hasControl = flags.contains(.maskControl)
        let hasShift   = flags.contains(.maskShift)
        let hasCommand = flags.contains(.maskCommand)

        let isCtrlSpace      = keyCode == 49 && hasControl && !hasShift && !hasCommand
        let isCtrlShiftSpace = keyCode == 49 && hasControl &&  hasShift && !hasCommand
        let isCmdCtrlC       = keyCode == 34 && hasControl &&  hasCommand

        guard isCtrlSpace || isCtrlShiftSpace || isCmdCtrlC else {
            return Unmanaged.passRetained(event) // not our shortcut — pass through
        }

        // ── Stacking mode: apply all state mutations synchronously so the menu bar
        //    updates on this run loop turn. The async block handles sound + overlay only.
        if isCtrlSpace && currentMode == .stacking {
            // Save undo snapshot
            previousCount                  = commandRCount
            previousTimeLeft               = timeLeft
            previousCycleIndex             = cycleIndex
            previousStackingIsActive       = stackingIsActive
            previousStackingLevel          = stackingLevel
            previousStackingTotalTimeLeft  = stackingTotalTimeLeft
            previousStackingSectionTimeLeft = stackingSectionTimeLeft
            previousStackingSectionExhausted = stackingSectionExhausted
            previousStackingCurrentAvg     = stackingCurrentAvg
            previousStackingSplitTotalElapsed = stackingSplitTotalElapsed
            previousStackingSplitCount     = stackingSplitCount
            previousStackingCurrentSplitElapsed = stackingCurrentSplitElapsed
            previousStackingGlobalSumCount = stackingGlobalSumCount
            previousStackingGlobalTotalSplits = stackingGlobalTotalSplits
            previousStackingLastSplitDelta = stackingLastSplitDelta
            previousStackingPendingDowngrade = stackingPendingDowngrade

            commandRCount += 1

            if !stackingIsActive {
                // First press
                stackingIsActive           = true
                stackingLevel              = 1
                stackingTotalTimeLeft      = 0
                stackingSectionTimeLeft    = countdownDuration
                stackingSectionExhausted   = false
                stackingCurrentAvg         = 0
                stackingSplitTotalElapsed  = 0
                stackingSplitCount         = 0
                stackingCurrentSplitElapsed = 0
                stackingGlobalSumCount     = 0
                stackingGlobalTotalSplits  = 0
                stackingLastSplitDelta     = 0
            } else {
                // Subsequent press: bank section time, tally split
                let sectionRemaining = stackingSectionTimeLeft
                if sectionRemaining > 0 { stackingTotalTimeLeft += sectionRemaining }

                let splitDuration = stackingCurrentSplitElapsed
                let frozenAvg = stackingCurrentAvg > 0 ? stackingCurrentAvg : countdownDuration
                stackingLastSplitDelta = frozenAvg - splitDuration

                stackingGlobalSumCount    += Double(splitDuration)
                stackingGlobalTotalSplits += 1
                stackingSplitTotalElapsed += Double(splitDuration)
                stackingSplitCount        += 1
                stackingCurrentSplitElapsed = 0

                var levelChange = 0
                if stackingPendingDowngrade {
                    stackingPendingDowngrade = false
                    levelChange = -1
                } else if stackingTotalTimeLeft >= stackingGoal {
                    levelChange = +1
                }

                if levelChange != 0 {
                    performLevelTransition(direction: levelChange)
                } else {
                    let frozen = stackingCurrentAvg > 0 ? stackingCurrentAvg : countdownDuration
                    stackingSectionTimeLeft  = frozen
                    stackingSectionExhausted = false
                }
            }

            updateStatusBarTitle()

            // Async block: sound, timer start, overlay only
            let wasFirstPress = !previousStackingIsActive
            let levelChanged  = stackingLevel != previousStackingLevel
            let wentUp        = stackingLevel > previousStackingLevel
            let capturedLevel = stackingLevel
            let capturedTotal = stackingTotalTimeLeft
            let capturedDelta = stackingLastSplitDelta
            let capturedAvg   = stackingCurrentAvg

            DispatchQueue.main.async { [weak self] in
                guard let self = self else { return }
                self.stopSound()
                if self.commandRCount > 1 { self.advanceCycleIndex() }
                self.isPaused = false
                self.playResetSound()
                if wasFirstPress { self.startCountdownTimer() }

                if self.showCycleLabelOverlay {
                    let levelStr = "L\(capturedLevel)"
                    if levelChanged {
                        let tag    = wentUp ? "(Upgrade)" : "(Downgrade)"
                        let avgStr = self.formatTimeAllowNeg(capturedAvg)
                        self.showOverlay("\(levelStr) \(tag) | \(avgStr)", levelUp: wentUp)
                    } else {
                        let totalStr = self.formatTimeAllowNeg(capturedTotal)
                        let delta    = capturedDelta
                        let deltaStr = delta >= 0
                            ? "+\(self.formatTimeAllowNeg(delta))"
                            : self.formatTimeAllowNeg(delta)
                        self.showOverlay("\(levelStr) | \(totalStr) | \(deltaStr)", splitDeltaPositive: delta >= 0)
                    }
                }
            }
            return nil // consume event
        }

        // Dispatch UI work to main thread
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }

            if isCmdCtrlC {
                self.togglePauseResume()

            } else if isCtrlShiftSpace {
                self.stopSound()
                self.countdownTimer?.invalidate()
                self.countdownTimer = nil
                self.commandRCount = self.previousCount
                self.timeLeft = self.previousTimeLeft
                self.cycleIndex = self.previousCycleIndex
                // Restore stacking state snapshot
                self.stackingIsActive = self.previousStackingIsActive
                self.stackingLevel = self.previousStackingLevel
                self.stackingTotalTimeLeft = self.previousStackingTotalTimeLeft
                self.stackingSectionTimeLeft = self.previousStackingSectionTimeLeft
                self.stackingSectionExhausted = self.previousStackingSectionExhausted
                self.stackingCurrentAvg = self.previousStackingCurrentAvg
                self.stackingSplitTotalElapsed = self.previousStackingSplitTotalElapsed
                self.stackingSplitCount = self.previousStackingSplitCount
                self.stackingCurrentSplitElapsed = self.previousStackingCurrentSplitElapsed
                self.stackingGlobalSumCount = self.previousStackingGlobalSumCount
                self.stackingGlobalTotalSplits = self.previousStackingGlobalTotalSplits
                self.stackingLastSplitDelta = self.previousStackingLastSplitDelta
                self.stackingPendingDowngrade = self.previousStackingPendingDowngrade
                self.isPaused = false
                if self.currentMode == .stacking {
                    if self.stackingIsActive {
                        self.startCountdownTimer()
                    } else {
                        self.updateStatusBarTitle()
                    }
                } else {
                    if self.timeLeft > 0 {
                        self.startCountdownTimer()
                    } else {
                        self.updateStatusBarTitle()
                    }
                }

            } else if isCtrlSpace {
                self.previousCount = self.commandRCount
                self.previousTimeLeft = self.timeLeft
                self.previousCycleIndex = self.cycleIndex
                // (stacking undo snapshot is saved synchronously before this block)

                self.stopSound()
                if self.commandRCount > 0 {
                    self.advanceCycleIndex()
                }
                self.commandRCount += 1
                self.isPaused = false
                self.playResetSound()

                switch self.currentMode {
                case .default:
                    self.timeLeft = self.currentCycleDuration

                case .stacking:
                    break // handled synchronously before this async block
                }

                // Default mode overlay

                // Default mode overlay
                self.startCountdownTimer()
                if self.showCycleLabelOverlay && !self.cycleItems.isEmpty {
                    let mins = self.timeLeft / 60
                    let secs = self.timeLeft % 60
                    self.showOverlay("\(self.currentCycleLabel) : \(mins):\(String(format: "%02d", secs))")
                }
            }
        }

        return nil // consume — prevents macOS alert sound
    }

    private func stopGlobalEventMonitor() {
        if let tap = eventTap {
            CGEvent.tapEnable(tap: tap, enable: false)
            if let source = runLoopSource {
                CFRunLoopRemoveSource(CFRunLoopGetMain(), source, .commonModes)
            }
            eventTap = nil
            runLoopSource = nil
        }
        if let ptr = eventTapSelfPtr {
            Unmanaged<MenuBarController>.fromOpaque(ptr).release()
            eventTapSelfPtr = nil
        }
    }

    // MARK: - Notifications

    private func requestNotificationPermission() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound]) { granted, error in
            if let error = error {
                print("Notification authorization error: \(error)")
            }
        }
    }

    private func sendNotification() {
        let content = UNMutableNotificationContent()
        content.title = "Counter Reached \(notificationThreshold)"
        content.body = "You have triggered Control + Space \(notificationThreshold) times!"
        content.sound = .default

        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: nil)
        UNUserNotificationCenter.current().add(request, withCompletionHandler: nil)
    }

    private func sendTimeNotification() {
        let minutes = timeNotificationThreshold / 60
        let content = UNMutableNotificationContent()
        content.title = "Accumulated Time Threshold Reached"
        content.body = "\(minutes) minutes stacked!"
        content.sound = .default
        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: nil)
        UNUserNotificationCenter.current().add(request, withCompletionHandler: nil)
    }

    // MARK: - Timer

    private func startCountdownTimer() {
        updateStatusBarTitle()

        // MARK: Stacking mode timer — runs continuously, never auto-stops
        if currentMode == .stacking {
            guard countdownTimer == nil else { return } // already running
            countdownTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
                guard let self = self else { return }
                if self.isPaused { return }

                self.stackingSectionTimeLeft -= 1
                self.stackingCurrentSplitElapsed += 1
                // firstTimer only ticks down once secondTimer is exhausted
                if self.stackingSectionTimeLeft <= 0 {
                    self.stackingTotalTimeLeft -= 1
                    // Flag a pending downgrade when total crosses the negative threshold;
                    // the actual transition fires on the next Ctrl+Space press
                    if self.stackingTotalTimeLeft <= -self.stackingGoal && !self.stackingPendingDowngrade {
                        self.stackingPendingDowngrade = true
                    }
                }
                self.updateStatusBarTitle()
            }
            RunLoop.main.add(countdownTimer!, forMode: .common)
            return
        }

        // MARK: Default mode timer — counts down to zero then stops
        countdownTimer?.invalidate()
        countdownTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { timer in
            if self.isPaused { return }

            self.timeLeft -= 1
            self.updateStatusBarTitle()

            if self.timeLeft <= 0 {
                timer.invalidate()
                self.countdownTimer = nil
                self.timeLeft = 0
                self.updateStatusBarTitle()
                self.playSoundLoop()
            }
        }

        RunLoop.main.add(countdownTimer!, forMode: .common)
    }

    @objc private func togglePauseResume() {
        isPaused.toggle()

        if isPaused {
            stopSound()
            showOverlay("⏸ Paused")
        } else {
            if currentMode == .stacking {
                if countdownTimer == nil && stackingIsActive {
                    startCountdownTimer()
                }
                let sectionStr = formatTimeAllowNeg(stackingSectionTimeLeft)
                let resumeLabel = cycleItems.isEmpty ? "▶ Resumed | \(sectionStr)" : "▶ \(currentCycleLabel) | \(sectionStr)"
                showOverlay(resumeLabel)
            } else {
                if countdownTimer == nil && timeLeft > 0 {
                    startCountdownTimer()
                }
                let timeStr = timeLeft > 0 ? " | \(timeLeft / 60):\(String(format: "%02d", timeLeft % 60))" : ""
                let resumeLabel = cycleItems.isEmpty ? "▶ Resumed\(timeStr)" : "▶ \(currentCycleLabel)\(timeStr)"
                showOverlay(resumeLabel)
            }
        }
    }

    // MARK: - HUD Overlay

    private var overlayWindow: NSWindow?
    private var overlayFadeTimer: Timer?

    private func showOverlay(_ message: String, splitDeltaPositive: Bool? = nil, levelUp: Bool? = nil) {
        // Cancel any previous overlay immediately
        overlayFadeTimer?.invalidate()
        overlayFadeTimer = nil
        overlayWindow?.orderOut(nil)
        overlayWindow = nil

        let padding: CGFloat = 24
        let font = NSFont.systemFont(ofSize: 28, weight: .semibold)

        // Build attributed string: color only the last segment (after final " | ") when delta is present
        let attrString: NSMutableAttributedString
        let centered = NSMutableParagraphStyle()
        centered.alignment = .center

        let fullRange = NSRange(message.startIndex..., in: message)
        let baseAttrs: [NSAttributedString.Key: Any] = [
            .font: font,
            .foregroundColor: NSColor.white,
            .paragraphStyle: centered
        ]

        if let isUp = levelUp, let parenRange = message.range(of: "(") {
            // Level change overlay: color the "(Upgrade)" or "(Downgrade)" tag
            attrString = NSMutableAttributedString(string: message, attributes: baseAttrs)
            let tagColor: NSColor = isUp
                ? NSColor(red: 0.25, green: 0.85, blue: 0.45, alpha: 1)
                : NSColor(red: 1,    green: 0.35, blue: 0.35, alpha: 1)
            // Color only the "(Upgrade)" / "(Downgrade)" tag — stop at the next " | " if present
            let tagEnd = message.range(of: " | ", range: parenRange.lowerBound..<message.endIndex)?.lowerBound ?? message.endIndex
            attrString.addAttribute(.foregroundColor, value: tagColor,
                                    range: NSRange(parenRange.lowerBound..<tagEnd, in: message))
        } else if let isPositive = splitDeltaPositive, let pipeRange = message.range(of: " | ", options: .backwards) {
            attrString = NSMutableAttributedString(string: message, attributes: baseAttrs)
            let deltaColor: NSColor = isPositive
                ? NSColor(red: 0.25, green: 0.85, blue: 0.45, alpha: 1)
                : NSColor(red: 1,    green: 0.35, blue: 0.35, alpha: 1)
            attrString.addAttribute(.foregroundColor, value: deltaColor,
                                    range: NSRange(pipeRange.upperBound..., in: message))
        } else {
            attrString = NSMutableAttributedString(string: message, attributes: baseAttrs)
        }
        _ = fullRange // suppress unused warning

        let textSize = (message as NSString).size(withAttributes: [.font: font])
        let winSize = NSSize(width: textSize.width + padding * 2,
                            height: textSize.height + padding * 1.4)

        let mouseLocation = NSEvent.mouseLocation
        let screen = NSScreen.screens.first(where: { NSMouseInRect(mouseLocation, $0.frame, false) })
                     ?? NSScreen.screens[0]
        let origin = NSPoint(
            x: screen.frame.midX - winSize.width / 2,
            y: screen.visibleFrame.midY - winSize.height / 2
        )

        let win = NSPanel(
            contentRect: NSRect(origin: origin, size: winSize),
            styleMask: [.borderless, .nonactivatingPanel],
            backing: .buffered,
            defer: false
        )
        win.isOpaque = false
        win.backgroundColor = .clear
        win.level = .screenSaver
        win.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary, .transient]
        win.ignoresMouseEvents = true
        win.hasShadow = true
        win.becomesKeyOnlyIfNeeded = true

        let container = NSView(frame: NSRect(origin: .zero, size: winSize))
        container.wantsLayer = true
        container.layer?.backgroundColor = NSColor(white: 0.1, alpha: 0.82).cgColor
        container.layer?.cornerRadius = 14
        container.layer?.masksToBounds = true

        let label = NSTextField(labelWithString: "")
        label.attributedStringValue = attrString
        label.font = font
        label.alignment = .center
        label.frame = NSRect(x: 0, y: padding * 0.7,
                             width: winSize.width, height: textSize.height)
        container.addSubview(label)
        win.contentView = container

        win.alphaValue = 1.0
        win.orderFrontRegardless()
        overlayWindow = win

        // Strong capture of win — no weak refs, no animation context
        overlayFadeTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: false) { [win] _ in
            win.orderOut(nil)
        }
    }

    // MARK: - Sound

    private func playResetSound() {
        guard let sound = NSSound(named: NSSound.Name("Hero")) else { return }
        sound.play()
        self.sound = sound
        self.soundIsPlaying = true
    }

    private func playSoundLoop() {
        guard let sound = NSSound(named: NSSound.Name("Glass")) else { return }
        sound.loops = true
        sound.play()
        self.sound = sound
        self.soundIsPlaying = true
    }

    private func stopSound() {
        sound?.stop()
        sound = nil
        soundIsPlaying = false
    }

    // MARK: - Duration parsing

    private func parseDuration(_ input: String) -> Int? {
        var totalSeconds = 0
        let regex = try! NSRegularExpression(pattern: "(\\d+)([mh]?s?)", options: .caseInsensitive)
        let matches = regex.matches(in: input, range: NSRange(input.startIndex..., in: input))

        for match in matches {
            guard let numRange = Range(match.range(at: 1), in: input),
                  let unitRange = Range(match.range(at: 2), in: input) else {
                continue
            }

            let number = Int(input[numRange]) ?? 0
            let unit = input[unitRange].lowercased()

            if unit.contains("m") && !unit.contains("s") {
                totalSeconds += number * 60
            } else if unit.contains("ms") || (unit.contains("m") && unit.contains("s")) {
                totalSeconds += number * 60
            } else {
                totalSeconds += number
            }
        }

        return totalSeconds > 0 ? totalSeconds : nil
    }

    private func formatDuration(_ seconds: Int) -> String {
        let minutes = seconds / 60
        let secs = seconds % 60
        return minutes > 0 ? "\(minutes)m\(secs)s" : "\(secs)s"
    }
}
```

## V1
- Cycles Through Labels (Except 0 -> 1) 
- Added `Control + Shift + Space` to go back one
- Added Index to `Manage Cycle` so that I can keep track of how much I work
- Added shortcut `Command + Control + C` for universal pausing (both for qwerty and `dvorak`)
- Made it so the previous state saves when pressing `restart`
	- 36MB for above in background
	- 21.8mb seems typical (even for below)
- The timer pauses when
	- On sleep notification
	- When display turns off
	- When screen is locked
- Fixed background shortcut noise by converting pauses and skips to `GCEventTap` from `addGlobalMonitorForEvents`
- Added a small UI element that tells you if it's paused or unpaused
	- The functionality is that it just shows at the center of the screen
- Added a function to view the labels you're cycling through (but also able to turn them off.)
- Fixed the text in the UI of "Resumed" and the "Manage Cycle" so it shows
- Added feature so that the location my cursor is on is where the UI shows (for resumed/paused and for the label in `managecycle`)
- Modified the the `resume` section so it's just `▶ {Label}: {time}` or just `▶ {label}` with no time left. And just `▶ Resume` if no labels in `Manage Cycle`
```swift
import Cocoa
import SwiftUI
import UserNotifications

class MenuBarController {
    private var statusBarItem: NSStatusItem!
    private var eventTap: CFMachPort?
    private var runLoopSource: CFRunLoopSource?
    private var eventTapSelfPtr: UnsafeMutableRawPointer?
    private var commandRCount: Int = 0 {
        didSet {
            updateStatusBarTitle()

            if commandRCount == notificationThreshold {
                sendNotification()
            }

            if commandRCount >= 0 {
                startCountdownTimer()
            }
        }
    }

    private var countdownDuration: Int = 5
    private var countdownTimer: Timer?
    private var timeLeft: Int = 0
    private var sound: NSSound?
    private var soundIsPlaying = false
    private var isPaused: Bool = false {
        didSet {
            updateStatusBarTitle()
            updatePauseResumeMenuItem()
        }
    }

    private enum TimerMode: String {
        case `default` = "Default Mode"
        case stacking = "Stacking Mode"
    }

    private var currentMode: TimerMode = .default {
        didSet { updateModeMenuItem() }
    }

    private var modeMenuItem: NSMenuItem!

    private let thresholdDefaultsKey = "NotificationThreshold"
    private let timeThresholdDefaultsKey = "TimeAccumulationThreshold"
    private let countdownDefaultsKey = "CountdownDuration"
    private let cycleItemsDefaultsKey = "CycleItems"
    private let cycleIndexDefaultsKey = "CycleIndex"
    private let showCycleLabelOverlayKey = "ShowCycleLabelOverlay"

    private var showCycleLabelOverlay: Bool {
        get {
            // Default to true if never set
            guard UserDefaults.standard.object(forKey: showCycleLabelOverlayKey) != nil else { return true }
            return UserDefaults.standard.bool(forKey: showCycleLabelOverlayKey)
        }
        set {
            UserDefaults.standard.set(newValue, forKey: showCycleLabelOverlayKey)
            updateCycleLabelOverlayMenuItem()
        }
    }

    private var pauseResumeMenuItem: NSMenuItem!
    private var cycleLabelOverlayMenuItem: NSMenuItem!

    // MARK: - Undo state
    private var previousCount: Int = 0
    private var previousTimeLeft: Int = 0
    private var previousCycleIndex: Int = 0

    // MARK: - Cycle

    private var cycleItems: [String] {
        get { return UserDefaults.standard.stringArray(forKey: cycleItemsDefaultsKey) ?? [] }
        set { UserDefaults.standard.set(newValue, forKey: cycleItemsDefaultsKey) }
    }

    private var cycleIndex: Int {
        get { return UserDefaults.standard.integer(forKey: cycleIndexDefaultsKey) }
        set { UserDefaults.standard.set(newValue, forKey: cycleIndexDefaultsKey) }
    }

    private var currentCycleLabel: String {
        let items = cycleItems
        guard !items.isEmpty else { return "Counter" }
        return items[cycleIndex % items.count]
    }

    private func advanceCycleIndex() {
        let items = cycleItems
        guard !items.isEmpty else { return }
        cycleIndex = (cycleIndex + 1) % items.count
    }

    // MARK: - Persisted thresholds

    private var timeNotificationThreshold: Int {
        get {
            let value = UserDefaults.standard.integer(forKey: timeThresholdDefaultsKey)
            return value > 0 ? value : 30 * 60
        }
        set { UserDefaults.standard.set(newValue, forKey: timeThresholdDefaultsKey) }
    }

    private var notificationThreshold: Int {
        get {
            let value = UserDefaults.standard.integer(forKey: thresholdDefaultsKey)
            return value > 0 ? value : 30
        }
        set { UserDefaults.standard.set(newValue, forKey: thresholdDefaultsKey) }
    }

    // MARK: - Init

    init() {
        countdownDuration = UserDefaults.standard.integer(forKey: countdownDefaultsKey)
        if countdownDuration <= 0 { countdownDuration = 5 }

        statusBarItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        updateStatusBarTitle()
        statusBarItem.menu = createMenu()

        requestNotificationPermission()
        startGlobalEventMonitor()
        registerSleepLockObservers()
    }

    deinit {
        stopGlobalEventMonitor()
        NSWorkspace.shared.notificationCenter.removeObserver(self)
        DistributedNotificationCenter.default().removeObserver(self)
    }

    // MARK: - Menu

    private func createMenu() -> NSMenu {
        let menu = NSMenu()

        pauseResumeMenuItem = NSMenuItem(title: "Pause Timer", action: #selector(togglePauseResume), keyEquivalent: "")
        pauseResumeMenuItem.target = self
        menu.addItem(pauseResumeMenuItem)

        modeMenuItem = NSMenuItem(title: "Switch to \(TimerMode.stacking.rawValue)", action: #selector(toggleMode), keyEquivalent: "")
        modeMenuItem.target = self
        menu.addItem(modeMenuItem)

        let cycleItem = NSMenuItem(title: "Manage Cycle", action: #selector(manageCycle), keyEquivalent: "")
        cycleItem.target = self
        menu.addItem(cycleItem)

        cycleLabelOverlayMenuItem = NSMenuItem(title: "", action: #selector(toggleCycleLabelOverlay), keyEquivalent: "")
        cycleLabelOverlayMenuItem.target = self
        updateCycleLabelOverlayMenuItem()
        menu.addItem(cycleLabelOverlayMenuItem)

        let thresholdItem = NSMenuItem(title: "Counter Threshold", action: #selector(setNotificationThreshold), keyEquivalent: "")
        thresholdItem.target = self
        menu.addItem(thresholdItem)

        let timeThresholdItem = NSMenuItem(title: "Time Threshold", action: #selector(setTimeNotificationThreshold), keyEquivalent: "")
        timeThresholdItem.target = self
        menu.addItem(timeThresholdItem)

        let durationItem = NSMenuItem(title: "Countdown Duration", action: #selector(setCountdownDuration), keyEquivalent: "")
        durationItem.target = self
        menu.addItem(durationItem)

        let resetItem = NSMenuItem(title: "Reset Counter", action: #selector(resetCounter), keyEquivalent: "")
        resetItem.target = self
        menu.addItem(resetItem)

        menu.addItem(NSMenuItem.separator())

        let quitItem = NSMenuItem(title: "Quit", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        quitItem.target = NSApp
        menu.addItem(quitItem)

        return menu
    }

    // MARK: - Cycle management

    @objc private func manageCycle() {
        let alert = NSAlert()
        alert.messageText = "Manage Cycle"
        alert.informativeText = "Enter cycle labels separated by commas (e.g. Task A, Task B, Task C).\nLeave empty to disable cycling."
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.addButton(withTitle: "Cancel")

        let container = NSView(frame: NSRect(x: 0, y: 0, width: 300, height: 58))

        let labelsField = NSTextField(frame: NSRect(x: 0, y: 34, width: 300, height: 24))
        labelsField.stringValue = cycleItems.joined(separator: ", ")
        labelsField.placeholderString = "Task A, Task B, Task C"

        let indexLabel = NSTextField(labelWithString: "Start at index (0-based):")
        indexLabel.frame = NSRect(x: 0, y: 10, width: 180, height: 17)

        let indexField = NSTextField(frame: NSRect(x: 185, y: 8, width: 60, height: 22))
        indexField.stringValue = "\(cycleIndex)"

        container.addSubview(labelsField)
        container.addSubview(indexLabel)
        container.addSubview(indexField)
        alert.accessoryView = container

        if alert.runModal() == .alertFirstButtonReturn {
            let raw = labelsField.stringValue
            let items = raw
                .split(separator: ",")
                .map { $0.trimmingCharacters(in: .whitespaces) }
                .filter { !$0.isEmpty }
            cycleItems = items
            if let requested = Int(indexField.stringValue), requested >= 0, requested < items.count {
                cycleIndex = requested
            } else {
                cycleIndex = 0
            }
            updateStatusBarTitle()
        }
    }

    @objc private func toggleCycleLabelOverlay() {
        showCycleLabelOverlay.toggle()
    }

    private func updateCycleLabelOverlayMenuItem() {
        cycleLabelOverlayMenuItem.title = showCycleLabelOverlay
            ? "Hide Cycle Label on Press"
            : "Show Cycle Label on Press"
    }

    // MARK: - Mode toggle

    @objc private func toggleMode() {
        currentMode = (currentMode == .default) ? .stacking : .default
    }

    private func updateModeMenuItem() {
        let newTitle = currentMode == .default
            ? "Switch to \(TimerMode.stacking.rawValue)"
            : "Switch to \(TimerMode.default.rawValue)"
        modeMenuItem.title = newTitle
    }

    private func updatePauseResumeMenuItem() {
        pauseResumeMenuItem.title = isPaused ? "Resume Timer" : "Pause Timer"
    }

    // MARK: - Status bar title

    private func updateStatusBarTitle() {
        var title = "\(currentCycleLabel): \(commandRCount)"
        if countdownTimer != nil && timeLeft > 0 {
            let minutes = timeLeft / 60
            let seconds = timeLeft % 60
            let icon = isPaused ? "⏸" : "⏳"
            title += " | \(icon) \(String(format: "%d:%02d", minutes, seconds))"
        }
        statusBarItem.button?.title = title
    }

    // MARK: - Reset

    @objc private func resetCounter() {
        // Save state for undo (same as Ctrl+Space)
        previousCount = commandRCount
        previousTimeLeft = timeLeft
        previousCycleIndex = cycleIndex

        commandRCount = 0
        stopSound()
        countdownTimer?.invalidate()
        countdownTimer = nil
        timeLeft = 0
        isPaused = false
        updateStatusBarTitle()
    }

    // MARK: - Alert inputs

    @objc private func setNotificationThreshold() {
        let alert = NSAlert()
        alert.messageText = "Counter Threshold"
        alert.informativeText = "Enter the number of Control + Space presses before a notification is sent."
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.addButton(withTitle: "Cancel")

        let inputField = NSTextField(frame: NSRect(x: 0, y: 0, width: 200, height: 24))
        inputField.stringValue = "\(notificationThreshold)"
        alert.accessoryView = inputField

        if alert.runModal() == .alertFirstButtonReturn {
            if let newValue = Int(inputField.stringValue), newValue > 0 {
                notificationThreshold = newValue
            }
        }
    }

    @objc private func setCountdownDuration() {
        let alert = NSAlert()
        alert.messageText = "Countdown Duration"
        alert.informativeText = "Enter countdown duration (e.g. 90s, 1m30s, 2m)."
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.addButton(withTitle: "Cancel")

        let inputField = NSTextField(frame: NSRect(x: 0, y: 0, width: 200, height: 24))
        inputField.stringValue = formatDuration(countdownDuration)
        alert.accessoryView = inputField

        if alert.runModal() == .alertFirstButtonReturn {
            let input = inputField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)
            if let newSeconds = parseDuration(input) {
                countdownDuration = newSeconds
                UserDefaults.standard.set(newSeconds, forKey: countdownDefaultsKey)
            }
        }
    }

    @objc private func setTimeNotificationThreshold() {
        let alert = NSAlert()
        alert.messageText = "Set Time Notification Threshold"
        alert.informativeText = "Enter the number of minutes of accumulated time before a notification is sent."
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.addButton(withTitle: "Cancel")

        let inputField = NSTextField(frame: NSRect(x: 0, y: 0, width: 200, height: 24))
        inputField.stringValue = "\(timeNotificationThreshold / 60)"
        alert.accessoryView = inputField

        if alert.runModal() == .alertFirstButtonReturn {
            if let newValue = Int(inputField.stringValue), newValue > 0 {
                timeNotificationThreshold = newValue * 60
            }
        }
    }

    // MARK: - Sleep / Lock observers

    private func registerSleepLockObservers() {
        let workspaceNC = NSWorkspace.shared.notificationCenter
        // System sleep and screen sleep
        workspaceNC.addObserver(self, selector: #selector(handleSleepOrLock),
                                name: NSWorkspace.willSleepNotification, object: nil)
        workspaceNC.addObserver(self, selector: #selector(handleSleepOrLock),
                                name: NSWorkspace.screensDidSleepNotification, object: nil)
        // Screen lock (sent by the loginwindow process)
        DistributedNotificationCenter.default().addObserver(self, selector: #selector(handleSleepOrLock),
                                                            name: NSNotification.Name("com.apple.screenIsLocked"),
                                                            object: nil)
    }

    @objc private func handleSleepOrLock() {
        guard !isPaused else { return }
        isPaused = true
        stopSound()
    }

    // MARK: - Event monitor

    private func startGlobalEventMonitor() {
        let mask = CGEventMask(1 << CGEventType.keyDown.rawValue)
        let selfPtr = Unmanaged.passRetained(self).toOpaque()
        eventTapSelfPtr = selfPtr

        guard let tap = CGEvent.tapCreate(
            tap: .cgSessionEventTap,
            place: .headInsertEventTap,
            options: .defaultTap,
            eventsOfInterest: mask,
            callback: { proxy, type, event, refcon -> Unmanaged<CGEvent>? in
                guard let refcon = refcon else { return Unmanaged.passRetained(event) }
                let controller = Unmanaged<MenuBarController>.fromOpaque(refcon).takeUnretainedValue()
                return controller.handleCGEvent(type: type, event: event)
            },
            userInfo: selfPtr
        ) else {
            Unmanaged<MenuBarController>.fromOpaque(selfPtr).release()
            eventTapSelfPtr = nil
            print("CGEventTap creation failed — grant Accessibility permission in System Settings")
            return
        }

        eventTap = tap
        runLoopSource = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, tap, 0)
        CFRunLoopAddSource(CFRunLoopGetMain(), runLoopSource, .commonModes)
        CGEvent.tapEnable(tap: tap, enable: true)
    }

    private func handleCGEvent(type: CGEventType, event: CGEvent) -> Unmanaged<CGEvent>? {
        guard type == .keyDown else { return Unmanaged.passRetained(event) }

        let keyCode = event.getIntegerValueField(.keyboardEventKeycode)
        let flags = event.flags

        let hasControl = flags.contains(.maskControl)
        let hasShift   = flags.contains(.maskShift)
        let hasCommand = flags.contains(.maskCommand)

        let isCtrlSpace      = keyCode == 49 && hasControl && !hasShift && !hasCommand
        let isCtrlShiftSpace = keyCode == 49 && hasControl &&  hasShift && !hasCommand
        let isCmdCtrlC       = keyCode == 34 && hasControl &&  hasCommand

        guard isCtrlSpace || isCtrlShiftSpace || isCmdCtrlC else {
            return Unmanaged.passRetained(event) // not our shortcut — pass through
        }

        // Dispatch UI work to main thread
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }

            if isCmdCtrlC {
                self.togglePauseResume()

            } else if isCtrlShiftSpace {
                self.stopSound()
                self.countdownTimer?.invalidate()
                self.countdownTimer = nil
                self.commandRCount = self.previousCount
                self.timeLeft = self.previousTimeLeft
                self.cycleIndex = self.previousCycleIndex
                self.isPaused = false
                if self.timeLeft > 0 {
                    self.startCountdownTimer()
                } else {
                    self.updateStatusBarTitle()
                }

            } else if isCtrlSpace {
                self.previousCount = self.commandRCount
                self.previousTimeLeft = self.timeLeft
                self.previousCycleIndex = self.cycleIndex

                self.stopSound()
                if self.commandRCount > 0 {
                    self.advanceCycleIndex()
                }
                self.commandRCount += 1
                self.isPaused = false
                self.playResetSound()

                switch self.currentMode {
                case .default:
                    self.timeLeft = self.countdownDuration
                case .stacking:
                    if self.timeLeft == 0 {
                        self.timeLeft = self.countdownDuration
                    } else {
                        self.timeLeft += self.countdownDuration
                    }
                    if self.timeLeft >= self.timeNotificationThreshold {
                        self.sendTimeNotification()
                    }
                }
                self.startCountdownTimer()
                if self.showCycleLabelOverlay && !self.cycleItems.isEmpty {
                    self.showOverlay(self.currentCycleLabel)
                }
            }
        }

        return nil // consume — prevents macOS alert sound
    }

    private func stopGlobalEventMonitor() {
        if let tap = eventTap {
            CGEvent.tapEnable(tap: tap, enable: false)
            if let source = runLoopSource {
                CFRunLoopRemoveSource(CFRunLoopGetMain(), source, .commonModes)
            }
            eventTap = nil
            runLoopSource = nil
        }
        if let ptr = eventTapSelfPtr {
            Unmanaged<MenuBarController>.fromOpaque(ptr).release()
            eventTapSelfPtr = nil
        }
    }

    // MARK: - Notifications

    private func requestNotificationPermission() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound]) { granted, error in
            if let error = error {
                print("Notification authorization error: \(error)")
            }
        }
    }

    private func sendNotification() {
        let content = UNMutableNotificationContent()
        content.title = "Counter Reached \(notificationThreshold)"
        content.body = "You have triggered Control + Space \(notificationThreshold) times!"
        content.sound = .default

        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: nil)
        UNUserNotificationCenter.current().add(request, withCompletionHandler: nil)
    }

    private func sendTimeNotification() {
        let minutes = timeNotificationThreshold / 60
        let content = UNMutableNotificationContent()
        content.title = "Accumulated Time Threshold Reached"
        content.body = "\(minutes) minutes stacked!"
        content.sound = .default
        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: nil)
        UNUserNotificationCenter.current().add(request, withCompletionHandler: nil)
    }

    // MARK: - Timer

    private func startCountdownTimer() {
        updateStatusBarTitle()

        countdownTimer?.invalidate()
        countdownTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { timer in
            if self.isPaused { return }

            self.timeLeft -= 1
            self.updateStatusBarTitle()

            if self.timeLeft <= 0 {
                timer.invalidate()
                self.countdownTimer = nil
                self.timeLeft = 0
                self.updateStatusBarTitle()
                self.playSoundLoop()
            }
        }

        RunLoop.main.add(countdownTimer!, forMode: .common)
    }

    @objc private func togglePauseResume() {
        isPaused.toggle()

        if isPaused {
            stopSound()
            showOverlay("⏸ Paused")
        } else {
            if countdownTimer == nil && timeLeft > 0 { 
                startCountdownTimer()
            }
            let timeStr = timeLeft > 0 ? " | \(timeLeft / 60):\(String(format: "%02d", timeLeft % 60))" : ""
            let resumeLabel = cycleItems.isEmpty ? "▶ Resumed\(timeStr)" : "▶ \(currentCycleLabel)\(timeStr)"
            showOverlay(resumeLabel)
        }
    }

    // MARK: - HUD Overlay

    private var overlayWindow: NSWindow?
    private var overlayFadeTimer: Timer?

    private func showOverlay(_ message: String) {
        // Cancel any previous overlay immediately
        overlayFadeTimer?.invalidate()
        overlayFadeTimer = nil
        overlayWindow?.orderOut(nil)
        overlayWindow = nil

        let padding: CGFloat = 24
        let font = NSFont.systemFont(ofSize: 28, weight: .semibold)
        let textSize = (message as NSString).size(withAttributes: [.font: font])
        let winSize = NSSize(width: textSize.width + padding * 2,
                            height: textSize.height + padding * 1.4)

        let mouseLocation = NSEvent.mouseLocation
        let screen = NSScreen.screens.first(where: { NSMouseInRect(mouseLocation, $0.frame, false) })
                     ?? NSScreen.screens[0]
        let screenFrame = screen.visibleFrame
        let origin = NSPoint(
            x: screenFrame.midX - winSize.width / 2,
            y: screenFrame.midY - winSize.height / 2
        )

        let win = NSPanel(
            contentRect: NSRect(origin: origin, size: winSize),
            styleMask: [.borderless, .nonactivatingPanel],
            backing: .buffered,
            defer: false
        )
        win.isOpaque = false
        win.backgroundColor = .clear
        win.level = .screenSaver
        win.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary, .transient]
        win.ignoresMouseEvents = true
        win.hasShadow = true
        win.becomesKeyOnlyIfNeeded = true

        let container = NSView(frame: NSRect(origin: .zero, size: winSize))
        container.wantsLayer = true
        container.layer?.backgroundColor = NSColor(white: 0.1, alpha: 0.82).cgColor
        container.layer?.cornerRadius = 14
        container.layer?.masksToBounds = true

        let label = NSTextField(labelWithString: message)
        label.font = font
        label.textColor = .white
        label.alignment = .center
        label.frame = NSRect(x: 0, y: padding * 0.7,
                             width: winSize.width, height: textSize.height)
        container.addSubview(label)
        win.contentView = container

        win.alphaValue = 1.0
        win.orderFrontRegardless()
        overlayWindow = win

        // Strong capture of win — no weak refs, no animation context
        overlayFadeTimer = Timer.scheduledTimer(withTimeInterval: 1.4, repeats: false) { [win] _ in
            win.orderOut(nil)
        }
    }

    // MARK: - Sound

    private func playResetSound() {
        guard let sound = NSSound(named: NSSound.Name("Hero")) else { return }
        sound.play()
        self.sound = sound
        self.soundIsPlaying = true
    }

    private func playSoundLoop() {
        guard let sound = NSSound(named: NSSound.Name("Glass")) else { return }
        sound.loops = true
        sound.play()
        self.sound = sound
        self.soundIsPlaying = true
    }

    private func stopSound() {
        sound?.stop()
        sound = nil
        soundIsPlaying = false
    }

    // MARK: - Duration parsing

    private func parseDuration(_ input: String) -> Int? {
        var totalSeconds = 0
        let regex = try! NSRegularExpression(pattern: "(\\d+)([mh]?s?)", options: .caseInsensitive)
        let matches = regex.matches(in: input, range: NSRange(input.startIndex..., in: input))

        for match in matches {
            guard let numRange = Range(match.range(at: 1), in: input),
                  let unitRange = Range(match.range(at: 2), in: input) else {
                continue
            }

            let number = Int(input[numRange]) ?? 0
            let unit = input[unitRange].lowercased()

            if unit.contains("m") && !unit.contains("s") {
                totalSeconds += number * 60
            } else if unit.contains("ms") || (unit.contains("m") && unit.contains("s")) {
                totalSeconds += number * 60
            } else {
                totalSeconds += number
            }
        }

        return totalSeconds > 0 ? totalSeconds : nil
    }

    private func formatDuration(_ seconds: Int) -> String {
        let minutes = seconds / 60
        let secs = seconds % 60
        return minutes > 0 ? "\(minutes)m\(secs)s" : "\(secs)s"
    }
}
```
### Advantages
- I will be able to work in increments to my choosing while having a 30 minute countdown to make sure I stay on course with the project I'm working on. 
- Can effectively replace the horo timer as well.
### Feature Requests
1. Add a secondary timer that is not affected by `Control + Space`