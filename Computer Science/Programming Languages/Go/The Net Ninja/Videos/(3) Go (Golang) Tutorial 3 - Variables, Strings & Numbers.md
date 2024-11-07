[Video](https://youtube.com/watch?v=98tQPM3R3qU)

Variables, Strings, and Numbers
```Go
package main

import "fmt" 

var someName = "hello"

// someName := "hello" (this won't work)

func main() {
	// strings
	var nameOne string = "mario" //Strings are double quotes
	var nameTwo = "luigi"        //Go can infer the type for us
	var nameThree string         //Default value is an empty string

	fmt.Println(nameOne, nameTwo, nameThree)

	nameOne = "peach"
	nameThree = "bowser"

	fmt.Println(nameOne, nameTwo, nameThree)

	nameFour := "yoshi" //can use colon for var keyword. Can't use outside function though
	fmt.Println(nameFour)

	//ints
	var ageOne int = 20
	var ageTwo = 30
	ageThree := 40
	fmt.Println(ageOne, ageTwo, ageThree)
	// bits & memory
	var eightBit int8 = 25  //This is 8 bits. Ranges from -128 to 127
	var sixteenBit int16 = 25 //This is 16 bits. Ranges from -32768 to 32767
	var thirtyTwoBit int32 = 25 //This is 32 bits. Ranges from -2147483648 to 2147483647
	var sixtyfourBit int64 = 25 //This is 64 bits. Ranges from -9223372036854775808 to 9223372036854775807
	fmt.Println(eightBit, sixteenBit, thirtyTwoBit, sixtyfourBit)

	var numOne int8 = 25
	var numTwo int8 = -128
	var numThree uint8 = 25 //unsigned int means we can't have a negative number. Goes from 0 to 255

	fmt.Println(numOne, numTwo, numThree)

	var scoreOne float32 = 25.98
	var scoreTwo float64 = 46464
	scoreThree := 1.5 //Inferred as float64r
	fmt.Println(scoreOne, scoreTwo, scoreThree)
}
```

Output
```
mario luigi 
peach luigi bowser
yoshi
20 30 40
25 25 25 25
25 -128 25
25.98 46464 1.5
```