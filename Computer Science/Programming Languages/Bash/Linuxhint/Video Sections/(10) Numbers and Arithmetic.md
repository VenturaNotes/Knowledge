[01:15:39](https://www.youtube.com/watch?v=e7BufAVwDiM&t=4539s)


expressions
``` bash
#! /bin/bash

#addition
#subtraction
#multiplication
#Division
#Modulus

n1=4
n2=20
echo $(( n1 + n2 ))
echo $(( n1 - n2 ))
echo $(( n1 * n2 ))
echo $(( n1 / n2 )) #showing output in integer
echo $(( n1 % n2 ))

# Alternative method

#expr evaluates an expression

echo $(expr $n1 + $n2 ) 
echo $(expr $n1 - $n2 ) 
echo $(expr $n1 \* $n2 ) 
echo $(expr $n1 / $n2 ) 
echo $(expr $n1 % $n2 ) 
```

Convert hex values to decimal values
```bash
#! /bin/bash

#Converts hex value to decimal value
echo "Enter Hex Number of your choice"
read Hex

echo -n "The decimal value of $Hex is : "

#bc calculator is being used
echo "obase=10; ibase=16; $Hex" | bc

```
