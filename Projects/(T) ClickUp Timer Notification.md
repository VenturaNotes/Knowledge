---
status: done
priority: "0"
dateCreated: 2025-10-30T12:41:05.957-04:00
dateModified: 2025-12-29T15:24:59.239-05:00
tags:
  - task
  - personal
completedDate: 2025-12-29
---
## Synthesis
- [ChatGPT Conversation](https://chatgpt.com/c/6903ab02-b378-832b-bdef-7500de545d3d)
- [Gemini Conversation](https://aistudio.google.com/prompts/1RCO3m-x1I_qj3Vl__wIDVeCVRg2dF2pp)
### Alternative Solution
- I ended up just creating a program which tells me how much time I have left in the day for a task and what time it will be complete. When it passes a certain threshold, then I get a notification telling me I'm done
#### Code
##### ClickUpManager
```swift
import Foundation
import UserNotifications

// MARK: - CONFIGURATION
let CLICKUP_API_TOKEN = "YOUR_API_TOKEN"
let TEAM_ID = "YOUR_TEAM_ID"
let MAX_NAME_LENGTH = 15 // ✂️ Characters to show before cutting off with "..."

class ClickUpManager {
    var onUpdate: ((String) -> Void)?
    var notifiedTaskIds: Set<String> = []
    
    init() {
        startPolling()
    }
    
    func startPolling() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound]) { _, _ in }
        
        Task {
            print("🚀 App Started. Loop beginning...")
            while true {
                await updateLoop()
                try? await Task.sleep(nanoseconds: 15 * 1_000_000_000)
            }
        }
    }
    
    func updateLoop() async {
        // 1. Get Current Timer
        guard let currentTimer = await fetchCurrentTimer() else {
            notifyUI("Paused")
            return
        }
        
        // 2. Get Task Details
        guard let taskDetails = await fetchTaskDetails(taskId: currentTimer.task.id) else {
            notifyUI("Error")
            return
        }
        
        // 3. Logic
        // Prepare the name (Truncated)
        let displayName = truncate(taskDetails.name, length: MAX_NAME_LENGTH)
        
        guard let estimateMs = taskDetails.time_estimate else {
            notifyUI("\(displayName): No Est")
            return
        }
        
        let startMs = Double(currentTimer.start) ?? 0
        let nowMs = Date().timeIntervalSince1970 * 1000
        let currentSessionMs = nowMs - startMs
        let totalTrackedMs = (Double(taskDetails.time_spent_val ?? 0)) + currentSessionMs
        let remainingMs = Double(estimateMs) - totalTrackedMs
        
        // 4. Update UI
        if remainingMs <= 0 {
            let overByMs = abs(remainingMs)
            // Example: "Studying... | Over: +5m"
            let text = "\(displayName) | Over: +\(formatDuration(overByMs / 1000))"
            notifyUI(text)
            
            if !notifiedTaskIds.contains(currentTimer.task.id) {
                sendNotification(title: "Time Limit Reached!", body: "You exceeded the estimate for \(taskDetails.name)")
                notifiedTaskIds.insert(currentTimer.task.id)
            }
        } else {
            let doneDate = Date().addingTimeInterval(remainingMs / 1000)
            let timeFormatter = DateFormatter()
            timeFormatter.dateFormat = "h:mm a"
            
            // Example: "Studying... | 1h 20m | 5:30 PM"
            let text = "\(displayName) | \(formatDuration(remainingMs / 1000)) | \(timeFormatter.string(from: doneDate))"
            notifyUI(text)
            
            if notifiedTaskIds.contains(currentTimer.task.id) {
                notifiedTaskIds.remove(currentTimer.task.id)
            }
        }
    }
    
    private func notifyUI(_ text: String) {
        DispatchQueue.main.async {
            self.onUpdate?(text)
        }
    }
    
    // MARK: - API CALLS
    private func fetchCurrentTimer() async -> CurrentEntryData? {
        let urlStr = "https://api.clickup.com/api/v2/team/\(TEAM_ID)/time_entries/current"
        return await fetchGeneric(urlStr: urlStr, type: CurrentEntryResponse.self)?.data
    }
    
    private func fetchTaskDetails(taskId: String) async -> TaskDetails? {
        let urlStr = "https://api.clickup.com/api/v2/task/\(taskId)"
        return await fetchGeneric(urlStr: urlStr, type: TaskDetails.self)
    }
    
    private func fetchGeneric<T: Decodable>(urlStr: String, type: T.Type) async -> T? {
        guard let url = URL(string: urlStr) else { return nil }
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue(CLICKUP_API_TOKEN, forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode != 200 {
                return nil
            }
            return try JSONDecoder().decode(T.self, from: data)
        } catch {
            return nil
        }
    }
    
    // MARK: - HELPERS
    
    // ✂️ New Helper to cut long names short
    private func truncate(_ str: String, length: Int) -> String {
        if str.count <= length { return str }
        return str.prefix(length) + "..."
    }
    
    private func sendNotification(title: String, body: String) {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = .default
        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: nil)
        UNUserNotificationCenter.current().add(request)
    }
    
    private func formatDuration(_ totalSeconds: Double) -> String {
        let hours = Int(totalSeconds) / 3600
        let minutes = (Int(totalSeconds) % 3600) / 60
        return String(format: "%dh %02dm", hours, minutes)
    }
}

// MARK: - MODELS
struct CurrentEntryResponse: Codable { let data: CurrentEntryData? }
struct CurrentEntryData: Codable { let start: String; let task: TaskMinimal }
struct TaskMinimal: Codable { let id: String }

struct TaskDetails: Decodable {
    let name: String
    let time_estimate: Int?
    let time_spent_val: Int?
    
    enum CodingKeys: String, CodingKey { case name, time_estimate, time_spent }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        name = try container.decode(String.self, forKey: .name)
        time_estimate = try? container.decode(Int.self, forKey: .time_estimate)
        
        if let intVal = try? container.decode(Int.self, forKey: .time_spent) {
            time_spent_val = intVal
        } else if let strVal = try? container.decode(String.self, forKey: .time_spent) {
            time_spent_val = Int(strVal)
        } else {
            time_spent_val = 0
        }
    }
}

```
##### ClickUpTimerApp
```swift
import SwiftUI

@main
struct ClickUpTimerApp: App {
    // This connects the SwiftUI App lifecycle to our AppKit Delegate
    @NSApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    
    var body: some Scene {
        // We leave this empty because we don't want a window!
        Settings { EmptyView() }
    }
}

// This is the bridge that starts your MenuBarController
class AppDelegate: NSObject, NSApplicationDelegate {
    var menuBarController: MenuBarController?

    func applicationDidFinishLaunching(_ aNotification: Notification) {
        // Create the controller which puts the icon in the menu bar
        menuBarController = MenuBarController()
    }
}

```
##### MenuBarController
```swift
import Cocoa

class MenuBarController {
    private var statusBarItem: NSStatusItem!
    private var manager: ClickUpManager!
    
    init() {
        // 1. Create the Menu Bar Item
        statusBarItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        
        // 2. Set initial Loading text
        if let button = statusBarItem.button {
            button.title = "Loading..."
            button.image = NSImage(systemSymbolName: "timer", accessibilityDescription: "Timer")
        }
        
        // 3. Create the Dropdown Menu
        statusBarItem.menu = createMenu()
        
        // 4. Initialize the Logic Manager
        manager = ClickUpManager()
        
        // 5. Link the Manager to the Menu Bar
        // This closure runs every time the API fetches new data
        manager.onUpdate = { [weak self] newText in
            self?.statusBarItem.button?.title = newText
        }
    }
    
    private func createMenu() -> NSMenu {
        let menu = NSMenu()
        
        let refreshItem = NSMenuItem(title: "Refresh Now", action: #selector(forceRefresh), keyEquivalent: "r")
        refreshItem.target = self
        menu.addItem(refreshItem)
        
        menu.addItem(NSMenuItem.separator())
        
        let quitItem = NSMenuItem(title: "Quit", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        quitItem.target = NSApp
        menu.addItem(quitItem)
        
        return menu
    }
    
    @objc private func forceRefresh() {
        statusBarItem.button?.title = "Refreshing..."
        Task {
            await manager.updateLoop()
        }
    }
}
```
### Idea
- The idea behind this program is to get a notification after every hour passes in ClickUp so I know when to switch tasks
	- The code will get the sum + currently running task. Save it. And it will only update if the hour changes so it will compare every minute which seems fair (so that requests aren't aren't spammed every second)
		- 100 requests per minute per token 
- Only makes me need one timer while working
- Create time solution that gives me notification when crossing 1hr or something.
- How can I setup a timer so that when an hour passes, I get alerted so I know I need to move onto the next thing without setting up 2 timers? 
### Potential Solutions
- (1) I could retrieve ClickUp's time every 30 seconds and then have a local countdown timer but then it resyncs every 30 seconds to make sure the timer is still running. Otherwise, just stop the timer.
- (2) I could also create a webhook which notifies me when the timer has stopped which in turn lets my program know to stop running I think? So I only need to make an API request when this change occurs within ClickUp
### Features
- (1) Must give me a notification pop-up when the "hour" number changes (which it checks every 5 seconds?)
	- Do I want it show me time left or time until it's done?
- (2) The program should still be able to run even if the timer isn't running. So I don't have to reset the timer every time 
	- I would say to just have a built-in timer but then I wouldn't know if there is any time left
	- I mean, I think I could update it every second, but the limit is 100 requests per minute per token. 
## Source [^1]
- You can make 100 requests per minute per token
	- #comment Token in this context is an authentication credential (like an API key). So you can make up to 100 requests within a 60-second window. It is only about the API calls you make. This means it has nothing to do with the amount of data you're retrieving. This is different from an LLM/NLP Context where a "token" is simply a unit of text.
## Source[^2]
- Webhooks allow you to subscribe to events in your ClickUp Workspace
	- #comment This source is a detailed description of webhooks in ClickUp
## References

[^1]: https://developer.clickup.com/docs/rate-limits
[^2]: https://developer.clickup.com/docs/webhooks