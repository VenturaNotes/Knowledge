---
status: done
priority: "2"
dateCreated: 2026-01-24T02:46:04.068-05:00
dateModified: 2026-01-25T09:02:16.977-05:00
reminders:
  - id: rem_1769240752962_66t68tgf5
    type: relative
    description: ""
    relatedTo: scheduled
    offset: -PT0H
tags:
  - task
completedDate: 2026-01-25
---
## Synthesis
### Solution
```python
#!/usr/bin/env python3

# @raycast.schemaVersion 1
# @raycast.title 🎰 Task Gacha: Reliable
# @raycast.mode silent
# @raycast.packageName Productivity

import subprocess
import random
import re
import time
import sys

def run_applescript(script):
    process = subprocess.Popen(['osascript', '-e', script], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    out, err = process.communicate()
    return out.strip()

# 1. Grab content with a Safety Check
# We clear the clipboard first, then wait until it's NOT empty to ensure we got the fresh note data.
grab_script = '''
set the clipboard to ""
tell application "System Events"
    -- Ensure window is active
    keystroke "a" using {command down}
    delay 0.1
    keystroke "c" using {command down}
    
    -- Safety: Wait up to 0.5s for clipboard to populate
    set timeoutCounter to 0
    repeat while (the clipboard) is "" and timeoutCounter < 10
        delay 0.05
        set timeoutCounter to timeoutCounter + 1
    end repeat

    -- Deselect to clear blue highlight
    key code 123 
end tell
get the clipboard
'''

content = run_applescript(grab_script)

if not content or content.strip() == "":
    print("❌ Error: Clipboard empty. Is the note focused?")
    sys.exit()

# 2. Advanced Filter for "Real" Tasks
# We split by line and filter for items that have actual content
all_lines = content.split('\n')
valid_tasks = []

for line in all_lines:
    original = line.strip()
    
    # 1. Check if it's a list item (starts with -)
    if not original.startswith("-"):
        continue
    
    # 2. Check if it's already completed
    if "[x]" in original.lower():
        continue
        
    # 3. Clean the line (remove "- [ ]" etc.) to see if any TEXT remains
    clean_text = re.sub(r'^(\s*-\s?(\[ \])?\s?)', '', original).strip()
    
    # 4. If clean_text is empty, it was just a blank bullet point. Skip it.
    if clean_text:
        valid_tasks.append({
            "full_line": original,
            "search_term": clean_text
        })

if not valid_tasks:
    print("❌ No incomplete tasks with text found.")
    sys.exit()

# 3. Pick random task
selected_item = random.choice(valid_tasks)
search_term = selected_item["search_term"]

# 4. Trigger Search & Paste
jump_script = f'''
set the clipboard to "{search_term}"
tell application "System Events"
    -- Open Raycast Note search bar
    keystroke "f" using {{command down}}
    delay 0.1
    
    -- Clear and Paste
    keystroke "a" using {{command down}}
    keystroke (ASCII character 8)
    delay 0.05
    keystroke "v" using {{command down}}
    delay 0.1
    
    -- Force a jump (Raycast Notes often needs an Enter to scroll)
    keystroke return
end tell
'''

run_applescript(jump_script)
print(f"🎰 Gacha: {search_term}")
```
- Description
	- This will highlight the active Raycast floating note, copy it, find a bullet point or checkbox to be copied, paste it into the `command + f` of the floating note, and then I manually look for the term within the note
- For my other scripts, I'v created one for `RandomProgressNote` which should be now `RandomAdminNote` and `RandomStudyNote` to rotate between this work.
### Ideas
- Use "Command + Option + R" for the randomization of a task!
#### Use a Raycast Extension
- <mark style="background: #FFB86CA6;">Quick Notes</mark>
	- Description
		- You can write down notes within a file (similar to floating Raycast notes), but the file itself will be saved into Obsidian
	- Pros
	- Cons
		- I don’t like when typing, entering a new line does not bring down the bullet point with me. Adds more overhead.
#### Temporary Solutions
- Copy the note into an obsidian file and then using a QuickAdd script to find a random bullet or checkbox to highlight which is the one you will do
- Could write a script that selects all of the Raycast file, then it finds a bullet or checkbox that needs to be done. Copies it to my clipboard. Then it lets me know that it was copied. Then I just copy it into the search function and use the arrow to go to that section to complete.
	- It does not have the universal forward and backward arrow shortcuts of `Command + G` for forwards and `Command + Shift + G` for backwards
## Source [^1]
- 
## References

[^1]: 