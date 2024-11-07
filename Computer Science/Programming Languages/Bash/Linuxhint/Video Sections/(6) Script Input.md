[00:45:29](https://www.youtube.com/watch?v=e7BufAVwDiM&t=2729s)

- How to deal with $1, $2, and $3
- inputs we give to scripts
- also dollar hash and dollar @
- how we can give an input as a file
- and how we can read that file using stdin

Getting arguments from terminal
```shell
echo $0 $1 $2 $3

# BMW MERCEDES TOYOTA
# Useful for in terminal : ./hello.script BMW MERCEDES TOYOTA
# the number represents the argument
# Each argument represents the position of input. $0 gives file script name
```

Getting all arguments from terminal
```shell
#! /bin/bash

args=("$@")

# This prints out the first 3 inputs
echo ${args[0]} ${args[1]} ${args[2]}

#This prints out all inputs
echo $@

#Gives us the length of array
echo $#

#Gives an aray of unlimited inputs
#The 0th index here doesn't give the name of file
```

Read file
```shell
#! /bin/bash

while read line
do
	echo "$line"
done < "${1:-/dev/stdin}"

#$1 is the input given of filename
#use path of stdin to read file

# Whatever is written will be printed out
# if no file name is given, it creates the terminal as a file

#In terminal, execute file by doing "./filename.sh <textfile>"
	# This will print out whatever the contents are of the textfile
	# If there is a .txt afterwards, make sure to include it.
	# Otherwise don't include it at all
```

-   \\ slashes are important to assume 1 file
	- If you want to retrieve the file "Untitled Document 1" you need to reference it like "Untiltled\ Document\ 1"
- control + z breaks out
