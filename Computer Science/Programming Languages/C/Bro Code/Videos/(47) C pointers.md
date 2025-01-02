---
Source:
  - https://youtube.com/watch?v=DplxIq0mc_Y
Reviewed: false
---
```C
//A common naming convention for pointers is lowercase "p" + uppercase second "letter" for pointers.

/*
int age = 21;
int *pAge = &age;

The address of age is same as value of pAge
sizeof(pAge) is 8 bytes
doing *pAge dereferences it

*/
#include <stdio.h>

void printAge(int *pAge)
{
   printf("You are %d years old\n", *pAge); //dereference
}

int main()
{
   // pointer = a "variable-like" reference that holds a memory address to another variable, array, etc.
   //           some tasks are performed more easily with pointers
   //           * = indirection operator (value at address)

   int age = 21;
   int *pAge = &age;

   /*
   int age = 21;
   int *page = NULL; //good rpactice to assign NULL if declaring a pointer 
   pAge = &age;
   */

   printAge(pAge);

   //printf("address of age: %p\n", &age);
   //printf("value of pAge: %p\n", pAge);
   //printf("size of age: %d bytes\n", sizeof(age));
   //printf("size of pAge: %d bytes\n", sizeof(pAge));
   //printf("value of age: %d\n", age);
   //printf("value at stored address: %d\n", *pAge); //dereferencing

   return 0;
}
```
Advantages of Using Pointers
- Less time in program execution
- Working on the original variable
- With the help of pointers, we can create data structures (linked-list, stack, queue).
- Returning more than one values from functions.
- Searching and sorting large data very easily.
- Dynamically memory allocation
