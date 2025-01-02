---
Source:
  - https://youtube.com/watch?v=ZAdgoWlX1v0
Reviewed: false
---
Nested Loops [^1]
```C
//it is common to do i,j,k for the alphabet
// we have a new line character in input buffer after "&columnns" so the next scanner function
//              actually picked that up. To clear the buffer, you can just do "scanf()" again to
//              read a character. It gets rid of the "\n" character (but will give a warning)

#include <stdio.h>

int main()
{
   //nested loop = a loop inside of another loop

   int rows;
   int columns;
   char symbol;

   printf("\nEnter # of rows: ");
   scanf("%d", &rows);

   printf("Enter # of columns: ");
   scanf("%d", &columns);

   // scanf("%c%*c", &symbol); is supposed to work but doesnt?
   //fflush(stdin); //flushes the output buffer so "&symbol" is possible


   //scanf("%c"); //clears \n from buffer (but will give a warning)

   printf("Enter a symbol to use: ");
   scanf(" %c", &symbol); //Adding a space gets rid of the \n?

   for(int i = 1; i <= rows; i++)
   {
      for(int j = 1; j <= columns; j++)
      {
         printf("%c", symbol);
      }
      printf("\n");
   }

   return 0;
}
```

Control+C on mac kills program in terminal

## References

[^1]: https://stackoverflow.com/questions/1669821/scanf-skips-every-other-while-loop-in-c