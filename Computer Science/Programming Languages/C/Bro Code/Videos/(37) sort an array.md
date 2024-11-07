[Video](https://youtube.com/watch?v=qLVrwCvVPGo)

```C
//size equals number of elements in array
//it's a bubble sort
//setting "size - i - 1" optimizes it so you don't need to go through
//       the entire array each time. This algorithm pretty much sorts from
//       right to left
//You can sort in reverse order by just changing array[j] > array[j+1]
//       to array[j] < array[j+1] in order to get descending order
#include <stdio.h>

void sort(char array[], int size)
{
   for(int i = 0; i < size - 1; i++)
   {
      for(int j = 0; j < size - i - 1; j++)
      {
         if(array[j] > array[j+1])
         {
            int temp = array[j];
            array[j] = array[j+1];
            array[j+1] = temp;
         }
      }
   }
}

void printArray(char array[], int size)
{
   for(int i = 0; i < size; i++)
   {
      printf("%c ", array[i]);
   }
}

int main()
{ 
   //int array[] = {9, 1, 8, 2, 7, 3, 6, 4, 5};
   char array[] = {'F', 'A', 'D', 'B', 'C'};
   int size = sizeof(array)/sizeof(array[0]);

   sort(array, size);
   printArray(array, size);
 
   return 0; 
}
```