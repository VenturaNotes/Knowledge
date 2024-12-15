---
Source:
  - https://youtube.com/watch?v=Vh4krbTnTAA
---
```C
//first set of straight brackets is # of rows
//second set of straight brackts is # of columns

#include <stdio.h>

int main()
{
   // 2D array = an array, where each element is an entire array
   //            useful if you need a matrix, grid, or table of data
   /*
   int numbers[2][3] = {
                        {1, 2, 3},
                        {4, 5, 6}
                       };
   */
   int numbers[2][3]; //You must set maximum size of array when declaring
   
   //You don't need to set a maximum size for single array
   //when declaring and initializing (but you need it for just declaring)
   //int test[] = {3,5,6,7};

   //Gets the size of array

   //printf("%lu\n", sizeof(numbers[0])); //returns 12 bytes and each one is 4 bytes because integer
   int rows = sizeof(numbers)/sizeof(numbers[0]);

   //This finds the row and tells you how many columns in it
   int columns = sizeof(numbers[0])/sizeof(numbers[0][0]);


   printf("rows: %d\n", rows);
   printf("columns: %d\n", columns);

   numbers[0][0] = 1;
   numbers[0][1] = 2;
   numbers[0][2] = 3;
   numbers[1][0] = 4;
   numbers[1][1] = 5;
   numbers[1][2] = 6;

   for(int i = 0; i < rows; i++)
   {
      for(int j = 0; j < columns; j++)
      {
         printf("%d ", numbers[i][j]);
      }
      printf("\n");
   }

   return 0;
}
```