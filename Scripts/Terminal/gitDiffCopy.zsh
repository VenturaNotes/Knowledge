# gitDiffCopy.zsh
# Sourced Function Version for Obsidian Terminal and native zsh shells.
# Captures all changes (staged, unstaged, and untracked file contents) and copies them to the clipboard.

gitDiffCopy() {
    # 1. Ensure we are inside a git repository
    if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        echo "❌ Error: Not a git repository." >&2
        return 1
    fi

    # Find the repository root
    local repo_root
    repo_root=$(git rev-parse --show-toplevel)

    # 2. Check if there are actually any modifications, additions, or deletions
    if [[ -z "$(git status --porcelain)" ]]; then
        echo "idx: Repository is clean. No changes to copy."
        return 0
    fi

    local diff_output temp_added=false

    # 3. Temporarily stage all changes across the repo so git diff HEAD reads all new untracked files
    if git status --porcelain | grep -q '??'; then
        git add -A "$repo_root" >/dev/null 2>&1
        temp_added=true
    fi

    # 4. Extract the complete unified diff against HEAD
    diff_output=$(git diff HEAD 2>/dev/null)

    # 5. Instantly revert staging index to keep staging environment completely untouched
    if [[ "$temp_added" == "true" ]]; then
        git reset "$repo_root" >/dev/null 2>&1
    fi

    # 6. Verify we captured a valid diff
    if [[ -z "$diff_output" ]]; then
        echo "⚠️ Warning: Could not generate a diff payload." >&2
        return 1
    fi

    # 7. Pipe directly to macOS clipboard using printf (prevents Zsh echo backslash truncation)
    printf '%s' "$diff_output" | pbcopy

    # 8. Report the success stats
    local file_count
    file_count=$(echo "$diff_output" | grep -c '^diff --git')
    echo "📋 Ready! Copied full diff of $file_count file(s) (including new additions) to clipboard."
}