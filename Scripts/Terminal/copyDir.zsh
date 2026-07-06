# copyDir.zsh (Sourced Function Version)

copyDir() {
    # Rule 2: Declare all variables as local to prevent leaking into terminal memory
    local arg resolved_arg file_count reply
    local -a files

    # Usage check (Rule 1: We use 'return' instead of 'exit'!)
    if [[ -z "$1" ]]; then
        echo "Usage: copyDir <directory_path_or_file> [additional_paths...]" >&2
        return 1
    fi

    # Loop through all arguments provided to the function
    for arg in "$@"; do
        # Resolve absolute path using Zsh (:A) modifier
        resolved_arg="${arg:A}"
        
        if [[ -d "$resolved_arg" ]]; then
            # Recursively find all regular files within the directory
            # (N) enables NULL_GLOB to prevent errors if a subdirectory is empty
            # (.) matches regular files only (ignores folders, symlinks, sockets, etc.)
            files+=( "${resolved_arg}"/**/*(N.) )
        elif [[ -f "$resolved_arg" ]]; then
            # If it's a file, add it directly to the clipboard list
            files+=( "$resolved_arg" )
        else
            echo "Warning: Path not found (skipped): $arg" >&2
        fi
    done

    file_count=${#files[@]}

    if (( file_count == 0 )); then
        echo "Error: No files found to copy." >&2
        return 1
    fi

    # Safe prompt if copying a massive number of files to prevent clipboard lockup
    if (( file_count > 1000 )); then
        echo -n "Warning: You are about to copy $file_count files to your clipboard. Continue? (y/N): "
        read -r reply
        if [[ ! "$reply" =~ ^[Yy]$ ]]; then
            echo "Operation aborted."
            return 0
        fi
    fi

    # Pass the list of files to osascript via STDIN. 
    # The 0.2-second delay at the end prevents the process from exiting before 
    # the pasteboard daemon has fully registered all file objects.
    if osascript - "${files[@]}" <<'EOF' 2>/dev/null; then
use framework "Foundation"
use framework "AppKit"
use scripting additions

on run argv
    -- Initialize an array for NSURL file objects
    set fileURLs to current application's NSMutableArray's array()
    
    -- Convert each absolute POSIX path argument into an NSURL file object
    repeat with aPath in argv
        (fileURLs's addObject:(current application's NSURL's fileURLWithPath:aPath))
    end repeat
    
    -- Clear current clipboard contents and write the native file objects
    set pb to current application's NSPasteboard's generalPasteboard()
    pb's clearContents()
    pb's writeObjects:fileURLs
    
    -- Crucial: Give the system clipboard daemon (pboard) time to finish writing 
    -- the files before this osascript process terminates.
    delay 0.2
end run
EOF
        echo "Successfully copied $file_count file(s) to your clipboard."
    else
        echo "Error: AppleScript failed to copy files to clipboard." >&2
        return 1
    fi
}