---
Source:
  - https://youtube.com/watch?v=9E3I1URu6fc
Reviewed: false
---
```C
#include <stdio.h>

int main(){
    
    //aritmetic operators

    // + (addition)
    // - (subtraction)
    // * (multiplication)
    // / (division)
    // % (modulus)
    // ++ increment
    // -- decrement

    int x = 5;
    int y = 2;

    int a = x + y; //7
    int b = x - y; //3
    int c = x * y; //10
    
    //Answer will be truncated
    int d = x / y; //2  Storing the result within an integer. With integers, you can only store whole numbers

    printf("%d\n", a);
    printf("%d\n", b);
    printf("%d\n", c);
    printf("%d\n", d);

    //To fix division
    //You could change divisor to a float
    //divisor is bottom part of division equation
    //dividend is top part of equation
    //We could precede the divisor with a float or double
    //May need to cast divisor as float or double
    float e = x / (float) y;
    printf("%f\n", e);

    //Modulus gives remainder of division
    //By doing modulus 2, we can find out if a number is even or odd 
    int f = x % y;
    printf("%d\n", f);

    //Increases x by 1
    //Decreases y by 1
    x++;
    y--;
    printf("%d\n", x);
    printf("%d\n", y);

    return 0;
}
```