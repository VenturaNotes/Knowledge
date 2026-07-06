# up.zsh (Sourced Function Version)

up() {
    # Declare variables as local to prevent leaking into active terminal memory
    local current paths target
    
    current="$PWD"
    paths=()
    
    # 1. Walk up the directory tree and collect all parent folders
    while [[ "$current" != "/" ]]; do
        paths+=("$current")
        current="${current:h}" # Native Zsh head modifier (parent folder)
    done
    paths+=("/")
    
    # 2. Feed the parent paths to fzf in a clean, compact layout
    target=$(printf "%s\n" "${paths[@]}" | fzf --height=40% --layout=reverse --prompt="Jump up to: ")
    
    # 3. Change directory to the selected target
    if [[ -n "$target" ]]; then
        cd "$target"
    fi
}
