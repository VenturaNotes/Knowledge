[00:14:01](https://www.youtube.com/watch?v=e7BufAVwDiM&t=841s)

- If statements
- if Else statements
- if-else-if statements
- conditional for and operators
- conditional for or operators
- Case statements

```shell
count=10
if [ $count -eq 10 ]
then
	echo "the condition is true"
else
	echo "the condition is false"
fi
# Need to create brackets during conditions
# also need 1 space between brackets otherwise weird error?
# There must be no spaces when doing "count=10" for assigning a variable

# -eq: equal to
# -ne: not equal to
# -gt: greater than

count=10

if (( $count > 9 ))
then
	echo "the condition is true"
else
	echo "the condition is false"
fi

# Must use soft brackets if you want to use greater than symbol '>
# Used for angle brackets '>' and '<'
```
- Spacing matters in bash

if-else-if statements
```shell
count=10

if (( $count < 9 ))
then
	echo "first condition is true"
elif (( $count > 9 ))
then
	echo "second condition is true"
else
	echo "the condition is false"
fi
```

Conditional Operators
```shell
#! /bin/bash

age=30

if [ "$age" -gt 18 ] && [ "$age" -lt 40 ]
then
	echo "Age is correct"
else
	echo "Age is not correct"
fi

if [[ "$age" -gt 18 && "$age" -lt 40 ]]
# This is another valid form of syntax

if [ "$age" -gt 18 -a "$age" -lt 40 ]
# Another valid form of syntax

if [ "$age" -gt 18 -o "$age" -lt 40 ]
if [[ "$age" -gt 18 || "$age" -lt 40 ]]
# Both if statements use OR

#The quotation marks above aren't necessary but preferred?
```

case statements [^1]
```shell
#! /bin/bash

# whatever value is typed after ./helloscript.sh Hello
#	The "Hello" will be assigned to $1
car=$1

case $car in
	"BMW" ) #Case we want to check
		echo "It's BMW" ;; #Double semicolons breaks the statement
	"Mercedese" )
		echo "this is mercedese" ;;
	"Honda" )
		echo "this is Honda" ;;
	"Toyota" )
		echo "this is toyota" ;;
	* )
		echo "this is not a car or not a car listed" ;;
esac

```

terminal:
- nano hell.sh 
	- This will open the GNU nano editor

## References
[^1]: https://www.youtube.com/watch?v=Qy08aA4XQFA