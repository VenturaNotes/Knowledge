[Video](https://youtube.com/watch?v=7VM571tSKC0)

```c
//anything you pass into a function is known as an argument (in main)
//parameters are what the function needs to be executed (in birthday)

//Arguments are what you're sending a function
//A parameter is what a function expects when it's invoked
//Benefits is that the functions can talk to each other since they can't see what's inside each other


#include <stdio.h>

void birthday(char x[], int y)
{
   printf("\nHappy birthday dear %s!", x);
   printf("\nYou are %d years old!", y);
}

int main()
{
   char name[] = "Bro";
   int age = 21;

   birthday(name, age);

   return 0;
}
```