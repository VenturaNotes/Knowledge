---
Source:
  - https://www.youtube.com/watch?v=3xcXse7DK5s
---
- do while loop = do some block of code first, then repeat again if condition is true.
```c++
#include <iostream>
 
int main()
{
   int number; //defaults to 0

   do{
      std::cout << "Enter a positive #: ";
      std::cin >> number;
   }while(number < 0);

   std::cout << "The # is: " << number;

   return 0;
}


```
- A do while loop could be used if a user would like to play a game again
Output
```
Enter a positive #: 27
The # is: 27
```