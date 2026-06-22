#!/bin/bash

TARGET_DIR="/Users/julianventura/Desktop/Knowledge/Scripts/Terminal"

# Check if the directory exists
if [ -d "$TARGET_DIR" ]; then
    # List only the files
    ls -1 "$TARGET_DIR"
else
    echo "Error: The directory $TARGET_DIR does not exist." >&2
    exit 1
fi