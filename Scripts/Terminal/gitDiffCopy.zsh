# Description: Diff working tree against any commit or HEAD (incl. untracked files) to clipboard or file

gitDiffCopy() {
    # 1. Ensure we are inside a git repository
    if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        echo "❌ Error: Not a git repository." >&2
        return 1
    fi

    local target_commit="${1:-HEAD}"
    local output_file="$2"
    local repo_root
    repo_root=$(git rev-parse --show-toplevel)

    # 2. Check if the specified commit exists locally
    if ! git rev-parse --verify "$target_commit" >/dev/null 2>&1; then
        echo "❌ Error: Commit '$target_commit' not found. Try running 'git fetch origin' first." >&2
        return 1
    fi

    # 3. Temporarily mark untracked files as intent-to-add so git diff includes them
    local temp_added=false
    if git status --porcelain | grep -q '??'; then
        git add -N "$repo_root" >/dev/null 2>&1
        temp_added=true
    fi

    # 4. Generate the unified diff against the target commit
    local diff_output
    diff_output=$(git -C "$repo_root" diff "$target_commit" 2>/dev/null)

    # 5. Clean up the intent-to-add state so your repository is left untouched
    if [[ "$temp_added" == "true" ]]; then
        git -C "$repo_root" reset "$repo_root" >/dev/null 2>&1
    fi

    # 6. Verify we captured a valid diff
    if [[ -z "$diff_output" ]]; then
        echo "idx: Repository has no differences against $target_commit."
        return 0
    fi

    # 7. Output to specified file or pipe to macOS clipboard
    local file_count
    file_count=$(echo "$diff_output" | grep -c '^diff --git')

    if [[ -n "$output_file" ]]; then
        printf '%s\n' "$diff_output" > "$output_file"
        echo "💾 Saved diff of $file_count file(s) against $target_commit to: $output_file"
    else
        printf '%s' "$diff_output" | pbcopy
        echo "📋 Copied diff of $file_count file(s) against $target_commit to clipboard."
    fi
}