# reobs.zsh (Sourced Function to Gracefully Restart Obsidian on macOS with Full-Screen Retention)

reobs() {
    echo "Restarting Obsidian..."

    # Run the restart sequence in a disowned background process
    (
        # 1. Check if Obsidian is currently in Full Screen mode
        local was_fullscreen
        was_fullscreen=$(osascript -e '
            tell application "System Events"
                try
                    tell process "Obsidian"
                        return value of attribute "AXFullScreen" of window 1
                    end tell
                on error
                    return false
                end try
            end tell
        ' 2>/dev/null)

        # 2. Request Obsidian to quit gracefully
        osascript -e 'quit app "Obsidian"' 2>/dev/null

        # 3. Wait for the MAIN Obsidian process to quit (with a 5-second max timeout)
        local count=0
        while pgrep -x "Obsidian" >/dev/null 2>&1 && (( count < 25 )); do
            sleep 0.2
            (( count++ ))
        done

        # Safety fallback: if main process lingers past 5 seconds, force-terminate it
        if pgrep -x "Obsidian" >/dev/null 2>&1; then
            pkill -9 -x "Obsidian" 2>/dev/null
            sleep 0.3
        fi

        # 4. Relaunch Obsidian
        open -a "Obsidian"

        # 5. If it was full-screen before, restore full-screen mode once the window appears
        if [[ "$was_fullscreen" == "true" ]]; then
            osascript -e '
                tell application "System Events"
                    repeat 50 times
                        if exists process "Obsidian" then
                            tell process "Obsidian"
                                if exists window 1 then
                                    set value of attribute "AXFullScreen" of window 1 to true
                                    exit repeat
                                end if
                            end tell
                        end if
                        delay 0.2
                    end repeat
                end tell
            ' 2>/dev/null
        fi
    ) &!
}