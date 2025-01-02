---
Source:
  - https://youtube.com/watch?v=1eyf1-RU_eg
Reviewed: false
---
```c
#include <stdio.h>
#include <stdbool.h> //So we can work with booleans in 4

int main(){

    char a = 'C'; //single character %c
    char b[] = "Bro"; //array of characters %s

    float c = 3.141592; //4 bytes (32 bits of precision) 6 - 7 significant digits %f
    double d = 3.141592653589793; // 8 bytes (64 bits of precision) 15 - significant 16 digits %lf

    //1 represents true and 0 represents false
    //We technically only need one bit, but here it's one byte
    //possible to display the word true or false
    // Works in binary
    bool e = true; //1 byte (true or false) %d

    //Can be displayed as decimal/integer or character
    //to display number as character, but use ascii table for conversion
    //By default, most data types are already signed so we don't need to explicitly type that
    //You can store multiple characters in array as well by doing char[] f = LOL
    char f = 100; //1 byte (-128 to +127) %d or %c

    //Effectively double the range of positive numbers that you can store within a variable
    unsigned char g = 255; //1 byte (0 to +255) %d or %c

    //Going beyond range will cause an overflow
    // setting h = 23768 will return -32768 going towards the lowest possible number
    //Don't need to explicitly include "int" in creating the data type
    short int h = 32767; //2 bytes (-32,768 to +32,767) %d
    unsigned short int i = 65535; //2 bytes (0 to +65,535) %d



    //To display an unsigned integer, you should use %u
    //Exceeding the range would cause overflow and reset #s to minimum values
    int j = 2147483647; //4 bytes (-2,147,483,648 to +2,147,483,647) %d
    unsigned int k = 4294967295L; //4 bytes (0 to +4,294,967,295) %u

    //Standard integer is already considered long. An int j; is really long int j;
    //A quintillion is 10^18
    long long int l = 9223372036854775807; //8 bytes (-9 quintillion to +9 quintillion) %lld

    //Warning: integer constant is so large that it is unsigned
    //To prevent this warning, add a U to end of large number
    unsigned long long int m = 18446744073709551615U; // 8 bytes (0 to +18 quintillion) %llu

    printf("%c\n", a); // char
    printf("%s\n", b); // character array
    printf("%f\n", c); // float

    //lf means long float
    //When displaying a float, will only print 6-7 digits so we get 3.141593
    printf("%lf\n", d); // double

    //Example #2
    printf("%0.15f\n", c); //Inaccurate on 7th digit afte decimal
    printf("% 0.15lf\n", d); //Double will retain numbers


    printf("%d\n", e); // bool


    //Will display as 100
    printf("%d\n", f); // char as numeric value

    //Corresponding character is lowercase d
    printf("%c\n", f); // char as numeric value

    //to display unsigned character
    //255
    //If you go beyond maximum range, it will reset to 0. So 256 is 0
    printf("%d\n", g); // unsigned char as numeric value


    printf("%d\n", h); // short
    printf("%d\n", i); // unsigned short
    
    printf("%d\n", j); // int
    printf("%u\n", k); // unsigned int
    
    
    printf("%lld\n", l); // long long int
    printf("%llu\n", m); // unsigned long long int


    return 0;
}
```

Types of data
![[Screenshot 2022-11-07 at 1.57.15 PM.png]]

Converts numbers to character representation
![[Screenshot 2022-11-07 at 2.26.33 PM.png]]

