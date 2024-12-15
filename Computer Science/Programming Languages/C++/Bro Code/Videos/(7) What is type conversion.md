---
Source:
  - https://www.youtube.com/watch?v=Fj9HjbqHto8
---
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