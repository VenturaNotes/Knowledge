[01:23:07](https://www.youtube.com/watch?v=e7BufAVwDiM&t=4987s)

- Bash doesn't have a strong type system
- Declare is a bash built-in command that allows you to update attributes applied to variables within the scope of your shell.
- Allows you to declare a variable in long hand. Allows you to peak in variables as well
- "declare -p" in terminal will show all kinds of variables that are present there. Will show all variables of the system.
- You can create your own variable with the declare command
- "declare myvariable" creates a variable called "myvariable" in terminal
- "declare myvariable=22" assigns the value 22 to the variable
	- You can change it easily by doing "declare myvariable=11"
- We can create readonly variables as well

readonly file
```bash
#! /bin/bash

declare -r pwdfile=/etc/passwd

echo $pwdfile

pwdfile=/etc/abc.txt

#Unable to change file because it is readonly
echo $pwdfile
```
