---
Source:
  - https://youtube.com/watch?v=Ws-mVAJDFAw
---
```C
#include <stdio.h>
#include <string.h>

int main(){
    
    //Buffer overflow if you go above char 25. 
    char name[25]; //bytes
    int age;

    //Scanf function will read up to any white spaces
    printf("\nWhat's your name?");
    //scanf("%s", name); //No need for & in front of name

    fgets(name, 25, stdin); //allows for getting white spaces but puts newline character
    name[strlen(name)-1] = '\0'; //Removes the newline character

    printf("How old are you?");
    scanf("%d", &age); //age gets the address of input? 
    //& is address of operator


    printf("\nHello %s, how are you?", name);
    printf("\nYou are %d years old", age);

    return 0;
}
```
You can only get input from user in terminal. Not output. Go to "Code" -> "Preferences" -> "Settings" -> and find run in terminal for code runner.
