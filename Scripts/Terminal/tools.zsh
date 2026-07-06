# tools.zsh (Sourced Function)

tools() {
    local dir="/Users/julianventura/Desktop/Knowledge/Scripts/Terminal"
    local file filename check
    
    echo "⚡ Loaded Custom Vault Tools:"
    echo "----------------------------------------"
    for file in "$dir"/*.(sh|zsh)(N); do
        filename="${file:t:r}"
        check=$(whence -w "$filename" 2>/dev/null)
        
        # Nicely print the tool name and how Zsh is running it
        printf "  %-15s -> %s\n" "$filename" "${check#*: }"
    done
    echo "----------------------------------------"
}
