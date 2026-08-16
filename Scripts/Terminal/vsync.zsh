# vsync.zsh - Interactive & CLI vault file/folder mirroring (Grouped & Multi-select)

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

            echo "\n📦 ACTIVE VAULT SYNC GROUPS:"
            echo "══════════════════════════════════════════════════════════════"

            local -A groups=()
            local -a group_keys=()

            # Group entries by their destination parent directory
            while IFS='|' read -r src dst || [[ -n "$src" ]]; do
                [[ -z "$src" || "$src" == \#* ]] && continue
                src="${(e)src}"
                dst="${(e)dst}"

                local parent_dir="${dst:h}"
                if (( ! ${group_keys[(Ie)$parent_dir]} )); then
                    group_keys+=("$parent_dir")
                fi
                groups[$parent_dir]+="$src|$dst"$'\n'
            done < "$config"

            # Print each group as a clean tree
            for pdir in "${group_keys[@]}"; do
                local display_pdir="${pdir/#$HOME/~}"
                echo "📂 Target Group: \033[1;36m${pdir:t}\033[0m (\033[90m$display_pdir\033[0m)"

                # Explicitly empty the lines array for every new group
                local -a lines=()
                local -a raw_lines=("${(@f)groups[$pdir]}")
                for l in "${raw_lines[@]}"; do
                    [[ -n "$l" ]] && lines+=("$l")
                done

                local total=${#lines[@]}
                local idx=0

                for line in "${lines[@]}"; do
                    ((idx++))
                    local s="${line%%|*}"
                    local d="${line#*|}"
                    local icon="📄"
                    [[ -d "$s" ]] && icon="📁"

                    local branch="├──"
                    [[ $idx -eq $total ]] && branch="└──"

                    local s_disp="${s/#$HOME/~}"
                    echo "   $branch $icon \033[1m${s:t}\033[0m  \033[90m(from $s_disp)\033[0m"
                done
                echo "──────────────────────────────────────────────────────────────"
            done
            ;;

        add)
            local -a selected_items=()
            local dst_folder=""

            # Manual CLI mode: vsync add <src> <dest>
            if [[ -n "$1" && -n "$2" ]]; then
                selected_items=("$1")
                dst_folder="$2"
            else
                # Interactive Multi-Select Mode
                echo "🔍 Select items to mirror (Use [Tab] to mark multiple, [Enter] to confirm)..."
                local src_inputs
                src_inputs=$(
                    (echo "$PWD"; fd --hidden --no-ignore "${exclude_args[@]}" . "$PWD") \
                    | fzf --multi \
                          --prompt="1️⃣  [Tab] to Mark, [Enter] to Confirm: " \
                          --height=60% --layout=reverse
                )
                [[ -z "$src_inputs" ]] && echo "Cancelled." && return 0

                selected_items=("${(@f)src_inputs}")

                echo "🔍 Select the DESTINATION folder inside Knowledge..."
                dst_folder=$(
                    fd --type d --hidden --no-ignore "${exclude_args[@]}" . "$HOME/Desktop/Knowledge" \
                    | fzf --prompt="2️⃣  Select DESTINATION Folder: " --height=60% --layout=reverse
                )
                [[ -z "$dst_folder" ]] && echo "Cancelled." && return 0
            fi

            echo "\n⚡ Linking and copying selected items..."
            for item in "${selected_items[@]}"; do
                [[ -z "$item" ]] && continue
                local src_path="${item:A}"
                local dst_path="$dst_folder/${item:t}"

                if [[ ! -e "$src_path" ]]; then
                    echo "⚠️  Skipped: '$src_path' does not exist."
                    continue
                fi

                # Copy immediately
                if [[ -d "$src_path" ]]; then
                    mkdir -p "$dst_path"
                    rsync -a --delete "$src_path/" "$dst_path/"
                elif [[ -f "$src_path" ]]; then
                    mkdir -p "${dst_path:h}"
                    cp "$src_path" "$dst_path"
                fi

                # Save to config
                if ! grep -Fxq "$src_path|$dst_path" "$config" 2>/dev/null; then
                    echo "$src_path|$dst_path" >> "$config"
                fi

                local icon="📄"
                [[ -d "$src_path" ]] && icon="📁"
                echo "   $icon ${src_path:t} -> $dst_path"
            done

            echo "✅ All selected items linked and synced successfully!"
            ;;

        rm)
            if [[ ! -s "$config" ]]; then
                echo "No active sync pairs to remove."
                return 0
            fi

            local selected
            selected=$(grep -v '^#' "$config" | fzf --multi --prompt="Select pairs to remove ([Tab] for multiple): " --height=40% --layout=reverse)

            if [[ -n "$selected" ]]; then
                local tmp="${config}.tmp"
                local -a rm_items=("${(@f)selected}")
                cp "$config" "$tmp"
                for rm_item in "${rm_items[@]}"; do
                    grep -vF "$rm_item" "$tmp" > "${tmp}.bak" && mv "${tmp}.bak" "$tmp"
                    echo "🗑️  Removed: $rm_item"
                done
                mv "$tmp" "$config"
            fi
            ;;

        help|--help|-h)
            echo "Usage: vsync [command]"
            echo ""
            echo "Commands:"
            echo "  vsync add                Interactively pick multiple files/folders using [Tab]"
            echo "  vsync add <src> <dest>   Add a single mirror manually"
            echo "  vsync rm                 Interactively remove mirrors using [Tab]"
            echo "  vsync list               List all active mirrors grouped by target project"
            ;;

        *)
            echo "Unknown command: '$action'. Run 'vsync help' for available commands."
            return 1
            ;;
    esac
}