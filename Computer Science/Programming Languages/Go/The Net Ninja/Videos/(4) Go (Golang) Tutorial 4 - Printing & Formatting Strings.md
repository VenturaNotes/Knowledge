---
Source:
  - https://youtube.com/watch?v=m1Uy0WQ2Xns
---
Printing & Formatting Strings
```Go
package main

import "fmt"

func main() {

	age := 35
	name := "shaun"

	//Print
	fmt.Print("hello, ") //Does not add new line
	fmt.Print("world! \n")
	fmt.Print("new line \n")

	//Println
	fmt.Println("hello ninjas!") //new line automatically
	fmt.Println("goodbye ninjas!")
	fmt.Println("my age is", age, "and my name is", name) //my age is 35 and my name is shaun

	//Printf(formatted strings) %_ = format specifier
	fmt.Printf("my age is %v and my name is %v \n", age, name) //%v is the default format for variables
	fmt.Printf("my age is %q and my name is %q \n", age, name) //%q puts double quotes around variable
	fmt.Printf("age is of type %T \n", age)
	fmt.Printf("you scored %f points! \n", 255.55)
	fmt.Printf("you scored %0.1f points! \n", 255.55)

	//Sprintf (save formatted strings)
	var str = fmt.Sprintf("my age is %v and my name is %v \n", age, name)
	fmt.Println("the saved string is:", str)
}
```

Output
```
hello, world! 
new line 
hello ninjas!
goodbye ninjas!
my age is 35 and my name is shaun
my age is 35 and my name is shaun 
my age is '#' and my name is "shaun" 
age is of type int 
you scored 255.550000 points! 
you scored 255.6 points! 
the saved string is: my age is 35 and my name is shaun 
```