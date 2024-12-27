---
Source:
  - https://www.youtube.com/watch?v=UiF-QgCBOhM
---
- Logical operators
	- && = check if two conditions are true
		- And logical operator
	- || = check if at least one of two conditions is true
		- Or logical operator
	- ! = reverses the logical state of its operand
		- Not logical operator
```c++
#include <iostream>

int main() 
{
   // && = check if two conditions are true
   // || = check if at least one of two conditions is true
   // !  = reverses the logical state of its operand

   int temp;
   bool sunny = false;

   std::cout << "Enter the temperature: ";
   std::cin >> temp;
   /*
   if(temp > 0 && temp < 30){
      std::cout << "The temperature is good!\n";
   }
   else{
      std::cout << "The temperature is bad!\n";
   }
   */
   if(temp <= 0  || temp >= 30){
      std::cout << "The temperature is bad!\n";
   }
   else{
      std::cout << "The temperature is good!\n";
   }

   if(!sunny){
      std::cout << "It is cloudy outside!";
   }
   else{
      std::cout << "It is sunny outside!";
   }

   return 0;
}
```
Output (Entered 200)
```
Enter the temperature: 200
The temperature is bad!
It is cloudy outside!
```