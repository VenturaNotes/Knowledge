---
Source:
  - https://www.youtube.com/watch?v=LvfUeY4-_1k
Reviewed: false
---
- ![[Screenshot 2024-12-23 at 8.54.24 PM.png|500]]
	- Just calculating hypotenuse of a right triangle
```c++
#include <iostream>
#include <cmath>

int main() 
{
   double a;
   double b;
   double c;

   std::cout << "Enter side A: ";
   std::cin >> a;

   std::cout << "Enter size B: ";
   std::cin >> b;

   c = sqrt(pow(a, 2) + pow(b, 2));

   std::cout << "side C: " << c;

   return 0;
}
```

Output
```
Enter side A: 3
Enter size B: 4
side C: 5
```