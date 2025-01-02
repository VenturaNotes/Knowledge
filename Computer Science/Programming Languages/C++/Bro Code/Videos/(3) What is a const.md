---
Source:
  - https://www.youtube.com/watch?v=MwQEaCsS6UM
Reviewed: false
---
```c++
#include <iostream>

int main() {

    const double PI = 3.14159;
    double radius = 10;
    double circumference = 2 * PI * radius;

    std::cout << circumference << "cm\n";

    return 0;
}
```
- The const keyword specifies that a variable's value is constant. Tells the compiler to prevent anything from modifying it. Read-only
	- A common naming convention for constants is to make all of the letters uppercase
- If you try to change a const variable later such as `PI = 420`
	- Then we will get the `error: assignment of read-only variable 'PI'`
- Speed of light could be a constant variable
	- width and height as well