---
Source:
  - https://www.youtube.com/watch?v=imiIhu9u670
Reviewed: false
---
```c++
#include <iostream>

// cout << (insertion operator) 
// cin >> (extraction operator) //accepts input

int main()
{
	std::string name;
	int age;
	
	std::cout << "What's your age?: ";
	std::cin >> age; //In our input buffer, there is a newline character
	// When we get to the getline function, it accepts the '\n' from within the buffer

	std::cout << "What's your full name?: ";
	//std::cin >> name; //Having a name like "Bro Code", won't work with spaces
	//std::getline(std::cin, name); //Works with whitespaces
	
	//Portion eliminates any new line characters or any whitespaces before
	// any user input
	std::getline(std::cin >> std::ws, name);


	std::cout << "Hello " << name << '\n';
	std::cout << "You are " << age << " years old";

	return 0;
}
```
- Accepting user input in C++
- `cin` stands for character input
	- For character input, go to "Code-runner: Run in Terminal" in "Settings"
		- Set checkmark for "Whether to run code in Integrated Terminal"