[Video](https://youtube.com/watch?v=CJ37J_Cdd8Q)

```C
//"s" is for seed, "rand" is for random.
// "srand(time(0))" is the current time as a seed for random numbers
// the rand() function will give a random # between 0 to 32,767

#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main()
{
   //pseudo random numbers = A set of values or elements that is statistically random
   //                        (Don't use these for any sort of cryptographic security)
 
   // Use current time as a seed for random # generator
   srand(time(0));
 
   // rand() generates a pseudo random # between 0 - 32,767
   int number1 = (rand() % 6) + 1;
   int number2 = (rand() % 6) + 1;
   int number3 = (rand() % 6) + 1;
 
   printf("%d\n", number1);
   printf("%d\n", number2);
   printf("%d\n", number3);
 
   return 0;
}
```