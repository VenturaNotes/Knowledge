[02:31:13](https://www.youtube.com/watch?v=e7BufAVwDiM&t=9072s)

- You can search inside this file using grep command

Returns all the lines with the text we want in a .txt file. Displays all lines that contain the word linux
```bash
#! /bin/bash

echo "Enter filename to search text from"
read fileName

if [[ -f $fileName ]]
then
	echo "Enter the text to search"
	read grepvar
	#returns the line + number text is found
	grep -i -n $grepvar $fileName
else
	echo "$filename doesn't exist"
fi

:"

# Returns the # of lines the text is found in
grep -i -n -c $grepvar $fileName

# Returns the # of lines where the text does not show up
grep -i -n -c -v $grepvar $fileName
"
```

- Doing "man grep" in terminal will give you all the search options you need
	- Man means manual