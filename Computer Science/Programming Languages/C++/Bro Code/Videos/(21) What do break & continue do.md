---
Source:
  - https://www.youtube.com/watch?v=D2aQITtBhMM
---
- ![[Screenshot 2024-12-26 at 7.33.57 PM.png|400]]
	- May see the "break" keyword in a switch statement
```c++
#include <iostream>

int main()
{
    // break = break out of a loop (won't finish rest of iterations)
    // continue = skip current iteration (will finish other iterations)

    for(int i = 1; i <= 20; i++){
        if(i == 13){
            //break;
            //continue;
        }
        std::cout << i << '\n';
    }

    return 0;
}
```
Output
```
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
```