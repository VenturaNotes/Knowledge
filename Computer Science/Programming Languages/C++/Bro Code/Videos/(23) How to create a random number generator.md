---
Source:
  - https://www.youtube.com/watch?v=bYEdLCWJeHA
Reviewed: false
---
- pseudo-random = NOT truly random (but close)
	- Great for simple game
```c++
#include <iostream>

int main()
{
	//programmers typically use current calendar time as a seed
    srand(time(NULL));

	//This will generate a random number between 0 and 32767
	//int num = rand()

    int num1 = (rand() % 6) + 1;
    int num2 = (rand() % 6) + 1;
    int num3 = (rand() % 6) + 1;

    std::cout << num1 << '\n';
    std::cout << num2 << '\n';
    std::cout << num3 << '\n';

    return 0;
}
```
Output
```
1
1
2
```