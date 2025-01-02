---
Source:
  - https://youtube.com/watch?v=CI9dRTvzgqE
Reviewed: false
---
```C
// you can use structs to assign each member in order.
// Struct members are stored in the order they are declared.
#include <stdio.h> 
#include <string.h>

typedef char user[25];

typedef struct
{
   char name[25];
   char password[12];
   int id;
} User;

int main() 
{
   // typedef = reserved keyword that gives an existing datatype a "nickname"


   /*
   If the struct was not typedef, you would need below:
   struct User user1 = {"Bro", "password123", 123456789};
   */

   user user3 = "Hello";
   printf("%s\n", user3);


   User user1 = {"Bro", "password123", 123456789};
   User user2 = {"Bruh", "password321", 987654321};

   printf("%s\n", user1.name);
   printf("%s\n", user1.password);
   printf("%d\n", user1.id);
   printf("\n");
   printf("%s\n", user2.name);
   printf("%s\n", user2.password);
   printf("%d\n", user2.id);

   return 0; 
}
```