---
Source:
  - https://www.youtube.com/watch?v=TdtFtPHeyZE
---
- A nested loop is a loop inside of another loop. Could be while or for loop
	- Common convention to use "j" for index of nested loop and "i" for index of outer loop
```c++
#include <iostream>
 
int main()
{
   int rows;
   int columns;
   char symbol;

   std::cout << "How many rows?: ";
   std::cin >> rows;

   std::cout << "How many columns?: ";
   std::cin >> columns;

   std::cout << "Enter a symbol to use: ";
   std::cin >> symbol;

   for(int i = 1; i <= rows; i++){
      for(int j = 1; j <= columns; j++){
         std::cout << symbol;
      }
      std::cout << '\n';
   }

   return 0;
}
```
Output
```
How many rows?: 3
How many columns?: 3
Enter a symbol to use: @
@@@
@@@
@@@
```