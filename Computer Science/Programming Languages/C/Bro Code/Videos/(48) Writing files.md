---
Source:
  - https://youtube.com/watch?v=UqB4EgUxapM
---
```C
// w: write (overrites any existing data)
// a: append
// r: read
// Can set relative or absolute file path for text folder

#include <stdio.h>

int main()
{
   // WRITE/APPEND A FILE
   FILE *pF = fopen("test.txt", "w");

   fprintf(pF, "Spongebob Squarepants");

   fclose(pF);
   
   // DELETE A FILE
   /*
   if(remove("test.txt") == 0)
   {
      printf("That file was deleted successfully!");
   }
   else
   {
      printf("That file was NOT deleted!");
   }
   */
   return 0;
}
```