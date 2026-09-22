---
Source:
  - https://www.youtube.com/watch?v=e7BufAVwDiM
Length: 3 hours, 8 minutes, 3 seconds
tags:
  - status/complete
  - type/video
---
## Introduction

This language invented this reverse word technique to delimit blocks. [^1]

Technically, you don't have to place quotes around your variables but if you ignore doing it, you may encounter unexpected results. [^2]

Bash is an interpreted language
```bash
[[ $1 -gt 0 ]] && echo "$1 is positive"
#This will print out any positive number that you use as an argument 
```
## Sections
[[(1) Hello Bash Scripting]]
[[(2) Redirect to file]]
[[(3) Comments]]
[[(4) Conditional Statements]]
[[(5) Loops]]
[[(6) Script Input]]
[[(7) Script Output]]
[[(8) Send output from one script to another script]]
[[(9) String Processing]]
[[(10) Numbers and Arithmetic]]
[[(11) Declare Command]]
[[(12) Arrays]]
[[(13) Functions]]
[[(14) Files and Directories]]
[[(15) Sending email via script]]
[[(16) Curl in Scripts]]
[[(17) Professional menus]]
[[(18) Wait for filesystem events with inotify]]
[[(19) Introduction to grep]]
[[(20) Introduction to aw]]
[[(21) Introduction to sed]]
[[(22) Debugging Bash Scripts]]

## References

[^1]: https://unix.stackexchange.com/questions/256149/what-does-esac-mean-at-the-end-of-a-bash-case-statement-is-it-required#:~:text=The%20esac%20keyword%20is%20indeed,word%20technique%20to%20delimit%20blocks
[^2]: https://nickjanetakis.com/blog/here-is-why-you-should-quote-your-variables-in-bash#:~:text=Technically%20you%20don't%20have,you%20may%20encounter%20unexpected%20results