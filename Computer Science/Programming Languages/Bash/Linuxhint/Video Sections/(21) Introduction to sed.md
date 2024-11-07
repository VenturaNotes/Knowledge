[02:51:54](https://www.youtube.com/watch?v=e7BufAVwDiM&t=10314s)

- Stands for stream editor
- You can use it to manipulate text files and substituting purposes as well
- can be used in many ways with complex files

Using bash commands
```bash
#! /bin/bash

echo "Enter filename to substitue using sed"
read fileName

if [[ -f $fileName ]]
then
	#The s stands for substitution
	# We are replacing a lower i to an upper I
	#Replaces only the first occurence of i
	cat sedfile.txt | sed 's/i/I/'
	
	#g stands for global so that all lower i will turn to upper I
	cat sedfile.txt | sed 's/i/I/g'
	
	#Using pipe is just a convention, so even without it, it'll still work
	sed 's/i/I/g' $fileName
		
	#The changes above don't completely change the file though
	# It's better to just write the output to a new text file
	sed 's/i/I/g' $fileName > newFile.txt
	
	#This modifies the original file and doesn't output anything
	sed -i 's/i/I/g' $fileName
	
	#You can also modify entire strings
	#You could use a flag to take care of case sensitivity
	sed -i 's/LInux/Unix/g' $fileName
	
else
	echo "$fileName doesn't exist"
fi
```
