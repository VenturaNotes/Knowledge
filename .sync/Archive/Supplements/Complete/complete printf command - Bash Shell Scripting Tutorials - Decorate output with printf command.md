[video](https://youtu.be/JqgNK7rALpM)

- Concept is printf command
	- similar to echo command with some advantages
- Both echo and printf commands are used to display string or value of a variable
- The difference is that echo sends a newline at the end of its output, there is no way to "send" an EOF in printf command.
- The advantage of printf command:
	- We can format the output
	- Useful in awk command/scripting as well
- Syntax:
	- printf "format\\n" "arguments"
	- printf "format_with_modifiers \\n" "arguments"
- Note: format/format_with_modifiers is an optional and we can omit it
- Terminal commands:
	- printf "$x\\n"
		- You need to add a newline when printing a variable for better appearance
	- tput lines
		- Tells you the # of rows that is able to be displayed on terminal. Stretching terminal vertically will allow you to see more rows. (more displayed = more rows)
	- tput cols
		- This will tell you how many columns can be seen on terminal window. Stretching the terminal horizontally will give you more columns counted. (more displayed = more columns)
	- % printf "%113s" " " | tr " " "-"
		- This lets me print 113 "-" across the terminal
		- You can get same output, but need this much logic
- Echo Option
```bash
#! /bin/bash
COLUMNS=$(tput cols)
for ((i=1;i<=COLUMNS;i++))
do
	if [[ $i -eq $COLUMNS ]]
	then
		echo "-"
		break
	fi
	echo -n "-"
done
```

## printf command with only format
- Syntax
	- printf "format\n" "arguments"
- Different types of formats are

| %d  | For signed decimal numbers                                                                  |
| --- | ------------------------------------------------------------------------------------------- |
| %i  | For signed decimal numbers                                                                  |
| %u  | For unsigned decimal numbers                                                                |
| %o  | For unsigned octal numbers                                                                  |
| %x  | For unsigned hexadecimal numbers with lower case letters (a-f) and upper case letters (a-F) |
| %f  | For floating point numbers                                                                  |
| %s  | For string                                                                                  |
| \%% | For percent % symbol                                                                                            |

- To print multiple statements
	- with  `x=5` and `y=7.890`
	- `printf "$x $y\n"` will output `5 7.980`
- Decorate the format
	- `printf "%d %f\n" "$x" $y"`
		- Output:
			- `5 7.890000`
		- Always write your variables / arguments inside of quotations
- Example:
	- Code:
		- `my_name = "Shell scripting"`
		- `printf "%s  %d   %f\n" "my_name" "$x" "$y"`
	- Output:
		-  `Shell scripting 5   7.890000`
- Decorating Output Example
	- Code:
		- `"my_name=%s my num=%d my_float= %f\n" "$my_name" "$x" "$y" `
	- Output
		- `my_name=Shell scripting my num=5 my_float= 7.890000`

## printf command: format with modifiers:
- Syntax
	- `printf "format_with_modifiers \n" "arguments`
- Different types of format modifiers are

| Format | Description                                                       |
| ------ | ----------------------------------------------------------------- |
| N      | This specifies the width of the field for output                  |
| *      | This is the placeholder for the width                             |
| -      | To left align output in the field. (Default: right align)         |
| 0      | Pad results with leading 0s                                       |
| +      | To put + sign before positive numbers - sign for negative numbers |

- ### Examples
- `printf "%d\n" "$x"`
	- `5`
		- Outputs the # 5
- `printf "%5d\n" "$x"`
	- `    5`
		- Outputs 4 spaces in front of 5
- `printf "%05d\n" "$x"`
	- `00005`
		- Outputs 4 0s before the 5
-  `printf "%0.3f\n" "$y"`
	- `7.890`
		- Rounds to 3 decimal places
-  `printf "%20.3f\n" "$y"`
	- `               7.890`
		- Right-align with total of 20 spaces
-   `printf "%020.3f\n" "$y"`
	- `00000000007.890`
		- Right-align with total of 20 spaces filled by 0s with spare space
-   `printf "%-20.3f\n" "$y"`
	- `7.890               `
		- Left-align with total of 20 spaces.
- Placeholder for width
	- Example 1
		- Code
			- `p= 20`
			- `printf "%*f\n" "$p" "$y"`
		- Output
			- `              7.890`
				- Right aligns with 20
	- Example 2
		- Code
			- `p = 20`
			- `printf "%${p}f\n" "$y"`
		- Output
			- `              7.890`
				- Right aligns with 20
- Getting text in center of terminal
	- ![[Screenshot 2022-12-26 at 8.59.44 PM.png]]



