[00:29:47](https://www.youtube.com/watch?v=e7BufAVwDiM&t=1787s)

- while loops
- until loops
- for loops
- break and continue statements

while loops
```shell
number=1
while [ $number -lt 10 ]
do
	echo "$number"
	number=$(( number+1 ))
done

#-lt: less than
#-le: less than or equal to

: "
Output:
1
2
3
4
5
6
7
8
9
"
```

until loops
```shell
#! /bin/bash

number=1
# The until loop will run until the condition becomes true
until [ $number -ge 10 ]
do
	echo $number
	number=$(( number+1 ))
done


: "
Output:
1
2
3
4
5
6
7
8
9

"
```

for loops:
```shell
#! /bin/bash

for i in {0..20..2} #{start..ending..increment}
do
	echo $i
done
: "
Output:
0
2
4
6
8
10
12
14
16
18
20
"
```

for loops
```shell
#! /bin/bash

for (( i=0; i <5; i++ ))
do
	echo $i
done

: "
Output:
0
1
2
3
4

"
```


break
```shell
#! /bin/bash

for (( i=0; i<=10; i++ ))
do
	if [ $i -gt 5 ]
	then
		break
	fi
	echo $i
done

# We only print up to 5 because the for loop is broken
	# when i = 6

: "
Output:
0
1
2
3
4
5

"
```

continue
```shell
#! /bin/bash

for (( i=0; i<=10; i++ ))
do
	if [ $i -eq 3 ] || [ $i -eq 7 ]
	then
		continue
	fi
	echo $i
done

# It skips the 3 and 7 because we continue the loop
	# without printing it

:"
Output:
0
1
2
4
5
6
8
9
10

"
```
