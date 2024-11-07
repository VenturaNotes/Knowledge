[Video](https://youtube.com/watch?v=ypV7r1ODZCA)

Code
``` Go
package main

import (
	"fmt"
	"strings"
)

// Second set of arguments are for the return type
func getInitials(n string) (string, string) {
	
	//Uppercase entire string
	s := strings.ToUpper(n)
	
	//Splits the string into 2 parts
	names := strings.Split(s, " ")

	//use _ when you don't need index
	//but you do want the value
	var initials []string
	for _, v := range names {
		//Gets us the first letter of the string (doesn't include position 1)
		initials = append(initials, v[:1])
	}

	//If there is a second string
	if len(initials) > 1 {
		return initials[0], initials[1]
	}

	//This is if there is no second string
	return initials[0], "_"
}

func main() {
	//able to assign multpile values
	fn1, sn1 := getInitials("tifa lockhart")
	fmt.Println(fn1, sn1)

	fn2, sn2 := getInitials("cloud strife")
	fmt.Println(fn2, sn2)

	fn3, sn3 := getInitials("barret")
	fmt.Println(fn3, sn3)
}
```

Output
```
T L
C S
B _
```