---
Source:
  - https://www.youtube.com/watch?v=7bTZrFGRqGM
---
- Converting from Fahrenheit to Celsius and vice versa
```c++
#include <iostream>
 
int main()
{
    double temp;
    char unit;

    std::cout << "*** Temperature conversion *****\n";
    std::cout << "F = Fahrenheit\n";
    std::cout << "C = Celsius\n";
    std::cout << "What unit would you like to convert to: ";
    std::cin >> unit;

    if(unit == 'F' || unit == 'f'){
        std::cout << "Enter the temperature in Celsius: ";
        std::cin >> temp;

        temp = (1.8 * temp) + 32.0;
        std::cout << "Temperature is: " << temp << "°F\n";
    }
    else if(unit == 'C' || unit == 'c'){
        std::cout << "Enter the temperature in Fahrenheit: ";
        std::cin >> temp;

        temp = (temp - 32) / 1.8;
        std::cout << "Temperature is: " << temp << "°C\n";
    }
    else{
        std::cout << "Please enter in only C or F\n";
    }

    std::cout << "**********************************";

    return 0;
}
```
Output (Inserted 'c' and '30')
```
*** Temperature conversion *****
F = Fahrenheit
C = Celsius
What unit would you like to convert to: c
Enter the temperature in Fahrenheit: 30
Temperature is: -1.11111°C
**********************************
```