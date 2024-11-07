[Video](https://youtube.com/watch?v=Y17nTXAWBqs)

```c
#include <stdio.h>

int main(){
  
    //constants = fixed value that cannot be altered by the program during its execution

    //Constants should have all the letters uppercased
    //Provides a little bit of security
    //This now prevents PI from changing later in the program
    const float PI = 3.14159;

    // PI = 420.69  //This line of code will not work

    printf("%f", PI);

    
    return 0;
}
```