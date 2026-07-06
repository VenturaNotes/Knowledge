# copyFile.zsh (Sourced Function Version)

copyFile() {
    # Rule 2: Declare all variables as local to prevent leaking into terminal memory
    local filepath target_name clipboard_path original_ext temp_dir escaped_path applescript_code

    # Usage check (Rule 1: We use 'return' instead of 'exit'!)
    if [[ -z "$1" ]]; then
        echo "Usage: copyFile <filename> [new_filename]" >&2
        return 1
    fi

    # Resolve absolute path of the target file using Zsh (:A) modifier
    filepath="${1:A}"

    if [[ ! -f "$filepath" ]]; then
        echo "Error: File not found: $filepath" >&2
        return 1
    fi

    target_name="$2"
    clipboard_path="$filepath"

    # If a new name is specified
    if [[ -n "$target_name" ]]; then
        original_ext="${1:e}"
        # If the target name has no extension, append the original extension
        if [[ -z "${target_name:e}" && -n "$original_ext" ]]; then
            target_name="${target_name}.${original_ext}"
        fi

        # Set up temp folder
        temp_dir="${TMPDIR:-/tmp}/copyfile-temp"
        mkdir -p "$temp_dir"
        clipboard_path="$temp_dir/$target_name"
        
        # Copy the file to the temp directory under the new name
        cp "$filepath" "$clipboard_path"
    fi

    # Escape any double quotes in the path for AppleScript execution
    escaped_path="${clipboard_path//\"/\\\"}"

    # Construct a robust AppleScript with a clear-and-delay sequence to prevent clipboard drops
    applescript_code="
        set the clipboard to \"\"
        delay 0.05
        set theFile to (POSIX file \"$escaped_path\")
        set the clipboard to theFile
        delay 0.05
    "

    # Copy the actual POSIX file object to the macOS clipboard
    if osascript -e "$applescript_code" 2>/dev/null; then
        if [[ -n "$target_name" ]]; then
            echo "Copied '${1:t}' to clipboard as '$target_name' as a file object."
        else
            echo "Copied '${1:t}' to clipboard as a file object."
        fi
    else
        echo "Error: AppleScript failed to copy file to clipboard." >&2
        return 1
    fi
}