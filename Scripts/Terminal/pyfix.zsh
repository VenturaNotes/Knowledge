# Description: Execute Python code currently in clipboard safely via a temp file

pyfix() {
    # 1. Validate that the clipboard actually contains text
    local clip
    clip="$(pbpaste)"
    if [[ -z "${clip//[[:space:]]/}" ]]; then
        print -P "%F{red}✖ Error: Clipboard is empty.%f" >&2
        return 1
    fi

    local tmp_file="/tmp/pyfix_last.py"

    # 2. Write raw clipboard to /tmp and strip outer markdown fences (```python / ```) if present
    pbpaste | python3 -c '
import sys, re

tmp_path = sys.argv[1]
raw = sys.stdin.read()
lines = raw.strip().splitlines()

# Strip opening code fence if copied with markdown
if lines and re.match(r"^```(?:python|py)?$", lines[0].strip()):
    lines = lines[1:]

# Strip closing code fence if copied with markdown
if lines and re.match(r"^```$", lines[-1].strip()):
    lines = lines[:-1]

cleaned = "\n".join(lines) + "\n"

with open(tmp_path, "w", encoding="utf-8") as f:
    f.write(cleaned)
' "$tmp_file"

    if (( $? != 0 )); then
        print -P "%F{red}✖ Error: Failed to write clipboard content to temporary file.%f" >&2
        return 1
    fi

    # 3. Execute the script and forward any arguments ($@)
    print -P "%F{cyan}⚡ Executing clipboard with python3...%f" >&2
    python3 "$tmp_file" "$@"
    local exit_code=$?

    # 4. If execution failed, mention where the script is kept for review
    if (( exit_code != 0 )); then
        print -P "%F{yellow}ℹ Note: Failed script is preserved at %U$tmp_file%u for inspection.%f" >&2
    fi

    return $exit_code
}