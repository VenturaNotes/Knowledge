# obstop.zsh - Live terminal inspection matching Activity Monitor memory footprint (Sorted Highest to Lowest)
obstop() {
    echo "\n📊 \033[1;36mObsidian Process Breakdown (Highest to Lowest RAM):\033[0m"
    echo "══════════════════════════════════════════════════════════════"
    printf "%-8s %-12s %-32s\n" "PID" "REAL RAM" "PROCESS TYPE"
    echo "──────────────────────────────────────────────────────────────"

    # Map Obsidian PIDs and their full command strings
    local -A cmd_map=()
    while read -r pid cmd; do
        [[ -n "$pid" ]] && cmd_map[$pid]="$cmd"
    done < <(ps -ax -o pid,command | grep -i "[O]bsidian")

    if (( ${#cmd_map} == 0 )); then
        echo "Obsidian is not currently running."
        return 0
    fi

    local -a parsed_records=()

    # Read strictly PID and MEM columns from top
    while read -r pid mem; do
        [[ -z "${cmd_map[$pid]}" ]] && continue

        local cmd="${cmd_map[$pid]}"
        local type="Main Electron Process"

        if [[ "$cmd" == *"--type=renderer"* ]]; then
            if [[ "$cmd" == *"app-path="* || "$cmd" == *"preload"* ]]; then
                type="Primary Renderer (Workspace)"
            else
                type="Auxiliary Renderer (Tab/WebView)"
            fi
        elif [[ "$cmd" == *"--type=gpu-process"* ]]; then
            type="GPU / Graphics Engine"
        elif [[ "$cmd" == *"--type=utility"* ]]; then
            type="Audio/Utility Helper"
        fi

        # Convert to raw MB for accurate numerical sorting (handles G, M, and K)
        local mb_num=0
        if [[ "$mem" == *G ]]; then
            local num="${mem%G}"
            local int_part="${num%.*}"
            mb_num=$(( int_part * 1024 ))
            if [[ "$num" == *.* ]]; then
                local dec_part="${num#*.}"
                local d="${dec_part[1]}"
                (( mb_num += (d * 1024) / 10 ))
            fi
        elif [[ "$mem" == *M ]]; then
            local num="${mem%M}"
            local int_part="${num%.*}"
            mb_num=$(( int_part ))
        fi

        # Adjusted Color Thresholds: Yellow at 750MB, Red at 1500MB
        local color="\033[0m"
        if (( mb_num >= 1500 )); then
            color="\033[1;31m" # Red (Critical / >1.5GB)
        elif (( mb_num >= 750 )); then
            color="\033[1;33m" # Yellow (Elevated / >750MB)
        fi

        parsed_records+=("${mb_num}|${pid}|${mem}|${type}|${color}")
    done < <(top -l 1 -stats pid,mem 2>/dev/null)

    # Sort numerically descending by MB (column 1)
    printf "%s\n" "${parsed_records[@]}" | sort -t'|' -k1 -rn | while IFS='|' read -r mb_num pid mem type color; do
        [[ -z "$pid" ]] && continue
        printf "%-8s ${color}%-12s\033[0m %-32s\n" "$pid" "$mem" "$type"
    done

    echo "══════════════════════════════════════════════════════════════\n"
}