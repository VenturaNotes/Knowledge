# copyFolder.zsh (Sourced Function Version)

copyFolder() {
    # Rule 2: Declare all variables as local to prevent leaking into terminal memory
    local arg resolved_arg item_count reply
    local -a items

    # Usage check (Rule 1: We use 'return' instead of 'exit'!)
    if [[ -z "$1" ]]; then
        echo "Usage: copyFolder <directory_or_file_path> [additional_paths...]" >&2
        return 1
    fi

    # Loop through all arguments provided to the function
    for arg in "$@"; do
        # Resolve absolute path using Zsh (:A) modifier
        resolved_arg="${arg:A}"
        
        # Check if the path exists (works for both folders and files)
        if [[ -e "$resolved_arg" ]]; then
            items+=( "$resolved_arg" )
        else
            echo "Warning: Path not found (skipped): $arg" >&2
        fi
    done

    item_count=${#items[@]}

    if (( item_count == 0 )); then
        echo "Error: No valid folders or files found to copy." >&2
        return 1
    fi

    # Pass the folder/file paths to osascript via STDIN. 
    # Cocoa's NSPasteboard will write the directory NSURL object directly.
    if osascript - "${items[@]}" <<'EOF' 2>/dev/null; then
use framework "Foundation"
use framework "AppKit"
use scripting additions

on run argv
    -- Initialize an array for NSURL file/folder objects
    set fileURLs to current application's NSMutableArray's array()
    
    -- Convert each absolute POSIX path argument into an NSURL object
    repeat with aPath in argv
        (fileURLs's addObject:(current application's NSURL's fileURLWithPath:aPath))
    end repeat
    
    -- Clear current clipboard contents and write the native folder/file objects
    set pb to current application's NSPasteboard's generalPasteboard()
    pb's clearContents()
    pb's writeObjects:fileURLs
    
    -- Crucial: Give the system clipboard daemon (pboard) time to finish writing 
    -- the items before this osascript process terminates.
    delay 0.2
end run
EOF
        echo "Successfully copied $item_count item(s) (folders/files) to your clipboard."
    else
        echo "Error: AppleScript failed to copy items to clipboard." >&2
        return 1
    fi
}