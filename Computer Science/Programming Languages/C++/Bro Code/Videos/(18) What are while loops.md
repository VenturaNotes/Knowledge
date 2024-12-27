---
Source:
  - https://www.youtube.com/watch?v=XCxHhfJq1LU
---
```c++
#include <iostream>

int main() 
{
   std::string name;
   
   while(name.empty()){
      std::cout << "Enter your name: ";
      std::getline(std::cin, name);
   }
   
   std::cout << "Hello " << name;

   return 0;
}
```
- A while loop is kind of like an if statement except it can repeat some code infinitely as long as the condition remains true. 
	- Can force a user to do something to continue with the rest of the code. 
- Infinite loop is when a loop is impossible to escape. 