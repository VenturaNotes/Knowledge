---
Source:
  - https://youtube.com/watch?v=BoooHY57RXw
Reviewed: false
---
The Standard Library
```Go
package main

import (
	"fmt"
	"strings"
	"sort"
)

func main() {

	greeting := "hello there friends!"

	fmt.Println(strings.Contains(greeting, "hello"))         // true
	fmt.Println(strings.Contains(greeting, "hello!"))        // false
	fmt.Println(strings.ReplaceAll(greeting, "hello", "hi")) //Alters string but doesn't change source
	fmt.Println(strings.ToUpper(greeting))                   // Capitalizes the word
	fmt.Println(strings.Index(greeting, "l"))                // 2
	fmt.Println(strings.Split(greeting, " "))                //Returns slice of 3 elements

	//Slice of 3 elements

	//The original value is unchanged
	fmt.Println("original string value =", greeting)

	ages := []int{45, 20, 35, 30, 75, 60, 50, 25}

	sort.Ints(ages) // Alters original slice from lowest to highest
	fmt.Println(ages)

	index := sort.SearchInts(ages, 30)  //2
	index2 := sort.SearchInts(ages, 90) //8 because can't find it so returns length of array

	fmt.Println(index)
	fmt.Println(index2)

	names := []string{"yoshi", "mario", "peach", "boswer", "luigi"}

	sort.Strings(names) // Sorted in alphabetical order
	fmt.Println(names)

	fmt.Println(sort.SearchStrings(names, "bowser")) //returns position of bowser
}
```

Output
```
true
false
hi there friends!
HELLO THERE FRIENDS!
2
[hello there friends!]
original string value = hello there friends!
[20 25 30 35 45 50 60 75]
2
8
[boswer luigi mario peach yoshi]
1
```