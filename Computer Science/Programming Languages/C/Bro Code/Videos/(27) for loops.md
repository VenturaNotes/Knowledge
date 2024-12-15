---
Source:
  - https://youtube.com/watch?v=b4DPj0XAfSg
---
```C
//The i typically stands for index

#include <stdio.h>

int main()
{
   // for loop = repeats a section of code a limited amount of times
   // There's up to 3 statements we can add
   // Declare an index (counter)
   // Some condition we check after each iteration
   // Some way to increment or decrement index

    // This prints 10 times counting up by 1
   for(int i = 1; i <= 10; i++)
   {
      printf("%d\n", i);
   }

    // This counts up by 2
   for(int i = 1; i <= 10; i+=2)
   {
      printf("%d\n", i);
   }

    // This will decement by 1
   for(int i = 10; i >= 1; i--)
   {
      printf("%d\n", i);
   }

   return 0;
}
```