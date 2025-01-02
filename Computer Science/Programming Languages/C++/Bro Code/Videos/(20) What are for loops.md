---
Source:
  - https://www.youtube.com/watch?v=gP22X_ykkxI
Reviewed: false
---
- A for loop is a loop that will execute a block of code a specified amount of 
```C++
#include <iostream>
 
int main()
{
	//index (counter) which is why it starts with "i"
	//stopping condition
	// Increment or decrement counter
   for(int i = 10; i > 0; i--){
      //count down to 10
      std::cout << i << '\n';
   }
 
   std::cout << "HAPPY NEW YEAR!\n";  
 
   return 0;
}

```
Output
```
10
9
8
7
6
5
4
3
2
1
HAPPY NEW YEAR!
```