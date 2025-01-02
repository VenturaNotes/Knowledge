---
Source:
  - https://youtube.com/watch?v=swICwi6dGN0
Reviewed: false
---
```c
#include <stdio.h>
#include <stdbool.h>  //Required for boolean variables
 
int main(){
 
    // logical operators = && (AND) checks if two or more conditions are true
    
    float temp = 25;
    bool sunny = true;

    if(temp >= 0 && temp <= 30 && sunny){
        printf("\nThe weather is good!");
    }
    else{
        printf("\nThe weather is bad!");
    }
   
    return 0;
}
```