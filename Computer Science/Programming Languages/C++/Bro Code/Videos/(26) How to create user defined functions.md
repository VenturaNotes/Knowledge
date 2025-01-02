---
Source:
  - https://www.youtube.com/watch?v=6SnxFx9aRps
Reviewed: false
---
- function
	- A block of reusable code
```C++
#include <iostream>

// Declaring function earlier on so that it can be 
// used in main method. Otherwise, won't work if happyBirthday
// function is below main function.
void happyBirthday(std::string name, int age);

int main()
{
    std::string name = "Bro";
    int age = 21;

	//This will call or invoke the function happyBirthday
    happyBirthday(name, age);

    return 0;
}

//When you send some data over to a function, that data is also
// known as an argument. However, the receiving function (below) needs
//a matching set of what are called parameters (in both the
// function definition and function declaration). To set up a parameter
// first need the data type.

// Functions aren't aware of what's going on inside of other functions
// But you can make them aware of any local variables or values by 
// passing them as an argument, but you'll need a matching set of parameters
// paramter name and argument name can be different.

void happyBirthday(std::string name, int age){
    std::cout << "Happy Birthday to " << name << '\n';
    std::cout << "Happy Birthday to " << name << '\n';
    std::cout << "Happy Birthday dear " << name << '\n';
    std::cout << "Happy Birthday to " << name << '\n';
    std::cout << "You are " << age << " years old!\n";
}
```
Output
```
Happy Birthday to Bro
Happy Birthday to Bro
Happy Birthday dear Bro
Happy Birthday to Bro
You are 21 years old!
```