[02:22:12](https://www.youtube.com/watch?v=e7BufAVwDiM&t=8532s)

- inotify is inode notify
	- it is a linux kernal subsystem that acts to extend file systems to notice changes to the file system
	- Can be used to monitor files and directories as well
- "sudo apt install inotify-tools" to install inotify no terminal
- if you don't have permission, just do sudo <file.sh>
- "control + c" can also be used to escape terminal
- ls -a option flag lists all files including hidden files starting with '.' [^1]

Create folders and monitor the folder
```bash
#! /bin/bash

# The p option ensures that the parent option is created as needed
# There is no / needed before the parent folder
mkdir -p temp/NewFolder
inotifywait -m temp/NewFolder

:"
Opening thte temp folder will show this in terminal
temp/NewFolder/ OPEN,ISDIR 
temp/NewFolder/ ACCESS,ISDIR 
temp/NewFolder/ CLOSE_NOWRITE,CLOSE,ISDIR 

Creating a file in a separate terminal (touch file1.txt) will output:
temp/NewFolder/ CREATE file1.txt
temp/NewFolder/ OPEN file1.txt
temp/NewFolder/ ATTRIB file1.txt
temp/NewFolder/ CLOSE_WRITE,CLOSE file1.txt

echo (this is cool) > file1.txt

temp/NewFolder/ MODIFY file1.txt
temp/NewFolder/ OPEN file1.txt
temp/NewFolder/ MODIFY file1.txt
temp/NewFolder/ CLOSE_WRITE,CLOSE file1.txt
temp/NewFolder/ OPEN file1.txt
temp/NewFolder/ ACCESS file1.txt
temp/NewFolder/ CLOSE_NOWRITE,CLOSE file1.txt

"
```
man pages is a good reference source? for inotify

## References

[^1]: https://www.rapidtables.com/code/linux/ls/ls-a.html#:~:text=command%20in%20Linux-,ls%20-a%20option,Syntax,-%24%20ls%20-a%20%5Boptions