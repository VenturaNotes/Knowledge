# Function to copy file objects and append them to the clipboard
copyFileAppend() {
    if [[ $# -eq 0 ]]; then
        echo "Usage: copyFileAppend <file_or_folder1> [file_or_folder2 ...]" >&2
        return 1
    fi

    # Verify all specified files/folders exist
    local item
    for item in "$@"; do
        if [[ ! -e "$item" ]]; then
            echo "Error: File or folder '$item' not found." >&2
            return 1
        fi
    done

    # 1. Read existing file paths from the clipboard
    local raw_output
    raw_output=$(osascript << 'EOF' 2>/dev/null
use framework "AppKit"

set pb to current application's NSPasteboard's generalPasteboard()
set fs to pb's readObjectsForClasses:{current application's |NSURL|} options:(missing value)
if fs is missing value then
    set fs to {}
else
    set fs to fs as list
end if

repeat with f in fs
    set f's contents to POSIX path of f
end repeat

set {oldTID, AppleScript's text item delimiters} to {AppleScript's text item delimiters, linefeed}
set outText to fs as text
set AppleScript's text item delimiters to oldTID
return outText
EOF
)

    local existing_paths=()
    if [[ -n "$raw_output" ]]; then
        existing_paths=(${(f)raw_output})
    fi

    # 2. Combine existing paths with the new paths, keeping unique items
    local -U all_paths
    all_paths=("${existing_paths[@]}")
    for item in "$@"; do
        all_paths+=("${item:A}")
    done

    # 3. Write the combined file objects back to the clipboard
    osascript - "${all_paths[@]}" << 'EOF' >/dev/null 2>&1
use framework "Foundation"
use framework "AppKit"
use scripting additions

on run argv
    set pb to current application's NSPasteboard's generalPasteboard()
    set allURLs to current application's |NSMutableArray|'s array()
    
    repeat with thePath in argv
        set thePathStr to thePath as text
        set theURL to current application's |NSURL|'s fileURLWithPath:thePathStr
        allURLs's addObject:theURL
    end repeat
    
    pb's clearContents()
    pb's writeObjects:allURLs
    return ""
end run
EOF

    if [[ $# -eq 1 ]]; then
        echo "Successfully appended 1 file object to the clipboard."
    else
        echo "Successfully appended $# file objects to the clipboard."
    fi
}