---
Source:
  - https://www.youtube.com/watch?v=kO3eEn_hgQc
Reviewed: false
---
```c++
#include <iostream>
#include <cmath>

int main() 
{
  // if statement = do something if a condition is true.
  //                if not, then don't do it
  
  int age;
  
  std:: cout << "Enter your age: ";
  std::cin >> age;
  
  if (age >= 100){
      std::cout << "You are too old to enter this site!";
  }
  else if (age >= 18){
      std::cout << "Welcome to the site!";
  }
  else if (age < 0){
      std::cout << "You haven't been bon yet!";
  }
  else{
      std::cout << "You are not old enough to enter!";
  }

   return 0;
}
```
- [[comparison operator (python)|comparison operator]] examples
	- >=
	- <=
	- <
	- >
	- ==
- [[Assignment operator]]: =
