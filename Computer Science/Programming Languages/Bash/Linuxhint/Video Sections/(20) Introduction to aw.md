[02:41:37](https://www.youtube.com/watch?v=e7BufAVwDiM&t=9697s)

- It is a scripting language used for manipulating data and generating reports
- Will run this command in our bash scripting file
- Has its own extesion files with .awk
- Bash files have the extension .sh
- Can use awk in the case of bash scripting
- The awk command, you can say that it is a programming language
- It requires no compiling and it allows other users to use variables, numeric functions, string functions, and logical operators as well
- awk is a utility, enables programmer to write tiny but effective programs in the form of statements, and those statements define text patterns that are to be searched in document, and the action to be taken when match is found within that file
- What can you do with awk?
	- 1. Scan a file
	- 2. Split each input line into different fields
		- Can do this with $1, $2, $3
			- $1 stands for free $1
	- can perform actions on matched lines
	- It transforms data files
	- Produces formatted reports
	- Programming constructs
		- formatted output
		- Ability to perform arithmetic and string operations
		- Ability to use conditional statements and loops

awk formats
```bash
#! /bin/bash

echo "Enter filename to print from awk"
read fileName

if [[ -f $fileName ]]
then
	#Prints out all the text in file
	awk '{print}' $fileName

	#Prints out all the lines containing "Windows"
	awk '/Windows/ {print}' $fileName

	#Prints out the 4th field of a Windows Line
	#So a line such as "This is Windows 3000" will print "3000"
	awk '/Windows/ {print $4}' $fileName
	
	#This prints out both the 3rd and 4th field of a Windows line
	awk '/Windows/ {print $3,$4}' $fileName
else
	echo "$fileName doesn't exist"
fi

```

- You can create separate files for awk using begin and end clauses
- Can go to terminal and go to man pages in terminal for further uses
