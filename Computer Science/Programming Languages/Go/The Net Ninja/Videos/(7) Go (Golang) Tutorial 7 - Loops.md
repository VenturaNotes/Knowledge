---
Source:
  - https://youtube.com/watch?v=CL13xV2dHCg
---
Loops
```Go
package main

import (
	"fmt"
)

func main() {

	//Will always use for. No while exists?
	x := 0
	for x < 5 {
		fmt.Println("value of x is:", x)
		x++
	}

	for i := 0; i < 5; i++ {
		fmt.Println("value of i is:", i)
	}

	names := []string{"mario", "luigi", "yoshi", "peach"}

	for i := 0; i < len(names); i++ {
		fmt.Println(names[i])
	}

	// Returns the index and value of the elements in "names"
	//value is a local copy of the variable
	// This is the format required to get index and value of string
	for i, v := range names {
		fmt.Printf("the value at pos %v is %v \n", i, v)
		v = "new string"
		fmt.Println(" TEST")
	}

	//Replace index with _ so we don't need to find/use index to prevent error
	for _, val := range names {
		fmt.Print(val, ",")
		val = "new string"
	}

	//changing val in a loop does not mutate the original slice
	fmt.Println(names)

}
```

Output
```
value of x is: 0
value of x is: 1
value of x is: 2
value of x is: 3
value of x is: 4
value of i is: 0
value of i is: 1
value of i is: 2
value of i is: 3
value of i is: 4
mario
luigi
yoshi
peach
the value at pos 0 is mario 
 TEST
the value at pos 1 is luigi 
 TEST
the value at pos 2 is yoshi 
 TEST
the value at pos 3 is peach 
 TEST
mario,luigi,yoshi,peach,[mario luigi yoshi peach]
```

