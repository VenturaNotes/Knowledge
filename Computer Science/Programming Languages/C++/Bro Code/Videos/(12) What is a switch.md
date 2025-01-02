---
Source:
  - https://www.youtube.com/watch?v=Bx9b12FCF5o
Reviewed: false
---
- switch
	- alternative to using many "else if" statements. Compare one value against matching cases
- Better than using a bunch of `else if` statements to check each individual character for the grade. 
- A switch is more efficient and easier to read
- If no matching cases, we can execute a default case
```c++
#include <iostream>

int main() 
{	
   char grade;

   std::cout << "What letter grade?: ";
   std::cin >> grade;

// What value would you like to examine against matching cases?
   switch(grade){
      case 'A':
         std::cout << "You did great!";
         break;
      case 'B':
         std::cout << "You did good";
         break;
      case 'C':
         std::cout << "You did okay";
         break;
      case 'D':
         std::cout << "You did not do good";
         break;
      case 'F':
         std::cout << "YOU FAILED!";
         break;
      default:
         std::cout << "Please only enter in a letter grade (A-F)";
   }

   return 0;
}
```