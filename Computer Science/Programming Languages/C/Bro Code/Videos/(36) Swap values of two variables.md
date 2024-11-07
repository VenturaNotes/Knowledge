[Video](https://youtube.com/watch?v=CV74aNbKrpo)

```C
// When working with arrays, it's not enough to simply assign values when copying
//       you will just get an "expression must be a modifiable lvalue" error     
// When using the strcpy function, if we use the length of the 2nd argument is less than the
//       first argument, it can lead to unexpected behavior. One solution is to make character 
//       arrays the same size

#include <stdio.h>
#include <string.h>

int main()
{ 
   
   /* Personal test
   char test1[13] = "friends for";

   char test2[13] ="X";
   char test3[13];

   test3[0] = test1[0]; //This would only take the first letter

   printf("%s", test3);
   */


   //------- Example 1 -------
   //char x = 'X';
   //char y = 'Y';
   //char temp;

   //temp = x;
   //x = y;
   //y = temp;

   //printf("x = %c\n", x);
   //printf("y = %c\n", y);

   //------- Example 2 -------
   char x[15] = "water";
   char y[15] = "soda";
   char temp[15];

   strcpy(temp, x);
   strcpy(x, y);
   strcpy(y, temp);

   printf("x = %s\n", x);
   printf("y = %s\n", y);
 
   return 0; 
}
```