# Description: Interactively select files and folders with Tab to recursively copy to clipboard

copyTab() {
    # Rule 2: Declare all variables as local to prevent leaking into terminal memory
    local src_inputs item resolved_item file_count reply
    local -a selected_items files exclude_args

    # Check for fzf dependency
    if ! whence fzf >/dev/null 2>&1; then
        echo "Error: fzf is required for interactive selection." >&2
        return 1
    fi

    # Directories and files to exclude from the picker and recursive search
    exclude_args=(
        --exclude ".git"
        --exclude "node_modules"
        --exclude "Library"
        --exclude "Caches"
        --exclude ".Trash"
        --exclude "Pictures"
        --exclude "Music"
        --exclude "Movies"
        --exclude "fsl"
        --exclude ".cache"
        --exclude ".local"
        --exclude "venv"
        --exclude ".venv"
        --exclude ".DS_Store"
    )

    # 1. Selection Mode: If paths were provided as arguments, use them; otherwise open fzf
    if [[ $# -gt 0 ]]; then
        selected_items=("$@")
    else
        echo "🔍 Select files/folders to copy (Use [Tab] to mark multiple, [Enter] to confirm)..."

        # List files & folders in the current directory using fd
        if whence fd >/dev/null 2>&1; then
            src_inputs=$(
                fd --hidden --no-ignore "${exclude_args[@]}" \
                | fzf --multi \
                      --prompt="📋 [Tab] to Mark, [Enter] to Copy: " \
                      --height=60% --layout=reverse
            )
        else
            # Fallback if fd is not installed
            src_inputs=$(
                find . -mindepth 1 \
                | sed 's|^\./||' \
                | fzf --multi \
                      --prompt="📋 [Tab] to Mark, [Enter] to Copy: " \
                      --height=60% --layout=reverse
            )
        fi

        # If cancelled or empty selection (Rule 1: Use return instead of exit)
        [[ -z "$src_inputs" ]] && echo "Cancelled." && return 0

        # Split newline-delimited selections into an array safely
        selected_items=("${(@f)src_inputs}")
    fi

    echo "⚡ Gathering files..."

    # 2. Recursively gather all regular files
    for item in "${selected_items[@]}"; do
        [[ -z "$item" ]] && continue
        resolved_item="${item:A}"

        if [[ -d "$resolved_item" ]]; then
            if whence fd >/dev/null 2>&1; then
                # Recursively grab regular files while filtering exclusions
                local -a nested_files
                nested_files=("${(@f)$(fd --type f --hidden --no-ignore "${exclude_args[@]}" . "$resolved_item")}")
                for f in "${nested_files[@]}"; do
                    [[ -n "$f" ]] && files+=("${f:A}")
                done
            else
                # Fallback to Zsh recursive globbing
                setopt localoptions extendedglob
                files+=( "${resolved_item}"/**/*(N.) )
            fi
        elif [[ -f "$resolved_item" ]]; then
            files+=("$resolved_item")
        else
            echo "⚠️  Warning: Skipped non-existent path: $item" >&2
        fi
    done

    # Remove duplicates and empty entries
    files=("${(@u)files}")
    files=("${(@)files:#}")
    file_count=${#files[@]}

    if (( file_count == 0 )); then
        echo "Error: No files found to copy." >&2
        return 1
    fi

    # Safe confirmation prompt if copying a very large batch of files
    if (( file_count > 1000 )); then
        echo -n "⚠️  Warning: You are about to copy $file_count files to your clipboard. Continue? (y/N): "
        read -r reply
        if [[ ! "$reply" =~ ^[Yy]$ ]]; then
            echo "Operation aborted."
            return 0
        fi
    fi

    # 3. Write native NSURL file objects to macOS NSPasteboard
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
    
    -- Clear current clipboard contents and write native file objects
    set pb to current application's NSPasteboard's generalPasteboard()
    pb's clearContents()
    pb's writeObjects:fileURLs
    
    -- Delay ensures system pboard daemon registers large sets before process exits
    delay 0.2
end run
EOF
        echo "✅ Successfully copied $file_count file(s) to your clipboard."
    else
        echo "Error: AppleScript failed to copy files to clipboard." >&2
        return 1
    fi
}