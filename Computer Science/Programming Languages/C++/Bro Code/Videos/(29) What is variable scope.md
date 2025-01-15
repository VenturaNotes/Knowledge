---
Source:
  - https://www.youtube.com/watch?v=Q7ZFHAO-oxI
Reviewed: false
---
- [[Local variable (C++)|Local variable]] = declared inside a function or block {}
	- Such as in main function or inside another function
- [[Global variable]] = declared outside of all functions
	- Tend to be seen at top of program
```c++
#include <iostream>

int myNum = 3; //global

void printNum();

int main()
{
    int myNum = 1; //local
    printNum(); //This invokes the function
    std::cout << "main: " << myNum << '\n'; //local
    //std::cout << ::myNum << '\n'; //global

    return 0;
}
void printNum(){
    int myNum = 2; //local
    std::cout << "printNum: "<< myNum << '\n'; //local
    //std::cout << ::myNum << '\n'; //global
}
```
- Functions can't see inside of other functions
	- That's why we pass arguments to functions (such as doing `printNum(myNum)`)
	- Legal to use same variable name as long as it's within a different [[scope]]
	- Best to avoid global variables if you can because it pollutes the global namespace
- Also variables declared within a function much more secure because functions can't see inside other functions
	- A function will use any local variables first before resorting to any global variables
- If you'd rather use the global variable than the local, you can use the [[scope resolution operator]]. So precede your variable name with two colons
	- `//std::cout << ::myNum << '\n'; //global` inside a function with a local variable named `myNum` will still use the global variable value. 
- Global variables accessible to all functions within program
Output
```
printNum: 2
main: 1
```