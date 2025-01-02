---
Source:
  - https://www.youtube.com/watch?v=KTr0SZTW9nI
Reviewed: false
---
```c++
// Online C++ compiler to run C++ program online
#include <iostream>

int main() {
    std::string name;
    
    std:: cout << "Enter your name: ";
    //getline helps with whitespaces
    std::getline(std::cin, name);
    
    //name.length() Will give length of string
    // When you invoke this method, length of string
    // will be returned
    std::cout << name.length() << "\n";
    
    //name.empty() will return if a string is empty or not
    //Returns a boolean value
    std:: cout << name.empty() << "\n";
    
    //Clears the string
    name.clear();
    
    //appends string to another string
    name.append("@gmail.com");
    
    // Can return a character at a given position
    // in a string. First index is returned.
    std::cout << name.at(0) << "\n";
    
    //Inserts character at specific position
    name.insert(0, "test ");
    
    //Search for a specific character in string
    // This one looks for whitespaces
    // Gives position of first space.
    std::cout << name.find(' ') << "\n";
    
    // Erases portion of string
    //This one removes the first 3 characters
    //Second index not included.
    name.erase(0, 3);
    
    std::cout << name << "\n";

    return 0;
}
```
Output
```
Enter your name: Test me out
11
0
@
4
st @gmail.com
```
- If you would like to know more string methods
	- https://www.cplusplus.com/reference/string/string