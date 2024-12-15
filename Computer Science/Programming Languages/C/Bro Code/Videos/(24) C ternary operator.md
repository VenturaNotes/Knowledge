---
Source:
  - https://youtube.com/watch?v=NstoL1ngTp8
---
```C
/*
The ternary operator simplifies the below statement

if (x > y)
{
    return x;
}
else
{
    return y;
}
*/

#include <stdio.h>

int findMax(int x, int y)
{
   return (x > y) ? x : y;
}

int main()
{
   // ternary operator = shortcut to if/else when assigning/returning a value
   // (condition) ? value if true : value if false

   int max = findMax(3, 4);

   printf("%d", max);
  
   return 0;
}
```