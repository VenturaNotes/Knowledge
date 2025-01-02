---
Source:
  - https://youtube.com/watch?v=-2tM7L_9cHQ
Reviewed: false
---
```C
#include <stdio.h>
#include <stdbool.h>  
 
int main(){
 
    // logical operators = || (OR) checks if at least one codition is true
    
    float temp = 25;

    if(temp <= 0 || temp >= 30){
        printf("\nThe weather is bad!");
    }
    else{
        printf("\nThe weather is good!");
    }
   
    return 0;
}
```