# vsync.zsh - Interactive & CLI vault file/folder mirroring

vsync() {
    local config="$HOME/.vault_sync_list"
    touch "$config"

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
        --exclude "venv"
        --exclude ".venv"
    )

    local action="$1"
    [[ -n "$action" ]] && shift

    case "$action" in
        list|"")
            if [[ ! -s "$config" ]]; then
                echo "No active sync pairs."
                return 0
            fi
            echo "\n📦 ACTIVE VAULT SYNC PAIRS:"
            echo "──────────────────────────────────────────────"
            while IFS='|' read -r src dst || [[ -n "$src" ]]; do
                [[ -z "$src" || "$src" == \#* ]] && continue
                local src_exp="${(e)src}"
                local dst_exp="${(e)dst}"
                local type_icon="📄 File"
                [[ -d "$src_exp" ]] && type_icon="📁 Folder"

                echo " $type_icon"
                echo " Source: $src_exp"
                echo " Dest:   $dst_exp"
                echo "──────────────────────────────────────────────"
            done < "$config"
            ;;

        add)
            local src_input="$1"
            local dst_input="$2"

            if [[ -z "$src_input" || -z "$dst_input" ]]; then
                echo "🔍 Select SOURCE in [${PWD:t}] (or nested deeper)..."
                
                src_input=$(
                    (echo "$PWD"; fd --hidden --no-ignore "${exclude_args[@]}" . "$PWD") \
                    | fzf --prompt="1️⃣  Select SOURCE [${PWD:t}]: " --height=60% --layout=reverse
                )
                [[ -z "$src_input" ]] && echo "Cancelled." && return 0

                echo "🔍 Select the DESTINATION folder inside Knowledge..."
                local dst_folder
                dst_folder=$(
                    fd --type d --hidden --no-ignore "${exclude_args[@]}" . "$HOME/Desktop/Knowledge" \
                    | fzf --prompt="2️⃣  Select DESTINATION Folder: " --height=60% --layout=reverse
                )
                [[ -z "$dst_folder" ]] && echo "Cancelled." && return 0

                dst_input="$dst_folder/${src_input:t}"
            fi

            local src_path="${src_input:A}"
            local dst_path="${dst_input:A}"

            if [[ ! -e "$src_path" ]]; then
                echo "Error: Source '$src_path' does not exist." >&2
                return 1
            fi

            # Perform the initial copy immediately
            if [[ -d "$src_path" ]]; then
                mkdir -p "$dst_path"
                rsync -a --delete "$src_path/" "$dst_path/"
            elif [[ -f "$src_path" ]]; then
                mkdir -p "${dst_path:h}"
                cp "$src_path" "$dst_path"
            fi

            if ! grep -Fxq "$src_path|$dst_path" "$config" 2>/dev/null; then
                echo "$src_path|$dst_path" >> "$config"
            fi

            echo "✅ Successfully linked and copied all files/folders:"
            echo "   Source: $src_path"
            echo "   Dest:   $dst_path"
            ;;

        rm)
            if [[ ! -s "$config" ]]; then
                echo "No active sync pairs to remove."
                return 0
            fi

            local selected
            selected=$(grep -v '^#' "$config" | fzf --prompt="Select sync pair to remove: " --height=40% --layout=reverse)

            if [[ -n "$selected" ]]; then
                local tmp="${config}.tmp"
                grep -vF "$selected" "$config" > "$tmp"
                mv "$tmp" "$config"
                echo "🗑️  Removed sync pair: $selected"
            fi
            ;;

        help|--help|-h)
            echo "Usage: vsync [command]"
            echo ""
            echo "Commands:"
            echo "  vsync add                Interactively pick source & dest using fzf"
            echo "  vsync rm                 Interactively remove a mirror using fzf"
            echo "  vsync list               List all active mirrors"
            ;;

        *)
            echo "Unknown command: '$action'. Run 'vsync help' for available commands."
            return 1
            ;;
    esac
}