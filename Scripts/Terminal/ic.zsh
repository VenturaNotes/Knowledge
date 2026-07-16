# ic.zsh (Sourced Function Version)

ic() {
    # Rule 2: Declare all variables as local to prevent leaking into terminal memory
    local raw_output type count i line limit p
    local -a lines files text_lines

    # Retrieve current clipboard status using native JXA
    raw_output=$(osascript -l JavaScript 2>/dev/null <<'EOF'
function run() {
    ObjC.import("AppKit");
    var pb = $.NSPasteboard.generalPasteboard;

    // 1. Check for native files.
    // FIX: copyFileAppend now writes files via classic AppleScript's
    // `set the clipboard to {POSIX file ...}`, which populates each file as
    // its own pasteboard item under "public.file-url" -- it does NOT populate
    // the legacy NSFilenamesPboardType. Check public.file-url items first,
    // then fall back to the legacy plist for anything else (e.g. older tools)
    // that still only writes that type.
    var files = [];
    var items = pb.pasteboardItems;
    if (items) {
        for (var i = 0; i < items.count; i++) {
            var item = items.objectAtIndex(i);
            var urlString = item.stringForType("public.file-url");
            if (urlString && !urlString.isNil()) {
                var url = $.NSURL.URLWithString(urlString);
                var path = ObjC.unwrap(url.path);
                if (path) files.push(path);
            }
        }
    }
    if (files.length === 0) {
        var plist = pb.propertyListForType("NSFilenamesPboardType");
        // FIX: same nil-wrapper gotcha as copyFileAppend.zsh -- must check
        // .isNil() explicitly, plain truthiness check is not sufficient.
        if (plist && !plist.isNil()) {
            var unwrapped = ObjC.deepUnwrap(plist);
            if (unwrapped) files = unwrapped;
        }
    }

    if (files && files.length > 0) {
        return "__TYPE_FILES__\n" + files.length + "\n" + files.join("\n");
    }

    // 2. Check for text (checking that the ObjC string wrapper is not nil)
    var textVal = pb.stringForType("public.utf8-plain-text");
    if (textVal && !textVal.isNil()) {
        return "__TYPE_TEXT__\n" + ObjC.unwrap(textVal);
    }

    // 3. Check for image
    var types = ObjC.deepUnwrap(pb.types);
    if (types) {
        var isImage = false;
        for (var i = 0; i < types.length; i++) {
            var t = types[i];
            if (t.includes("png") || t.includes("tiff") || t.includes("jpeg") || t.includes("image")) {
                isImage = true;
                break;
            }
        }
        if (isImage) {
            return "__TYPE_IMAGE__";
        }
    }

    return "__TYPE_EMPTY__";
}
EOF
)

    # If osascript failed or returned nothing
    if [[ -z "$raw_output" ]]; then
        echo "Clipboard is empty or could not be read."
        return 0
    fi

    # Read output into an array of lines
    lines=("${(f)raw_output}")
    type="${lines[1]}"

    # FIX: type markers are now namespaced (__TYPE_FILES__ etc.) instead of bare
    # "FILES"/"TEXT"/"IMAGE", so clipboard text that happens to start with one of
    # those bare words on its first line can no longer be misclassified.
    case "$type" in
        __TYPE_FILES__)
            count="${lines[2]}"
            files=("${lines[3,-1]}")
            echo "Clipboard contains $count file(s):"
            for p in "${files[@]}"; do
                echo "  - ${p:t}  (Path: $p)"
            done
            ;;
        __TYPE_TEXT__)
            text_lines=("${lines[2,-1]}")
            echo "Clipboard contains Text (${#text_lines[@]} lines):"

            # Show up to 5 lines of preview to keep the terminal clean
            limit=5
            i=1
            for line in "${text_lines[@]}"; do
                if (( i > limit )); then
                    echo "  [... truncated $(( ${#text_lines[@]} - limit )) additional lines ...]"
                    break
                fi
                echo "  $line"
                (( i++ ))
            done
            ;;
        __TYPE_IMAGE__)
            echo "Clipboard contains Image data."
            ;;
        *)
            echo "Clipboard is empty."
            ;;
    esac
}