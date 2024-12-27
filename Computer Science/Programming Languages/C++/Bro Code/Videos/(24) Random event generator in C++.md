---
Source:
  - https://www.youtube.com/watch?v=JLIF5XHBL3E
---
- #question Why do we need `ctime` for this problem?
- #questoin why do we need break statements?
```c++
#include <iostream>
#include <ctime>

int main()
{
    srand(time(0));
    int randNum = rand() % 5 + 1;

    switch(randNum){
        case 1: std::cout << "You win a bumper sticker!\n";
                break;
        case 2: std::cout << "You win a t-shirt!\n";
                break;
        case 3: std::cout << "You win a free lunch!\n";
                break;
        case 4: std::cout << "You win a gift card!\n";
                break;
        case 5: std::cout << "You win concert tickets!\n";
                break;
    }

    return 0;
}
```
Output
```
You win a bumper sticker!
```