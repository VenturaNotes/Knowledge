---
Source:
  - https://youtube.com/watch?v=1KVpi0VN82E
---
```C
#include <stdio.h>
 
int main()
{
   // memory = an array of bytes within RAM (street)
   // memory block = a single unit (byte) within memory (house), used to hold some value (person)
   // memory address = the address of where a memory block is located (house address)

   char a;
   char b[2000000];

   printf("%lu bytes\n", sizeof(a));
   printf("%lu bytes\n", sizeof(b));

   printf("%p\n", &a);
   printf("%p\n", &b);

   // Decimal: 0-9
   // (1,2,3,4,5,6,7,8,9)

   //Hexadecimal: 0 - 9 + A - F
   //(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F)

   return 0;
}
```