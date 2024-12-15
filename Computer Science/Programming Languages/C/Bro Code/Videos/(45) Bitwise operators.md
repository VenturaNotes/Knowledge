---
Source:
  - https://youtube.com/watch?v=BGeOwlIGRGI
---
```C
//Every time you shift a binary number to the left, it effectively doubles
//If we shift right, we are effectively cutting our number in half (it gets truncated)
//Also a complement operator

/*
The one's complement operator (~), sometimes called the bitwise complement operator, 
yields a bitwise one's complement of its operand. That is, every bit that is 1 in the 
operand is 0 in the result. Conversely, every bit that is 0 in the operand is 1 in the 
result. The operand to the one's complment operator must be an integral type
*/

#include <stdio.h>
 
int main()
{
   // BITWISE OPERATORS = special operators used in bit level programming
   //                                          (knowing binary is important for this topic)

   // & = AND
   // | = OR
   // ^ = XOR
   // <<  left shift
   // >>  right shift

   int x = 6;  //    6 = 00000110
   int y = 12; // 12 = 00001100 
   int z = 0;  //    0 = 00000000

   z = x & y;
   printf("AND = %d\n", z);

   z = x | y;
   printf("OR = %d\n", z);

   z = x ^ y;
   printf("XOR = %d\n", z);

   z = x << 2;
   printf("SHIFT LEFT = %d\n", z);

   z = x >> 2;
   printf("SHIFT RIGHT = %d\n", z);

   return 0;
}
```