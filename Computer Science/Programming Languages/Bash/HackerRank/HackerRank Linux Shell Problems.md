---
Source:
  - https://www.hackerrank.com/domains/shell
Length: "6509"
tags:
  - status/incomplete
  - type/website
Reviewed: false
---
## Bash
### 1. Let's Echo
```bash
echo "HELLO"
```

### 2. Looping and Skipping
```shell
# Solution 1
for i in {1..100..2}
do
    echo $i
done

```
### 3. A personalized Echo
```bash
read line

echo "Welcome $line"
```



### 4. Looping with Numbers
```bash
read line

echo "Welcome $line"
```

### 5. The World of Numbers
```bash
read n1
read n2

echo $(( n1 + n2 ))
echo $(( n1 - n2 ))
echo $(( n1 * n2 ))
echo $(( n1 / n2 ))
```

### 6. Comparing Numbers
```bash
read n1
read n2

if ((n1 > n2))
then
    echo "X is greater than Y"
fi

if ((n1 < n2))
then
    echo "X is less than Y"
fi

if ((n1 == n2))
then
    echo "X is equal to Y"
fi
```


### 7. Getting started with conditionals
```bash
# Reads in one character from STDIN
read -n1 line

if [[ "$line" == "Y" || "$line" == "y" ]]
then
    echo "YES"
fi

if [[ "$line" == "N" || "$line" == "n" ]]
then
    echo "NO"
fi
```

### 8. More on Conditionals
```bash
read side1
read side2
read side3

if [[ "$side1" -eq "side2" && "$side2" -eq "$side3" ]]
then
    echo "EQUILATERAL"
elif [[ "$side1" -ne "side2" && "$side2" -ne "$side3" && "$side1" -ne "$side3" ]]
then
    echo "SCALENE"
else
    echo "ISOSCELES"
fi

done
```

### 9. Arithmetic Operations

- Wrapping the expression in double parenthesis $((..)) evaluates it, but this is confined to integer computations. [^1]
- bc command [^2]
	- **bc** command is used for command line calculator. It is similar to basic calculator by using which we can do basic mathematical calculations].
	- **-l**, {- -mathlib } : Define the standard math library
- Parenthesis () - Command substitution [^3]
	- Command substitution allows the output of a command to replace the command itself. Command substitution occurs when a command is enclosed as follows: `$(command)`

Echo will always truncate w/ `scale` and `| bc`
```bash
line=7.5319/1
echo "scale = 3; $line" | bc
```

```bash
#Reads in the file
read expression

#Using printf to round to 3 digits
#bc lets me use command line calculator
printf "%.3f" $(echo "$expression" | bc -l)
```

### 10. Compute the Average

Attempt #1 Error
Doesn't work because it's not reading every line?
```bash
#!/bin/bash

mysum=0
mycounter=0

while IFS= read -r line; do
    mysum=$(( mysum + line))
    mycounter=$(( mycounter + 1 ))
    echo $line
done

mycounter=$((mycounter-1))
mysum=$((mysum - mycounter))

printf "%.3f" $(echo $mysum/$mycounter | bc -l)
```

My Correct Solution
```bash
read t
sum=0
for((i=0;i<t;i++))
do
    read num
    sum=$((sum+num))
done
printf "%.3f" $(echo "$sum/$t" | bc -l)
```

Referenced Solution [^4]
```bash
read t;
sum=0;
for((i=0;i<t;i++))
do
read num;
sum=$((sum+num));
done
printf "%.3f" $(echo "scale=4; $sum / $t " | bc );
```



## Text Processing
### 1. Cut #1
- `cut` command information [^5]
	- The `cut` command performs operations on each line it reads
	- ![[Screenshot 2022-11-15 at 5.29.00 PM.png]]
	- The `-d` flag sets the delimiter, space in this case, and the `-f` flag shows which column to return `2` . The column count starts at `1`.
	- In the next command, output from the first command is piped to a second command where the delimiter is a period and the column is `4`. Finally, `cut` is used to extract the first character from the results of the second command.

### Help
Creating an if statement
```
if ((5 > 4))
then
    echo "True"
fi
```

POSIX shells don't support (()) for # comparison [^6]

## References
[^1]: https://www.hackerrank.com/challenges/bash-tutorials---arithmetic-operations/tutorial
[^2]: https://www.geeksforgeeks.org/bc-command-linux-examples/
[^3]: https://askubuntu.com/questions/833833/what-does-command-do
[^4]: http://sivagamiannamalai.blogspot.com/2015/04/hackerrank-bash-challenges-compute.html
[^5]: https://www.hackerrank.com/challenges/text-processing-cut-1/Tutorial
[^6]: https://stackoverflow.com/questions/18668556/how-can-i-compare-numbers-in-bash#:~:text=posix%20shells%20that%20don't%20support%20(()%5C)