---
Source:
  - https://www.youtube.com/watch?v=4psGUiKacPQ
Reviewed: false
---
```c++
#include <iostream>

int main() {

    int x; //declaration
    x = 5; //assignment
    int y = 5; //declaration and assignment

    int sum = x + y;

    int age = 20; 
    double price = 10.99;
    char grade = 'A';
    bool student = true; 
    std::string name = "Bro";

    std::cout << "Hello " << name << "\n";
    std::cout << "You are " << age << " years old" "\n";

    std::cout << name << "\n";
    return 0;
}
```
- A [[variable]] is a representation of some number or value
	- Two steps to creating and using a variable
		- [[Declaration]]
		- [[Assignment]]
	- To declare a variable, need to list the data type of what we're storing exactly
		- Can store more than just numbers
			- Characters, whole sentences
	- Let's work with whole numbers
		- will type `int` for integer
		- Then need a unique identifier for this variable
			- We'll say `x`
	- To assign a variable, you take its name (that unique identifier), and then set it equal to a number
		- Variable will behave as if it was the value that it contains
	- Can use standard output to display the variable
	- Possible to combine declaration and assignment into a single step
- Could assign a value to a variable later such as when you accept user input
- Could sum values
- Now there are different data types depending on what you want to store within a variable exactly
	- `int` data type stores an integer (whole number)
		- Like age, year, and days
	- If you attempt to assign a number with decimals, the decimal portion will be truncated
		- So `7.5` would be truncated to `7` in C++
- Use a `double` to store a number including a decimal
	- Examples
		- price
		- GPA
		- temperature
- `char` data type stores a single character
	- Examples
		- `char grade = 'A';`
		- initials
		- currency 
	- If we try to store more than one character such as `BC`, then we would get an overflow in conversion warning from `int` to `char` (so what's displayed is just the last character)
- `boolean` data type `(true or false)`
	- Examples
		- student
		- power
		- forSale
- `string` (objects that represents a sequence of text)
	- Strings provided from standard name space `std::string`
	- Examples
		- Name
		- Day
		- Food
		- address
	- With strings, you can include numbers but they are treated differently
- Will type what is known as a string literal
	- We're literally printing a string
	- Follow string of text with a variable 
	- `std::cout << "Hello" << name;`