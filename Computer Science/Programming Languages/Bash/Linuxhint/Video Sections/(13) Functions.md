[01:35:06](https://www.youtube.com/watch?v=e7BufAVwDiM&t=5706s)

Passing in arguments to function
```bash
#! /bin/bash

function funcPrint()
{
	echo $1 $2 $3 $4
	
}


funcPrint Hi This is linuxhint

```

Function example
```bash
#! /bin/bash

function funcCheck()
{
	returningValue="Using Function right now"
	echo "$returningValue"
}
funcCheck
```

Local Variables
```bash
#! /bin/bash

function funcCheck()
{
	#This is a local variable inside the function
	returningValue="I love linux"
}

#can't access the variable outside the "funcCheck()" function 
returningValue="I love MAC"
echo $returningValue

funcCheck
echo $returningValue



```
