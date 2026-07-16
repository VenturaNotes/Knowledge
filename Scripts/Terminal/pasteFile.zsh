# pasteFile.zsh

pasteFile() {
    # Declare all variables as local to prevent leaking into terminal memory
    local target_dir applescript_out files file clean_path

    # Default to current directory if no argument is supplied
    target_dir="${1:-.}"

    # Verify target directory is valid
    if [[ ! -d "$target_dir" ]]; then
        echo "Error: Target is not a directory: $target_dir" >&2
        return 1
    fi

    # Retrieve native file system paths from the system clipboard using macOS JXA.
    # We strictly check for actual native file objects (no plain text fallbacks).
    applescript_out=$(osascript -l JavaScript -e '
        function run() {
            ObjC.import("AppKit");
            var pb = $.NSPasteboard.generalPasteboard;
            
            // 1. Check for native Finder files
            var plist = pb.propertyListForType("NSFilenamesPboardType");
            if (plist) {
                var files = ObjC.deepUnwrap(plist);
                if (files && files.length > 0) {
                    return files.join("\n");
                }
            }
            
            // 2. Check for public.file-url
            var fileUrl = pb.stringForType("public.file-url");
            if (fileUrl) {
                var url = $.NSURL.URLWithString(fileUrl);
                if (url && url.path) {
                    return ObjC.unwrap(url.path);
                }
            }
            
            return "";
        }
    ' 2>/dev/null)

    # Check if any file paths were successfully retrieved
    if [[ -z "$applescript_out" ]]; then
        echo "Error: No files found in the clipboard." >&2
        return 1
    fi

    # Split the newline-delimited output safely into a Zsh array
    files=( ${(f)applescript_out} )

    # Copy each file/directory to the target directory
    for file in "${files[@]}"; do
        # Strip any trailing slashes
        clean_path="${file%/}"

        if [[ ! -e "$clean_path" ]]; then
            echo "Error: Source path no longer exists: $clean_path" >&2
            continue
        fi

        # Copy recursively (-R), preserve attributes (-p), run verbosely (-v),
        # and prompt before overwriting (-i).
        cp -Rpiv "$clean_path" "$target_dir/"
    done
}