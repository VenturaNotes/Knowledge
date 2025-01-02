---
Source:
  - https://youtube.com/watch?v=HuKYb1yN7Ik
Reviewed: false
---
```C
//the type of variable returned needs to be the same as the function type
//this is why the main function is "int" since it returns an integer

#include <stdio.h>

double square(double x)
{
   double result = x * x;
   return result;
}

int main()
{
   double x = square(3.14);
   printf("%lf", x);

   return 0;
}
```