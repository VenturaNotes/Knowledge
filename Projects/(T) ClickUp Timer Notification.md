---
status: done
priority: normal
dateCreated: 2025-10-30T12:41:05.957-04:00
dateModified: 2025-12-29T15:24:59.239-05:00
tags:
  - task/personal
completedDate: 2025-12-29
---
## Synthesis
- [ChatGPT Conversation](https://chatgpt.com/c/6903ab02-b378-832b-bdef-7500de545d3d)
- [Gemini Conversation](https://aistudio.google.com/prompts/1RCO3m-x1I_qj3Vl__wIDVeCVRg2dF2pp)
### Alternative Solution
- I ended up just creating a program which tells me how much time I have left in the day for a task and what time it will be complete. When it passes a certain threshold, then I get a notification telling me I'm done
### Old Canceled
- I don't need to switch tasks every 30 minutes. Instead, I switch tasks based on
	- Speedrun timer (of reaching 30 count)
	- Habit tracker note-taking
	- 30 minute timer (within speedrun timer? )
		- [[(T) Add Countdown Timer to Speedrun Program]]
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