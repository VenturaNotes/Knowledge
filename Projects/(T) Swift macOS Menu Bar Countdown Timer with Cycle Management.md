---
status: done
priority: "0"
dateCreated: 2025-11-17T00:18:30.369-05:00
dateModified: 2026-04-13T02:23:46.590-04:00
tags:
  - task
  - personal
completedDate: 2026-04-13
---
## Synthesis
- [Claude Conversation](https://claude.ai/chat/88c9ebda-fbf3-4acf-a6f4-2571915c7730)
### Problems
- Gemini does not seem to be able to produce functional Claude code
	- Might need to lint it to prevent extra whitespace
#### No Build on Initial Download from Google Drive
- Go to `CommandRcounter/CommandRCounter/CommandRCounter.entitlements.xml` and remove the `.xml` from this. 
### Old Main Code
- Cycles Through Labels (Except 0 -> 1) 
- Added `Control + Shift + Space` to go back one
- Added Index to `Manage Cycle` so that I can keep track of how much I study
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
## New Main Code
- Changes
	- New Window centered and fixed (and always in front)
	- Able to have different times for the label rotations
	- Merged the Countdown timer (so within Manage Cycle)
	- Tells you how much time is left for given task when pressing `Control + Space`
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
    private let cycleDurationsDefaultsKey = "CycleDurations"
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

        let container = NSView(frame: NSRect(x: 0, y: 0, width: 360, height: 84))

        let items = cycleItems
        let durations = cycleDurations
        let currentValue = items.enumerated().map { i, label -> String in
            let dur = i < durations.count ? durations[i] : 0
            return dur > 0 ? "\(label):\(formatDuration(dur))" : label
        }.joined(separator: ", ")

        let labelsField = NSTextField(frame: NSRect(x: 0, y: 60, width: 360, height: 24))
        labelsField.stringValue = currentValue
        labelsField.placeholderString = "Admin:10m, Learning:15m, Building"

        let indexLabel = NSTextField(labelWithString: "Start at index (0-based):")
        indexLabel.frame = NSRect(x: 0, y: 36, width: 180, height: 17)
        let indexField = NSTextField(frame: NSRect(x: 185, y: 34, width: 60, height: 22))
        indexField.stringValue = "\(cycleIndex)"

        let globalDurLabel = NSTextField(labelWithString: "Global default duration:")
        globalDurLabel.frame = NSRect(x: 0, y: 10, width: 180, height: 17)
        let globalDurField = NSTextField(frame: NSRect(x: 185, y: 8, width: 80, height: 22))
        globalDurField.stringValue = formatDuration(countdownDuration)
        globalDurField.placeholderString = "e.g. 10m"

        container.addSubview(labelsField)
        container.addSubview(indexLabel)
        container.addSubview(indexField)
        container.addSubview(globalDurLabel)
        container.addSubview(globalDurField)
        alert.accessoryView = container

        presentAlert(alert, firstResponder: labelsField) { [weak self] response in
            guard let self = self, response == .alertFirstButtonReturn else { return }

            let globalDurInput = globalDurField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)
            if let newSeconds = self.parseDuration(globalDurInput), newSeconds > 0 {
                self.countdownDuration = newSeconds
                UserDefaults.standard.set(newSeconds, forKey: self.countdownDefaultsKey)
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
                    self.timeLeft = self.currentCycleDuration
                case .stacking:
                    if self.timeLeft == 0 {
                        self.timeLeft = self.currentCycleDuration
                    } else {
                        self.timeLeft += self.currentCycleDuration
                    }
                    if self.timeLeft >= self.timeNotificationThreshold {
                        self.sendTimeNotification()
                    }
                }
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