---
Source: ["https://www.youtube.com/watch?v=6am27D60i84"]
Source2: ["https://www.youtube.com/watch?v=Fj9HjbqHto8"]
Source3: ["https://www.youtube.com/watch?v=imiIhu9u670"]
---

# (6) What are arithmetic operators

```c++
#include <iostream>

int main() {

    int students = 20;
    //students = students + 1;
    //students+=1; //shorthand way of writing above
    students++; //increment operator
    students--; //decrement operator

    students *= 3;
    students /=3;

    int remainder = students %3;
    // Given students = 20, the remainder would be 2
    // We are dividing our group of 20 students into groups of 3 with 2 remainder

    std::cout << remainder << '\n';

    return 0;
}
```
- Arithmetic operators = return the result of a specific arithmetic operation `(+ - * /)`
- Multiplication uses an asterisk
- Division uses forward slash
- If you divide an `int`, any decimal portion will be lost (truncated)
	- `20/3 = 6`
- If we change variable to `double`, then the decimal portion is retained
	- `20/3 = 6.66667`
- If you need remainder of division, use modulus operator
	- Using a modulus operator is also a great way to find out if a number is even or odd
	- By doing `% 2`, with remainder 0, it's even. If remainder is 1, it's odd
- The arithmetic operators have an order of precedence
	- We resolve arithmetic operations in this order:
		- parentheses
		- multiplication & division
		- addition & subtraction
	- `6 - 5 + 4 * 3 / 2 = 7`
	- `6 - (5 + 4) * 3 / 2 = -7


# (7) What is type conversion

```c++
#include <iostream>

int main() {

    int correct = 8;
    int questions = 10;
    double score = correct/(double) questions * 100;

    std::cout << score << "%\n";

    return 0;
}
// Output = 80%
```
- ![[Screenshot 2024-12-14 at 3.33.35 AM.png]]
- [[type conversion]] = conversion of a value of one data type to another
	- Implicit = automatic
	- Explicit = Precede value 
- Integers can only hold a whole number
	- Doing `int x = 3.14` we get value of `3` as we truncated the decimal portion and implicitly converted this number into an integer
	- `double x = (int) 3.14`
		- If we cast 3.14 as an integer and then assigned it to a double variable
		- This is an example of explicit type conversion
	- Doing `char x = 100;` and displaying it, we will implicitly cast this number 100 as a character. Will be converted using [[ASCII table]]
		- This is the letter `d`
		- This would be an implicit cast
	- `std::cout << (char) 100`
		- This is explicitly cast to a character
	- Doing integer division will always truncate the decimal so `8/10` would equal 0
		- `int correct = 8;`
		- `int questions = 10;`
		- `double score = correct/(double) questions * 100;`
			- Explicitly casting questions as a double "of the double data type" 
		- `std:: cout << score << "%";`
		- Result is 80% here
	- Type conversion great for integer division


# (8) How to accept user input in C++

```c++
#include <iostream>

// cout << (insertion operator) 
// cin >> (extraction operator) //accepts input

int main()
{
	std::string name;
	int age;
	
	std::cout << "What's your age?: ";
	std::cin >> age; //In our input buffer, there is a newline character
	// When we get to the getline function, it accepts the '\n' from within the buffer

	std::cout << "What's your full name?: ";
	//std::cin >> name; //Having a name like "Bro Code", won't work with spaces
	//std::getline(std::cin, name); //Works with whitespaces
	
	//Portion eliminates any new line characters or any whitespaces before
	// any user input
	std::getline(std::cin >> std::ws, name);


	std::cout << "Hello " << name << '\n';
	std::cout << "You are " << age << " years old";

	return 0;
}
```
- Accepting user input in C++
- `cin` stands for character input
	- For character input, go to "Code-runner: Run in Terminal" in "Settings"
		- Set checkmark for "Whether to run code in Integrated Terminal"


