[02:12:44](https://www.youtube.com/watch?v=e7BufAVwDiM&t=7964s)

- select loop
	- how to work with it
	- how to wait for input

Gives option to select car
```bash
#! /bin/bash

select car in BMW MERCEDESE TESLA ROVER TOYOTA
do 
	echo "You have selected $car"
done

: "
Output:
1) BMW
2) MERCEDESE
3) TESLA
4) ROVER
5) TOYOTA
#? 2
You have selected MERCEDESE
#? 3
You have selected TESLA
#? 4
You have selected ROVER
"
```

using cases to select car
```bash
1) BMW
2) MERCEDESE
3) TESLA
4) ROVER
5) TOYOTA
#? 3
TESLA SELECTED
#? 2
MERCEDESE SELECTED
#? n
ERROR! Please select between 1..5
#? 8
ERROR! Please select between 1..5
```

timer for key
```bash
#! /bin/bash

echo "press any key to continue"
#This will tell me every 3 seconds on a newline to press a key
# When pressing the key, it will terminate

while [ true ]
do
#t stands for seconds (gives reminder every 3 seconds)
	read -t 3 -n 1
if [ $? = 0 ]
then
	echo "you have terminated the script"
	exit;
else
	echo "waiting for you to press the key sir!"
fi
done
```
