---
Source:
  - https://www.youtube.com/watch?v=tjAa5VRuy6A
---
```c++
# include <iostream>

int main() {

    char op;
    double num1;
    double num2;
    double result;

    std::cout << "********* CALCULATOR ***********\n";

    std::cout << "Enter either (+ - * /): ";
    std::cin >> op;

    std::cout << "Enter #1: ";
    std::cin >> num1;

    std::cout << "Enter #2: ";
    std::cin >> num2;

    switch(op){
        case '+':
            result = num1 + num2;
            std::cout << "result: " << result << '\n';
            break;
        case '-':
            result = num1 - num2;
            std::cout << "result: " << result << '\n';
            break;
        case '*':
            result = num1 * num2;
            std::cout << "result: " << result << '\n';
            break;
        case '/':
            result = num1 / num2;
            std::cout << "result: " << result << '\n';
            break;
        default:
            std::cout << "That wasn't a valid operator\n";
            break;
    }

    std::cout << "**********************************";

    return 0;
}
```

Output
```
********* CALCULATOR ***********
Enter either (+ - * /): +
Enter #1: 3
Enter #2: 4
result: 7
**********************************
```
- Single quotes represents a character 
	- `case '+':`
		- So make sure the [[operator]] is within single quotes as it's a single character