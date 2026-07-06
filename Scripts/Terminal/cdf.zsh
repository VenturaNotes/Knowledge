# cdf.zsh (Sourced Function Version for Change Directory to File)

cdf() {
    # Declare variables as local to prevent leaking into active terminal memory
    local target
    
    # 1. Use fzf to select any file or folder from your current directory downwards
    target=$(fzf)
    
    # 2. Navigate based on your selection
    if [[ -n "$target" ]]; then
        if [[ -d "$target" ]]; then
            cd "$target"       # If you selected a folder, enter it directly
        else
            cd "${target:h}"   # If you selected a file, enter its parent folder
        fi
    fi
}
