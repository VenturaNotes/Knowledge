# obsnap.zsh - Manually capture and log full Obsidian memory diagnostics on demand
obsnap() {
    local log_file="$HOME/Desktop/Knowledge/Private/Obsidian-Memory-Alerts.md"
    mkdir -p "${log_file:h}"

    local -A cmd_map=()
    while read -r pid cmd; do
        [[ -n "$pid" ]] && cmd_map[$pid]="$cmd"
    done < <(ps -ax -o pid,command | grep -i "[O]bsidian")

    if (( ${#cmd_map} == 0 )); then
        echo "Obsidian is not currently running."
        return 1
    fi

    local max_mb=0
    local culprit_pid=""
    local culprit_mem_str=""

    while read -r pid mem; do
        [[ -z "${cmd_map[$pid]}" ]] && continue

        local mb=0
        if [[ "$mem" == *G ]]; then
            local num="${mem%G}"
            local int_part="${num%.*}"
            mb=$(( int_part * 1024 ))
            if [[ "$num" == *.* ]]; then
                local dec_part="${num#*.}"
                local d="${dec_part[1]}"
                (( mb += (d * 1024) / 10 ))
            fi
        elif [[ "$mem" == *M ]]; then
            local num="${mem%M}"
            local int_part="${num%.*}"
            mb=$(( int_part ))
        fi

        if (( mb > max_mb )); then
            max_mb=$mb
            culprit_pid=$pid
            culprit_mem_str="$mem"
        fi
    done < <(top -l 1 -stats pid,mem 2>/dev/null)

    local culprit_type="Main Electron Process"
    if [[ -n "$culprit_pid" ]]; then
        local cmd="${cmd_map[$culprit_pid]}"
        if [[ "$cmd" == *"--type=renderer"* ]]; then
            if [[ "$cmd" == *"app-path="* || "$cmd" == *"preload"* ]]; then
                culprit_type="Primary Renderer (Workspace)"
            else
                culprit_type="Auxiliary Renderer (Tab/WebView)"
            fi
        elif [[ "$cmd" == *"--type=gpu-process"* ]]; then
            culprit_type="GPU / Graphics Engine"
        elif [[ "$cmd" == *"--type=utility"* ]]; then
            culprit_type="Audio/Utility Helper"
        fi
    fi

    local now=$(date "+%Y-%m-%d %H:%M:%S")

    # Write manual snapshot header
    cat << EOF >> "$log_file"

## 📸 [$now] MANUAL SNAPSHOT REQUESTED
- **Culprit Process:** PID $culprit_pid (\`$culprit_type\`)
- **Culprit Usage:** **$culprit_mem_str** (Activity Monitor Match)
- **Status:** In-App Plugin Diagnostics pending...
EOF

    echo "📸 Snapshot logged to \033[1;36mPrivate/Obsidian-Memory-Alerts.md\033[0m (PID $culprit_pid at $culprit_mem_str)"
}