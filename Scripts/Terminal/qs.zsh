# qs.zsh (Sourced Function Version for Instant-Streaming Quick Switcher)

qs() {
    # 1. Check if 'fd' is installed
    if ! (( $+commands[fd] )); then
        echo "Error: 'fd' is not installed." >&2
        echo "Please run: brew install fd" >&2
        return 1
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

    # 2. Stream paths directly into fzf
    # - '--no-ignore': Ensures hidden plugin folders (like .obsidian) aren't skipped by .gitignore
    # - '--scheme=path': Forces fzf to prioritize the folder/filename at the end of the path
    target=$(
        {
            if (( $+commands[zoxide] )); then
                zoxide query -l 2>/dev/null
            fi
            fd --hidden --no-ignore "${exclude_args[@]}" . ~
        } | awk 'NF && !seen[$0]++' \
          | fzf --height=60% --layout=reverse \
                --scheme=path \
                --ignore-case \
                --tiebreak=index \
                --prompt="Quick Switcher: " 2>/dev/null
    )

    # 3. Handle navigation
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