# copyFileAppend.zsh (Sourced Function Version)

copyFileAppend() {
    # Rule 2: Declare all variables as local to prevent leaking into terminal memory
    local existing_files_str=""
    local -a existing_files=()
    local -a new_files=()
    local -Ua combined_files=() # -U keeps elements unique and preserves original order
    local arg=""
    local abs_path=""
    local count=0
    local f=""

    # Retrieve all files currently in the clipboard using native JXA
    existing_files_str=$(osascript -l JavaScript -e '
        ObjC.import("AppKit");
        var pb = $.NSPasteboard.generalPasteboard;
        var fileURLs = pb.readObjectsForClassesOptions([$.NSURL], null);
        if (fileURLs && fileURLs.count > 0) {
            var paths = [];
            for (var i = 0; i < fileURLs.count; i++) {
                paths.push(fileURLs.objectAtIndex(i).path.js);
            }
            paths.join("\n");
        } else {
            "";
        }
    ' 2>/dev/null)

    if [[ -n "$existing_files_str" ]]; then
        existing_files=("${(f)existing_files_str}")
    fi

    # Handle clear flag
    if [[ "$1" == "--clear" || "$1" == "-c" ]]; then
        osascript -l JavaScript -e '
            ObjC.import("AppKit");
            $.NSPasteboard.generalPasteboard.clearContents;
        ' >/dev/null 2>&1
        echo "Clipboard cleared."
        return 0
    fi

    # Inspect current state: If no arguments are passed, show currently copied files
    if [[ $# -eq 0 ]]; then
        if (( ${#existing_files} > 0 )); then
            echo "Current files in clipboard (${#existing_files}):"
            for f in "${existing_files[@]}"; do
                echo "  - ${f:t}"
            done
            return 0
        else
            echo "Usage: copyFileAppend <file1> [file2 ...]" >&2
            echo "       copyFileAppend --clear | -c" >&2
            return 1
        fi
    fi

    # Resolve absolute paths and validate existence (Rule 1: We use 'return' instead of 'exit'!)
    for arg in "$@"; do
        abs_path="${arg:A}"
        if [[ ! -e "$abs_path" ]]; then
            echo "Error: File or directory not found: $arg" >&2
            return 1
        fi
        new_files+=("$abs_path")
    done

    # Merge lists (Zsh -U attribute automatically handles duplicate filtering)
    combined_files=("${existing_files[@]}" "${new_files[@]}")

    # Write the combined files to the pasteboard using native JXA
    if osascript -l JavaScript -e '
        ObjC.import("AppKit");
        function run(argv) {
            var pb = $.NSPasteboard.generalPasteboard;
            pb.clearContents;
            var fileURLs = $.NSMutableArray.alloc.init;
            argv.forEach(function(path) {
                fileURLs.addObject($.NSURL.fileURLWithPath(path));
            });
            pb.writeObjects(fileURLs);
        }
    ' "${combined_files[@]}" >/dev/null 2>&1; then
        count=${#combined_files}
        if (( count == 1 )); then
            echo "Copied 1 file to clipboard:"
        else
            echo "Copied $count files to clipboard:"
        fi
        for f in "${combined_files[@]}"; do
            echo "  - ${f:t}"
        done
    else
        echo "Error: Failed to write files to the clipboard." >&2
        return 1
    fi
}