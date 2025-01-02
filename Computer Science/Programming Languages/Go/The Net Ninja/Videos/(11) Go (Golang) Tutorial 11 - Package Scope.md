---
Source:
  - https://youtube.com/watch?v=XYK4Rs80q6c
Reviewed: false
---
main.go
```Go
package main

import "fmt"

// Needs to be declared at the root level for other
// scripts to access it.

// cannot use shorthand outside of functions
// scoreTwo := 50

var score = 99.5

func main() {
	sayHello("mario")

	for _, v := range points {
		fmt.Println(v)
	}

	//Invokes the function
	showScore()
}
```

greetings.go
```Go
package main

//need above package to share variables and functions

import "fmt"

var points = []int{20, 90, 100, 45, 70}

func sayHello(n string) {
	fmt.Println("hello", n)
}

func showScore() {
	fmt.Println("You scored this many points:", score)
}
```

- In order to use a package, do
	- `go mod init package_name`
	- `go mod tidy`
- To run the code, type
	- `go run main.go greetings.go`

Output:
```
hello mario
20
90
100
45
70
You scored this many points: 99.5
```

