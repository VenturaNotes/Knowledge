# Description: Generate a directory scaffold and copy to clipboard (-d for folders only)

scaffold() {
    local dirs_only=0
    local target="."
    local -a extra_args

    # Parse arguments (-d for directories only, or a custom path)
    for arg in "$@"; do
        if [[ "$arg" == "-d" || "$arg" == "--dirs" ]]; then
            dirs_only=1
        elif [[ ! "$arg" =~ ^- && -e "$arg" ]]; then
            target="$arg"
        else
            extra_args+=("$arg")
        fi
    done

    local output

    # Option 1: Use 'tree' if installed
    if command -v tree >/dev/null 2>&1; then
        local -a tree_flags=(-a -I '.git|node_modules|.DS_Store|__pycache__|.venv')
        (( dirs_only )) && tree_flags+=("-d")
        output=$(command tree "${tree_flags[@]}" "${extra_args[@]}" "$target")

    # Option 2: Python fallback
    elif command -v python3 >/dev/null 2>&1; then
        output=$(python3 -c "
import os, sys

target = sys.argv[1]
dirs_only = sys.argv[2] == '1'
ignore = {'.git', 'node_modules', '.DS_Store', '__pycache__', '.venv'}

def print_tree(dir_path, prefix=''):
    try:
        raw_entries = os.listdir(dir_path)
    except PermissionError:
        return

    entries = []
    for e in raw_entries:
        if e in ignore:
            continue
        full_path = os.path.join(dir_path, e)
        if dirs_only and not os.path.isdir(full_path):
            continue
        entries.append(e)

    entries.sort()

    for i, entry in enumerate(entries):
        is_last = (i == len(entries) - 1)
        connector = '└── ' if is_last else '├── '
        print(f'{prefix}{connector}{entry}')
        full_path = os.path.join(dir_path, entry)
        if os.path.isdir(full_path):
            extension = '    ' if is_last else '│   '
            print_tree(full_path, prefix + extension)

print(target)
print_tree(target)
" "$target" "$dirs_only")
    fi

    if [[ -z "$output" ]]; then
        echo "No structure generated." >&2
        return 1
    fi

    print -r -- "$output" | pbcopy
    print -r -- "$output"
    echo ""
    printf "\e[32m✔ Scaffold copied to clipboard!\e[0m\n"
}