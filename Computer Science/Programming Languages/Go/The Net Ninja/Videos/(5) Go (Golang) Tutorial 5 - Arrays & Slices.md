---
Source:
  - https://youtube.com/watch?v=Arb-LjPg7FA
---
Arrays and Slices
```Go
package main

import "fmt"

func main() {
	//var ages [3]int =[3]int{20, 25, 30} 
	var ages = [3]int{20, 25, 30}
 
	names := [4]string{"yoshi", "mario", "peach", "bowser"}
	names[1] = "luigi"

	fmt.Println(ages, len(ages)) //returns length of array
	fmt.Println(names, len(names))

	//slices (use arrays under the hood)
	var scores = []int{100, 50, 60} //You can append items to slices but not arrays
	scores[2] = 25
	scores = append(scores, 85)

	fmt.Println(scores, len(scores))

	//slice ranges
	rangeOne := names[1:3] //You can get ranges from existing arrays and store them in new slices
	rangeTwo := names[2:]
	rangeThree := names[:3]

	fmt.Println(rangeOne, rangeTwo, rangeThree)

	rangeOne = append(rangeOne, "koopa")
	fmt.Println(rangeOne)

}
```

Output
```
[20 25 30] 3
[yoshi luigi peach bowser] 4
[100 50 25 85] 4
[luigi peach] [peach bowser] [yoshi luigi peach]
[luigi peach koopa]
```