[Video](https://youtube.com/watch?v=8Vt9k0bh_Q8)

``` C
#include <stdio.h>
int main(){


    /* escape sequence = character combination consisting of a backslash \
                        followed by a letter or combination of digits.
                        They specify actions within a line or string of text.
                        \n = newline
                        \t = tab
    */

    // This is a single-line comment blah

    /* Can also write in front of it
        This
        is
        a
        multiline
        comment
    */
    printf("I \nlike \n pizza!\n");

    //Numbers below are spaced with tabs
    printf("1\t2\t3\n\n");

    //Grid of numbers spaced evenly
    printf("1\t2\t3\n4\t5\t6\n7\t8\t9\n");

    //Use escape character for double quotes
    printf("\"I like pizza\" - Abraham Lincoln probably");
    return 0; 
}

/*
- Comment is some text ignored by compiler that is used as an explanation, description, or a note
for yourself or anyone else reading over your code

*/
```