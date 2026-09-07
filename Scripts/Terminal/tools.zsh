# Description: Display all loaded custom vault tools and their descriptions

tools() {
    # Enable advanced pattern matching strictly inside this function
    setopt localoptions extendedglob

    local dir="/Users/julianventura/Desktop/Knowledge/Scripts/Terminal"
    local file filename check line desc max_len=0
    local -a files names descs types

    # 1. Collect all files and calculate column widths
    for file in "$dir"/*.(sh|zsh)(N); do
        filename="${file:t:r}"
        
        check=$(whence -w "$filename" 2>/dev/null)
        types+=("${check#*: }")
        names+=("$filename")
        
        # Read until we hit the first comment line
        desc=""
        while IFS= read -r line; do
            [[ -z "$line" || "$line" == '#!'* ]] && continue
            if [[ "$line" == '#'* ]]; then
                # Strip '#'
                desc="${line#\#}"
                # Strip leading whitespace
                desc="${desc##[[:space:]]#}"
                # Strip case-insensitive 'Description:' or 'Desc:'
                desc="${desc#(#i)(description|desc):}"
                # Strip remaining whitespace before the actual text
                desc="${desc##[[:space:]]#}"
                break
            fi
            break
        done < "$file"
        
        [[ -z "$desc" ]] && desc="(No description provided)"
        descs+=("$desc")
        
        (( ${#filename} > max_len )) && max_len=${#filename}
    done

    if (( ${#names} == 0 )); then
        echo "No vault scripts found in $dir"
        return 0
    fi

    # 2. Pretty-print the table
    echo "⚡ Loaded Custom Vault Tools:"
    echo "--------------------------------------------------------------------------------"
    for (( i=1; i <= ${#names}; i++ )); do
        if [[ "${types[i]}" == "none" || -z "${types[i]}" ]]; then
            printf "  \e[90m%-${max_len}s  ->  %s [not loaded]\e[0m\n" "${names[i]}" "${descs[i]}"
        else
            printf "  \e[33m%-${max_len}s\e[0m  \e[90m->\e[0m  %s\n" "${names[i]}" "${descs[i]}"
        fi
    done
    echo "--------------------------------------------------------------------------------"
}