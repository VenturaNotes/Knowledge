[03:02:24](https://www.youtube.com/watch?v=e7BufAVwDiM&t=10944s)

- Bash offers an extensive debugging facility
	- so you can debug your bash script
- There are 3 fundamental ways to debug your script
- The 
- "bash -x ./helloscript.sh" will debug your script. Will show step by step things being executed
	- It shows step by step lines that are being executed
	- In a for loop, it would show you each iteration of the script.
	- It shows a step by step procedure
debugging with script
```bash
#! /bin/bash -x

# The above needs to be on first line
# -x makes the script automatically debug


echo "Enter filename to substitue using sed"
read fileName

if [[ -f $fileName ]]
then
	sed -i 's/LInux/Unix/g' $fileName
	
else
	echo "$fileName doesn't exist"
fi
```

set range of debugging with set x
```bash
#! /bin/bash

set -x

echo "Enter filename to substitue using sed"
read fileName

set +x

if [[ -f $fileName ]]
then
	sed -i 's/LInux/Unix/g' $fileName
	
else
	echo "$fileName doesn't exist"
fi

```
