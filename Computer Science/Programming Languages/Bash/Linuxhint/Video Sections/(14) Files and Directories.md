[01:43:10](https://www.youtube.com/watch?v=e7BufAVwDiM&t=6190s)

- Learn how to create directories
- How to check if current directory exists or not
- check how to create a file
- how to check if file exists
- append text to file
- read file line by line
- delete file

Creating Directory
```bash
#! /bin/bash

#make directory + folder name
# -p ensures that it won't overwrite the folder?
mkdir -p Directory2
```

Checks Directory Exists
```bash
#! /bin/bash

echo "Enter directory name to check"
read direct

#Checks if directory exists or not
if [ -d "$direct" ]
then
	echo "$direct exists"
else
	echo "$direct doesn't exist"
fi
```

Creates File
```bash
#! /bin/bash

echo "Enter directory name to check"
read fileName

#helps us create file
touch $fileName
```

Checks if file exists
```bash
#! /bin/bash

echo "Enter directory name to check"
read fileName

# -f works in case of file
if [ -f "$fileName" ]
then
	echo "$fileName exists"
else
	echo "$fileName doesn't exist"
fi
```

Appending to file 
```bash
#! /bin/bash

echo "Enter directory in which you want to append"
read fileName

# -f works in case of file
if [ -f "$fileName" ]
then
	echo "Enter the text that you want to append"
	read fileText
	#double angle brackets appends into the file
	#To replace text just use single angle bracket ">"
	echo "$fileText" >> $fileName
else
	echo "$fileName doesn't exist"
fi
```

Reading from file
```bash
#! /bin/bash

echo "Enter filename from which you want to read"
read fileName

# -f works in case of file
if [ -f "$fileName" ]
then
	#IFS has an empty string but you can do (IFS="") as well
	while IFS= read -r line
	do
		echo "$line"
	#direction of angle bracket is opposite to read file
	done < $fileName
else
	echo "$fileName doesn't exist"
fi
```

Delete file
```bash
#! /bin/bash

echo "Enter filename from which you want to read"
read fileName

# -f works in case of file
if [ -f "$fileName" ]
then
	rm $fileName
	echo "file has been deleted successfully"
else
	echo "$fileName doesn't exist"
fi
```
