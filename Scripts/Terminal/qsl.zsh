# qsl.zsh (Quick Switcher - Desktop Project Scoped)

qsl() {
    # 1. Check if 'fd' is installed
    if ! (( $+commands[fd] )); then
        echo "Error: 'fd' is not installed." >&2
        echo "Please run: brew install fd" >&2
        return 1
    fi

    # 2. Determine the search boundary
    local desktop_dir="$HOME/Desktop"
    local search_root="$PWD"

    # If inside ~/Desktop/<Folder>/..., find the first directory right below Desktop
    if [[ "$PWD" == "$desktop_dir"/* ]]; then
        local rel_path="${PWD#$desktop_dir/}" # Strip "~/Desktop/" prefix
        local top_folder="${rel_path%%/*}"    # Grab only the topmost folder name
        search_root="$desktop_dir/$top_folder"
    fi

    local target
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

    # 3. Stream paths directly into fzf
    target=$(
        {
            # Filter zoxide history so it only includes paths inside our search root
            if (( $+commands[zoxide] )); then
                zoxide query -l 2>/dev/null | grep "^$search_root"
            fi
            fd --hidden --no-ignore "${exclude_args[@]}" . "$search_root"
        } | awk 'NF && !seen[$0]++' \
          | fzf --height=100% --layout=reverse \
                --scheme=path \
                --ignore-case \
                --tiebreak=index \
                --prompt="Quick Switcher [${search_root:t}]: " 2>/dev/null
    )

    # 4. Handle navigation
    if [[ -n "$target" ]]; then
        if [[ -d "$target" ]]; then
            cd "$target"       # Enter directly if a folder
        else
            cd "${target:h}"   # Enter parent folder if a file
        fi

        # Record visit in Zoxide
        if (( $+commands[zoxide] )); then
            zoxide add "$PWD"
        fi
    fi
}