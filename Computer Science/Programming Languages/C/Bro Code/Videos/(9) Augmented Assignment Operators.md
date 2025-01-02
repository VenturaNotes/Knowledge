---
Source:
  - https://youtube.com/watch?v=btgyQ-b3aYI
Reviewed: false
---
```c

#include <stdio.h>

int main(){
    // augmented assignment operators = used to replace a statement where an operator
    //                                  takes a variable as one of its arguments
    //                                  and then assigns the result back to the same variable
    //                                  x = x + 1
    //                                  x+=1


    int a = 10;
    int b = 10;
    int c = 10;
    int d = 10;
    int e = 10;

    a = a +2; //12
    a+=2;

    b = b -3; //7
    b-=3;

    c = c * 4; //40
    c*=4;

    d = d / 5; //2
    d/=5;

    e =e % 2; //0
    e%=2;

    return 0;
}
```