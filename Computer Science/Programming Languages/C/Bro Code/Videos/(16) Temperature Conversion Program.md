[Video](https://youtube.com/watch?v=nrAP5w6hEWk)

```C
#include <stdio.h>

// declares a set of functions to classify (and transform) individual characters.
//This is required for toupper
#include <ctype.h>
 
int main(){
  
    char unit;
    float temp;

    printf("\nIs the temperature in (F) or (C)?: ");
    scanf("%c", &unit);

    unit = toupper(unit); //This ensures that the character is always capitalized

    if(unit == 'C'){
        printf("\nEnter the temp in Celsius: ");
        scanf("%f", &temp);
        temp = (temp * 9 / 5) + 32;
        printf("\nThe temp in Farenheit is: %.1f", temp);
    }
    else if(unit == 'F'){
        printf("\nEnter the temp in Farenheit: ");
        scanf("%f", &temp);
        temp = ((temp - 32) * 5) / 9;
        printf("\nThe temp in Celsius is: %.1f", temp);
    }
    else{
        printf("\n %c is not a valid unit of measurement", unit);
    }
   
    return 0;
}
```