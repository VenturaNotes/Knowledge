---
Source:
  - https://www.youtube.com/watch?v=6am27D60i84
---
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