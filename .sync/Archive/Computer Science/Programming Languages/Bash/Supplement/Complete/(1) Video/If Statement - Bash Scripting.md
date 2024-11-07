[Video](https://www.youtube.com/watch?v=waq3rchxMwg)

Reading input, and/or conditional operators, if/then/else/elif statements
```bash
#! /bin/bash
randomVar=5
echo "Enter a number"

#This reads the input of the user
read num

if [[ ($num -lt 10 && $randomvar -eq 5) ]];
then
	echo "Your number $num is less than 10"
elif [[ ($num -lt 20 || $randomVar -eq 5)]];
then
	echo "Number less than 20"
else
	echo "Number not recognized"
fi
```