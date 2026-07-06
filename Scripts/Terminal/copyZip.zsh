# copyZip.zsh (Sourced Function Version)

copyZip() {
    # Rule 2: Declare all variables as local to prevent leaking into terminal memory
    local target_path base_name parent_dir zip_name zip_path tracking_file last_zip applescript_code escaped_path

    # Usage check (Rule 1: We use 'return' instead of 'exit'!)
    if [[ -z "$1" ]]; then
        echo "Usage: copyZip <filename_or_directory>" >&2
        return 1
    fi

    # Resolve absolute path of the target file or folder using Zsh (:A) modifier
    target_path="${1:A}"

    if [[ ! -e "$target_path" ]]; then
        echo "Error: File or folder not found: $target_path" >&2
        return 1
    fi

    base_name="${target_path:t}"
    parent_dir="${target_path:h}"
    zip_name="${base_name}.zip"
    zip_path="${TMPDIR:-/tmp}/$zip_name"
    tracking_file="${TMPDIR:-/tmp}/terminal_last_zip_temp.txt"

    # 1. Clean up any zip file left over from the previous execution
    if [[ -f "$tracking_file" ]]; then
        last_zip=$(cat "$tracking_file")
        if [[ -n "$last_zip" && -f "$last_zip" ]]; then
            rm -f "$last_zip"
        fi
    fi

    # 2. Record the new zip file path in the tracking file for future cleanups
    echo "$zip_path" > "$tracking_file"

    # Remove the target zip if it already exists to ensure a fresh archive
    rm -f "$zip_path"

    # 3. Create the zip archive relative to the parent directory using a subshell
    # (The subshell prevents your active terminal directory from changing)
    (
        cd "$parent_dir" || exit 1
        zip -rq "$zip_path" "$base_name"
    )

    # Check if the zip creation was successful
    if [[ ! -f "$zip_path" ]]; then
        echo "Error: Failed to create zip archive." >&2
        return 1
    fi

    # 4. Escape any double quotes in the path for AppleScript execution
    escaped_path="${zip_path//\"/\\\"}"

    # 5. Construct a robust AppleScript with a clear-and-delay sequence to prevent drops
    applescript_code="
        set the clipboard to \"\"
        delay 0.1
        set theFile to (POSIX file \"$escaped_path\")
        set the clipboard to theFile
        delay 0.1
    "

    # Copy the actual POSIX file object to the macOS clipboard
    if osascript -e "$applescript_code" 2>/dev/null; then
        echo "Zipped '${base_name}' and copied '${zip_name}' to clipboard."
    else
        echo "Error: AppleScript failed to copy zip file to clipboard." >&2
        return 1
    fi
}