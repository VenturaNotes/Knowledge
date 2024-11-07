[01:05:53](https://www.youtube.com/watch?v=e7BufAVwDiM&t=3953s)

Returns if strings match
```bash
#! /bin/bash

echo "enter 1st string"
read st1

echo "enter 2nd string"
read st2

if [ "$st1" == "$st2" ]
then
	echo "strings match"
else
	echo "strings don't match"
fi

#It is actually matching the order of the strings
```

Returns longer string
```bash
#! /bin/bash

echo "enter 1st string"
read st1

echo "enter 2nd string"
read st2

if [ "$st1" \< "$st2" ]
then
	echo "$st1 is smaller than $st2"
elif [ "$st1" \> "$st2" ]
then
	echo "$st2 is smaller than $st1"
else
	echo "both strings are equal"
fi
```

Concatenates strings
```bash
#! /bin/bash

echo "enter 1st string"
read st1

echo "enter 2nd string"
read st2

c=$st1$st2

echo $c
```

Capitalizing
```bash
#! /bin/bash

echo "enter 1st string"
read st1

echo "enter 2nd string"
read st2

# I can specify the letter to capitalize
echo ${st1^r}

#This makes the whole line capitalized 
echo ${st1^^}
```
