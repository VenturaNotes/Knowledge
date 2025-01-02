---
Source:
  - https://www.youtube.com/watch?v=d89IvsCh__E
Reviewed: false
---
- return
	- return a value back to the spot where you called the encompassing function
- Return value is typically found at end of function where you can return a value back. 
- If returning something, the function type needs to match the return type. 
	- So if returning a `double`, the function should be `double square()` for example

Example 1 (Gets age input and returns true or false if 18 or older)
```C++
#include <iostream>

// Function to check if age is 18 or over
bool isAdult(int age) {
    if (age >= 18) {
        return true;
    } 
    else {
        return false;
    }
}

int main() {
    int age = 0;

    std::cout << "Enter your age: ";
    std::cin >> age;

    if (isAdult(age)) {
        std::cout << "You are an adult" << std::endl;
    } 
   else {
        std::cout << "You are a child" << std::endl;
    }

    return 0;
}
```

Output
```
Enter your age: 25
You are an adult
```

Example 2 (calculating area of square and volume of cube)
```c++
#include <iostream>

double square(double length);
double cube(double length);

int main()
{
    double length = 6.0;
    double area = square(length);
    double volume = cube(length); //invoking cube function

    std::cout << "Area: " << area << "cm^2\n";
    std::cout << "Volume: " << volume << "cm^3\n";

    return 0;
}
double square(double length){
    return length * length;
}
double cube(double length){
    return length * length * length;
}
```

Output
```
Area: 36cm^2
Volume: 216cm^3
```

Example 3 (concatenates names)
```C++
#include <iostream>
 
std::string concatString(std::string string1, std::string string2);
 
int main()
{
    std::string firstName = "Bro";
    std::string lastName = "Code";
    std::string fullName = concatString(firstName, lastName);
 
    std::cout << "Hello " << fullName;
 
    return 0;
}
std::string concatString(std::string string1, std::string string2){
    return string1 + " " + string2;
}
```

Output
```
Hello Bro Code
```