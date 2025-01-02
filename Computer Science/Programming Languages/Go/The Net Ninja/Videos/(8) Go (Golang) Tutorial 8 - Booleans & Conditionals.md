---
Source:
  - https://youtube.com/watch?v=d5oUb2T2iCE
Reviewed: false
---
Booleans & Conditionals
```Go
package main

import "fmt"

func main() {
	age := 45

	fmt.Println(age <= 50) //less than or equal to (True)
	fmt.Println(age >= 50) //greater than or equal to (False)
	fmt.Println(age == 45) //equal to (True)
	fmt.Println(age != 50) //equal to (True)

	if age < 30 {
		fmt.Println("age is less than 30")
	} else if age < 40 {
		fmt.Println("age is less than 40")
	} else {
		fmt.Println("age is not less than 45")
	}

	names := []string{"mario", "luigi", "yoshi", "peach", "bowser"}

	for index, value := range names {
		if index == 1 {
			fmt.Println("continuning at pos", index)
			continue
		}
		if index > 2 {
			fmt.Println("breaking at pos", index)
			break
		}
		fmt.Printf("the value at pos %v is %v \n", index, value)
	}
}

```

Output
```
true
false
true
true
age is not less than 45
the value at pos 0 is mario 
continuning at pos 1
the value at pos 2 is yoshi 
breaking at pos 3
```