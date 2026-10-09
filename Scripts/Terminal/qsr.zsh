# Description: Quick Switcher Reader to check if files exist in the current directory

qsr() {
    # 1. Dependency checks
    if ! (( $+commands[fd] )); then
        echo "Error: 'fd' is not installed. Run: brew install fd" >&2
        return 1
    fi
    if ! (( $+commands[fzf] )); then
        echo "Error: 'fzf' is not installed. Run: brew install fzf" >&2
        return 1
    fi

    # 2. Scope strictly to the active directory or an optional query/directory
    local search_root="$PWD"
    local initial_query=""

    if [[ -n "$1" ]]; then
        if [[ -d "$1" ]]; then
            search_root="$1"
            initial_query="${2:-}"
        else
            initial_query="$1"
        fi
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

    local prompt_str="Check [./${search_root:t}] (Esc to exit): "

    # 3. Interactive fuzzy search (clean list without preview)
    local target
    target=$(
        fd --type f --hidden --no-ignore "${exclude_args[@]}" . "$search_root" \
        | fzf --height=100% --layout=reverse \
              --ignore-case \
              --exact \
              --delimiter='/' \
              --nth=-1 \
              --query="$initial_query" \
              --prompt="$prompt_str" 2>/dev/null
    )

    # 4. If user exits via Esc / Ctrl-C
    if [[ -z "$target" ]]; then
        if [[ -n "$initial_query" ]]; then
            echo "No file found matching query: '$initial_query'"
        fi
        return 0
    fi

    # 5. Confirm file existence
    if [[ -e "$target" ]]; then
        echo "✓ Found: $target"
    else
        echo "✗ File does not exist: $target"
    fi
}