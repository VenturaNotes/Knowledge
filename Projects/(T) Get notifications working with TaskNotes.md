---
status: done
scheduled: 2025-12-27
tags:
  - task
completedDate: 2025-12-28
googleCalendarEventId: d0mvk2m98pm0cssnj220mpceo0
---
## Synthesis
- [Gemini](https://aistudio.google.com/prompts/14Q80rzmT0g0s7MUjdWfRwkoybFeQzTtM)
### Solution
- In TaskNotes
    - Features → Enable Notifications and change notification type to “System Notifications”
    - Task Properties → Reminder → 
        - Leave description Title blank so title will be shown in notification
        - Choose relative (before/after task dates)
        - 0 offset
        - Unit hours
        - Direction before
        - Related to schedule date
### Testing
- Reminders block?
	- Tried `{{title}}`. It didn't seem to work
	- Try `{title}`
	- Try to leave description field empty
	- If you leave it empty, you get
		- `Title of document` was scheduled now ago
	- `${title}` doesn't work either
## Source [^1]
- 
## References

[^1]: 
