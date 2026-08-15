# qsp.zsh (Continuous Overwrite Mode - Exact Filename Match Only)

qsp() {
    # 1. Check dependencies
    if ! (( $+commands[fd] )); then
        echo "Error: 'fd' is not installed. Run: brew install fd" >&2
        return 1
    fi
    if ! (( $+commands[pbpaste] )); then
        echo "Error: 'pbpaste' is only available on macOS." >&2
        return 1
    fi

    # 2. Determine search boundary (Desktop scoped)
    local desktop_dir="$HOME/Desktop"
    local search_root="$PWD"

    if [[ "$PWD" == "$desktop_dir"/* ]]; then
        local rel_path="${PWD#$desktop_dir/}"
        local top_folder="${rel_path%%/*}"
        search_root="$desktop_dir/$top_folder"
    fi

    local exclude_args=(
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
        --exclude "site-packages"
        --exclude "venv"
        --exclude ".venv"
    )

    local target
    local last_pasted=""

    # 3. Stay in loop until Esc or Ctrl-C
    while true; do
        # Dynamically show last overwritten file in prompt
        local prompt_str="Overwrite [${search_root:t}] (Esc to exit): "
        if [[ -n "$last_pasted" ]]; then
            prompt_str="[Pasted: ${last_pasted:t}] Search: "
        fi

        target=$(
            fd --type f --hidden --no-ignore "${exclude_args[@]}" . "$search_root" \
            | fzf --height=100% --layout=reverse \
                  --ignore-case \
                  --exact \
                  --delimiter='/' \
                  --nth=-1 \
                  --prompt="$prompt_str" 2>/dev/null
        )

        # If user pressed Esc / Ctrl-C (empty selection), exit the loop
        if [[ -z "$target" ]]; then
            break
        fi

        # Check if clipboard has content before writing
        if [[ -z "$(pbpaste)" ]]; then
            echo "Clipboard is empty. Skipped '${target:t}'."
            sleep 0.6
            continue
        fi

        # Overwrite file with current clipboard content
        pbpaste > "$target"
        last_pasted="$target"
    done
}