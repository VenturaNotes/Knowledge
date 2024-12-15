---
Source:
  - https://youtube.com/watch?v=X68JmClzap4
---
Using Functions
```Go
package main

import (
	"fmt"
	"math"
)

// Creating a function that takes in a string
func sayGreeting(n string) {
	fmt.Printf("Good morning %v \n", n)
}

func sayBye(n string) {
	fmt.Printf("Goodbye %v \n", n)
}

// You invoke a function by doing f()
// Call function for each element inside array
func cycleNames(n []string, f func(string)) {
	for _, v := range n {
		f(v)
	}
}

// Have the return type as 2nd.
func circleArea(r float64) float64 {
	return math.Pi * r * r
}

// In Go, you will see a lot of single letter characters for arguments in functions.
func main() {
	sayGreeting("mario")
	sayGreeting("luigi")
	sayBye("mario")

	//Passing in reference of function
	cycleNames([]string{"cloud", "tifa", "barret"}, sayGreeting)
	cycleNames([]string{"cloud", "tifa", "barret"}, sayBye)

	a1 := circleArea(10.5)
	a2 := circleArea(15)

	fmt.Println(a1, a2)
	fmt.Printf("circle 1 is %0.3f and circle 2 is %0.3f", a1, a2)

}
```

Output
```
Good morning mario 
Good morning luigi 
Goodbye mario 
Good morning cloud 
Good morning tifa 
Good morning barret 
Goodbye cloud 
Goodbye tifa 
Goodbye barret 
346.36059005827474 706.8583470577034
circle 1 is 346.361 and circle 2 is 706.858%   
```