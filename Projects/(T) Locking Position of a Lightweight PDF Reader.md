---
title: (T) Locking Position of a Lightweight PDF Reader
status: done
priority: "2"
dateCreated: 2026-03-21T05:41:16.440-04:00
dateModified: 2026-03-26T10:26:14.681-04:00
reminders:
  - id: rem_1774086072675_m54vhe0zo
    type: relative
    description: ""
    relatedTo: scheduled
    offset: -PT0H
tags:
  - task
  - project
  - personal
completedDate: 2026-03-26
aliases:
  - HammerSpoon
  - Preview
---
## Synthesis

### Solution
- Download HammerSpoon
- In `OpenConfig` for the `.lua` file, you input the `FINAL` script below
- Shortcuts:
	- Locking preview window in-place: `Command + Control + ,`
		- Shortcut built into script
	- Hiding the sidebar in preview: `Command + Control + .`
### FINAL Script
```lua
local savedFrame = nil
local locked = false
local retryTimer = nil

-- Create a window filter specifically for Preview
local previewFilter = hs.window.filter.new("Preview")

-- Set animation duration to 0 globally for instant snapping
hs.window.animationDuration = 0

-- Helper function to safely stop the homing timer
local function stopRetryTimer()
    if retryTimer then
        retryTimer:stop()
        retryTimer = nil
    end
end

-- The function that snaps the window back
local function snapBack(win)
    if not locked or not savedFrame then return end
    
    -- Try to snap it back instantly
    win:setFrame(savedFrame, 0)
    
    -- Wait 0.1 seconds to see if macOS blocked us (e.g., because the sidebar is open)
    hs.timer.doAfter(0.1, function()
        -- Ensure the window still exists before doing anything
        if not win or not win:id() or not win:application() then return end
        
        local f = win:frame()
        if math.abs(f.w - savedFrame.w) > 2 or math.abs(f.h - savedFrame.h) > 2 or
           math.abs(f.x - savedFrame.x) > 2 or math.abs(f.y - savedFrame.y) > 2 then
            
            -- macOS blocked the resize! Start the temporary homing timer.
            if not retryTimer then
                retryTimer = hs.timer.doEvery(0.5, function()
                    
                    -- SAFETY CHECK 1: Did you manually unlock the script?
                    if not locked or not savedFrame then return stopRetryTimer() end
                    
                    -- SAFETY CHECK 2: Did you close the specific PDF window?
                    if not win or not win:id() then return stopRetryTimer() end
                    
                    -- SAFETY CHECK 3: Did you completely quit the Preview application?
                    local app = win:application()
                    if not app then return stopRetryTimer() end
                    
                    -- SAFETY CHECK 4: Did you minimize the window to the dock?
                    if win:isMinimized() then return stopRetryTimer() end
                    
                    -- SAFETY CHECK 5: Is Preview currently in the background? 
                    -- If so, skip this tick (return without stopping) and wait until you come back!
                    if not app:isFrontmost() then return end
                    
                    -- If it passes all safety checks AND is the active app, keep gently pushing
                    win:setFrame(savedFrame, 0)
                    
                    -- Check if it finally succeeded (e.g., because you closed the sidebar)
                    local currentF = win:frame()
                    if currentF and math.abs(currentF.w - savedFrame.w) <= 2 and 
                       math.abs(currentF.h - savedFrame.h) <= 2 then
                        -- It worked! The sidebar must be closed. Stop checking.
                        stopRetryTimer()
                    end
                end)
            end
        else
            -- It successfully snapped perfectly right away; ensure no timers are running
            stopRetryTimer()
        end
    end)
end

-- The Toggle Lock Hotkey (Command + Control + ,)
hs.hotkey.bind({"cmd", "ctrl"}, ",", function()
    local app = hs.application.get("Preview")
    if not app then return hs.alert.show("Preview is not running") end
    
    local win = app:mainWindow()
    if not win then return hs.alert.show("No main Preview window found") end

    locked = not locked
    if locked then
        savedFrame = win:frame()
        hs.alert.show("Preview window locked ✓")
        
        -- Start listening for movement, resizing, and coming back from the dock
        previewFilter:subscribe(hs.window.filter.windowMoved, snapBack)
        previewFilter:subscribe(hs.window.filter.windowResized, snapBack)
        previewFilter:subscribe(hs.window.filter.windowUnminimized, snapBack)
    else
        savedFrame = nil
        stopRetryTimer() -- Stop homing immediately if we unlock the window manually
        hs.alert.show("Preview window unlocked")
        
        -- Stop listening to save resources when unlocked
        previewFilter:unsubscribe(snapBack)
    end
end)
```
- Instructions
	- Pressing `Command + Control + ,` locks the window position and size in-place
	- When searching, the window will snap back in-place (but maybe not properly)
	- The `Preview` application has the shortcut `Command + Control + .` so that I can close the sidebar on my own.
- Features
	- There is a polling event (which deactivates if preview window is not active) when it does not properly snap back into place
	- An extra feature as well is if you delete your query for the application, the polling event ensures to snap back properly. 
	- Should have enough flexibility so that if I want this to work with other applications it will (but for now just need it to work for preview.)
### Attempts
#### Fixes Positioning of Preview Box
```lua
local savedFrame = nil
local locked = false

-- Create a window filter specifically for Preview
-- This variable must remain global or local to the main scope so it isn't garbage collected
local previewFilter = hs.window.filter.new("Preview")

-- Set animation duration to 0 globally for instant snapping
hs.window.animationDuration = 0

-- The function that snaps the window back
local function snapBack(win)
    if not locked or not savedFrame then return end
    
    local f = win:frame()
    if math.abs(f.w - savedFrame.w) > 2 or math.abs(f.h - savedFrame.h) > 2 or
       math.abs(f.x - savedFrame.x) > 2 or math.abs(f.y - savedFrame.y) > 2 then
        win:setFrame(savedFrame, 0)
    end
end

hs.hotkey.bind({"cmd", "ctrl"}, ",", function()
    local app = hs.application.get("Preview")
    if not app then 
        hs.alert.show("Preview is not running")
        return 
    end
    
    local win = app:mainWindow()
    if not win then 
        hs.alert.show("No main Preview window found")
        return 
    end

    locked = not locked
    if locked then
        savedFrame = win:frame()
        hs.alert.show("Preview window locked ✓")
        
        -- Start listening for movement and resizing when locked
        previewFilter:subscribe(hs.window.filter.windowMoved, snapBack)
        previewFilter:subscribe(hs.window.filter.windowResized, snapBack)
    else
        savedFrame = nil
        hs.alert.show("Preview window unlocked")
        
        -- Stop listening to save resources when unlocked
        previewFilter:unsubscribe(snapBack)
    end
end)
```
- Just need to specify with `Command + Shift + L`
- Okay, it appears that the problem appears to not be working when the sidebar is open since it's not possible to shrink the window anymore. Will need to figure out a work-around for that. 
- So maybe when I press `Command + Control + .`, the lua script in the background will reposition itself?
- Problem
	- It doesn't work because the open sidebar prevents more shrinkage
#### Fixes Positioning of Preview Box & Hides Sidebar
```lua
local savedFrame = nil
local locked = false

-- Create a window filter specifically for Preview
local previewFilter = hs.window.filter.new("Preview")

-- Set animation duration to 0 globally for instant snapping
hs.window.animationDuration = 0

-- The function that snaps the window back AND hides the sidebar
local function snapBack(win)
    if not locked or not savedFrame then return end
    
    local app = win:application()
    if app then
        -- Attempt to click "Hide Sidebar" in the menu bar.
        -- If the sidebar is already hidden, this menu item won't exist,
        -- and Hammerspoon will just silently ignore this command.
        app:selectMenuItem({"View", "Hide Sidebar"})
    end
    
    -- Check if the window geometry has changed and snap it back
    local f = win:frame()
    if math.abs(f.w - savedFrame.w) > 2 or math.abs(f.h - savedFrame.h) > 2 or
       math.abs(f.x - savedFrame.x) > 2 or math.abs(f.y - savedFrame.y) > 2 then
        win:setFrame(savedFrame, 0)
    end
end

hs.hotkey.bind({"cmd", "shift"}, "l", function()
    local app = hs.application.get("Preview")
    if not app then 
        hs.alert.show("Preview is not running")
        return 
    end
    
    local win = app:mainWindow()
    if not win then 
        hs.alert.show("No main Preview window found")
        return 
    end

    locked = not locked
    if locked then
        savedFrame = win:frame()
        hs.alert.show("Preview window locked (Sidebar auto-hiding)")
        
        -- Start listening for movement and resizing when locked
        previewFilter:subscribe(hs.window.filter.windowMoved, snapBack)
        previewFilter:subscribe(hs.window.filter.windowResized, snapBack)
    else
        savedFrame = nil
        hs.alert.show("Preview window unlocked")
        
        -- Stop listening to save resources when unlocked
        previewFilter:unsubscribe(snapBack)
    end
end)
```
- Problem
	- When you hide the sidebar after searching a word, jumping to the next word will just return you to the first word found since the sidebar will open up again at the first word

#### Locks Preview Window Position (and fixes Sidebar Issue)
```lua
local savedFrame = nil
local locked = false

-- Create a window filter specifically for Preview
-- This variable must remain global or local to the main scope so it isn't garbage collected
local previewFilter = hs.window.filter.new("Preview")

-- Set animation duration to 0 globally for instant snapping
hs.window.animationDuration = 0

-- The function that snaps the window back
local function snapBack(win)
    if not locked or not savedFrame then return end
    
    local f = win:frame()
    if math.abs(f.w - savedFrame.w) > 2 or math.abs(f.h - savedFrame.h) > 2 or
       math.abs(f.x - savedFrame.x) > 2 or math.abs(f.y - savedFrame.y) > 2 then
        win:setFrame(savedFrame, 0)
    end
end

-- 1. The Toggle Lock Hotkey (Command + Control + ,)
hs.hotkey.bind({"cmd", "ctrl"}, ",", function()
    local app = hs.application.get("Preview")
    if not app then 
        hs.alert.show("Preview is not running")
        return 
    end
    
    local win = app:mainWindow()
    if not win then 
        hs.alert.show("No main Preview window found")
        return 
    end

    locked = not locked
    if locked then
        savedFrame = win:frame()
        hs.alert.show("Preview window locked ✓")
        
        -- Start listening for movement and resizing when locked
        previewFilter:subscribe(hs.window.filter.windowMoved, snapBack)
        previewFilter:subscribe(hs.window.filter.windowResized, snapBack)
    else
        savedFrame = nil
        hs.alert.show("Preview window unlocked")
        
        -- Stop listening to save resources when unlocked
        previewFilter:unsubscribe(snapBack)
    end
end)

-- 2. The "Hide Sidebar & Fix Window" Hotkey (Command + Control + .)
hs.hotkey.bind({"cmd", "ctrl"}, ".", function()
    if not locked or not savedFrame then return end
    
    local app = hs.application.get("Preview")
    if not app then return end
    
    local win = app:mainWindow()
    if not win then return end

    -- Actively click the menu item to hide the sidebar
    app:selectMenuItem({"View", "Hide Sidebar"})
    
    -- Wait 150 milliseconds for the sidebar to disappear, then snap back
    -- (hs.timer.doAfter automatically protects itself from garbage collection)
    hs.timer.doAfter(0.15, function()
        if win then
            win:setFrame(savedFrame, 0)
        end
    end)
end)
```
- Instructions
	- Pressing `Command + Control + ,` locks the window position and size in-place
	- When searching, the window will snap back in-place (but maybe not properly)
	- Pressing `Command + Control + .` closes the side-bar and the preview window will snap back automatically
- Problem
	- It will not snap back into place if you were to delete your query rather than using the second shortcut.
### Conversations
- [Gemini Conversation](https://gemini.google.com/app/e152540e5bb7ef04?is_sa=1&is_sa=1&android-min-version=301356232&ios-min-version=322.0&campaign_id=bkws&utm_source=sem&utm_medium=paid-media&utm_campaign=bkws&pt=9008&mt=8&ct=p-growth-sem-bkws&gclsrc=aw.ds&gad_source=1&gad_campaignid=20108148196&gbraid=0AAAAApk5BhnzQmsgb_8D9C8V80mOuqlHw&gclid=Cj0KCQjw4PPNBhD8ARIsAMo-icyHz_GjeRgy85acFr7L0B1bWRcvgOKWAozsIXsC1Y7MVemXqYh1XqgaAvlhEALw_wcB)
- [Claude](https://claude.ai/chat/a22b487b-a25a-48da-afc9-13b2bec5c005)
- [AI Google Studio](https://aistudio.google.com/prompts/17dDmUlBTJ0GwLux42U5J3j7p1VzRI61F)
	- Got my solution from here 
### Problem
- The preview application window always opens whenever I search something. I don't want this to make learning more difficult.
### Troubleshooting
- Maybe best solution would be to just prevent the windows resizing. That is honestly the most annoying part. 
	- Prevent window resizing. May be able to fix this... (with the dock options)
- Figure out how to prevent sidebar from appearing when searching a term
- Other Ideas
	- Try to use Mac's native dark mode
	- Try to make Zotero run a little faster? So that it doesn't lag that much when searching for something
		- It really is too slow
	- Just keep looking for pdf readers until you find one that works.
- Advice
	- It seems like it's very difficult for apps not to affect the images within the PDF. Best advice would be able to figure out workaround for expanding given thumbnails. 
- Ideas
	- Requirements
		- pdf readers with dark mode that does not affect images
		- Try apps from app store? 
	- <mark style="background: #FF5582A6;">Zotero</mark>
		- Uses 2.52GB of RAM in background (nearly 5x of what preview needs)
	- <mark style="background: #FFB86CA6;">Preview</mark>
		- It actually does a better job with dark mode than Zotero
		- I guess just need to have it open by default?
			- Nope, it's too small of an area to screenshot images properly
	- <mark style="background: #FF5582A6;">Skim application</mark>
		- Bad because the dark mode hurts the eyes
	- <mark style="background: #FF5582A6;">PDF Expert</mark>
		- Bad because modifies image in dark mode
	- <mark style="background: #FF5582A6;">PDFGear</mark>
		- Bad because does not have a proper dark mode. 
			- (night mode is nice but still affects the images)
	- <mark style="background: #FF5582A6;">NightPDF</mark>
		- Bad because the dark mode still affects the images
	- <mark style="background: #FF5582A6;">Textifier</mark>
		- Not free
	- <mark style="background: #FFB86CA6;">Foxit</mark>[^1]
		- Digital signature not trusted
	- <mark style="background: #FF5582A6;">PDF Reader: PDF EDitor, Convert </mark>(App Store)
		- Unable to shrink the size of the window to half my screen
		- At least it used less memory (214MB) for main and total (296 MB)
		- Couldn't find dark appearance but may exist
	- <mark style="background: #FF5582A6;">PDF Reader X - Edit Adobe PDF</mark> (App Store)
		- A little laggy (can't use links within PDF to jump around document)
		- Dark mode makes images dark as well
		- When searching, seems the keywords are not indexed initially
		- Decent Memory at least (289.7MB)
	- <mark style="background: #FF5582A6;">Adobe Acrobat Reader</mark>
		- Just too heavy of an application
		- Made the icons at the bottom of my screen disappear. 
- Create a script that jumps to the find for me
	- Or what if I create a script which closes the sidebar automatically for me and readjusts the width? Would that be possible too? Maybe but seems too many steps. 
- Create your own PDF viewer
	- Don't do this. Creating a dark-image inverter is really difficulty. There is a massive thread of complaints on developer forums for Zotero on how they have yet to create a decent dark appearance mode (although Zotero 8 may have fixed that.)
#### Desktop & Dock Settings
- Drag windows to left or right edge of screen to tile
	- Deactivating this didn't seem to do anything.
## References

[^1]: https://www.foxit.com/downloads/pdf-reader-thanks/?product=Foxit-Reader&platform=Mac-OS-X&version=2025.3.0.69570&package_type=pkg&language=ML&formId=download-reader&operating_type=
