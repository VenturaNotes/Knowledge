[Video](https://youtube.com/watch?v=shLeCvDQYp4)

```C
// sizeof operator is in bytes
#include <stdio.h>

int main()
{
   double prices[] = {5.0, 10.0, 15.0, 25.0, 20.0, 30.0};
   
   printf("%lu bytes\n", sizeof(prices)); //total is 48 bytes and each cell is 8 bytes
   //printf("%.2lf\n", prices[0]); // prints out first element of prices[]

   for(int i = 0; i < sizeof(prices)/sizeof(prices[0]); i++)
   {
      printf("$%.2lf\n", prices[i]);
   }

   return 0;
}
```