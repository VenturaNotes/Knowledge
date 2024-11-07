[00:05:25](https://www.youtube.com/watch?v=e7BufAVwDiM&t=325s)

- How to send the output to a file
```bash
#! /bin/bash

echo "hello bash script" > file.txt

# This creates a file.txt file with the text "hello bash script"
# Output of above file has been stored in file.txt
```
- You can also take output from terminal shell and store in file as well 

```bash
#! /bin/bash

cat >file.txt

# By executing this script in terminal, it becomes an editor
# Pressing Control + D helps you get out of it
# Clicking the reload button for file.txt will change the file text
	# to what you wrote in the terminal
# It replaces the old text

cat >> file.txt
# not replace it but append text ahead of it
# 2 angle brackets is required
# It turns the terminal into an editor?
```
