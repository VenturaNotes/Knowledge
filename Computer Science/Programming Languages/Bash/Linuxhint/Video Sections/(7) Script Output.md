[00:55:58](https://www.youtube.com/watch?v=e7BufAVwDiM&t=3358s)

- STDOUT STDERR
- "ls -al" is the standard output
- "ls +al" is the standard error

standard output and standard error
```bash
#! /bin/bash

#standard output sent to file1.txt
#file2.txt will be empty
#ls -al 1>file1.txt 2>file2.txt

#this creates a standard error and output will be towards file2.txt
#ls +al 1>file1.txt 2>file2.txt

#It's automatically assumed that file1.txt is the standard output file. (even when deleted)
#It creates the file1
#ls -al > file1.txt 

#no standard error file is printed but displayed right to the terminal
#ls +al > file1.txt

#this will show both standard input and standard output
#ls -al > file1.txt 2>&1
ls -al >&file1.txt


#redirect standard output and standard error to 2 fundamental basic files
# same file is possible too
# 1 stands for standard output and 2 stands for standard error

```
