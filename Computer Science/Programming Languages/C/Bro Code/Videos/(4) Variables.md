[Video](https://youtube.com/watch?v=aIQk1O08zpg)

```c

#include <stdio.h>
int main(){

    //variable = Allocated space in memory to store a value. 
    //           We refer to a variable's name to access the stored value.
    //           That variable now behaves as if it was the value it contains.
    //           BUT we need to declare what type of data we are storing.

    //Declaring a variable only takes 2 steps. Declaration and initialization

    //int represents integer
    int x; //declaration
    x = 123; //initialization
    int y = 321; //declaration + initialization

    //Make sure variable name is descriptive of what it does or follows a conventional standard
    int age = 21; //integer

    //num with decimal
    float gpa = 2.05; //floating point number

    //Must use single quotes for one character
    char grade = 'C'; //single character
    char name[] = "Bro"; //array of characters

    //Strings are technically objects
    //There is many more data types than what is shown above.
    //There is bytes, doubles and longs are other examples of data types


    //Format specifiers include
    //to use variables in strings
    //%s is string
    //%d is signed decimal integer (signed means positive or negative)
    //%i is integer
    //%c is character
    //%f is float
    //There is no difference between the %i and %d format specifiers for printf
    //for scanf, %d assumes base 10 while %i auto detects the base
    printf("Hello %s\n", name);
    printf("you are %d years old\n", age);
    printf("Your average grade is %c\n", grade);
    printf("Your gpa is %f\n", gpa);

    return 0;
}
```

List of escape sequences
![[Screenshot 2022-11-07 at 1.52.20 PM.png]]
