---
Source:
  - https://www.youtube.com/watch?v=7TJ7Z1-V_24
---
```c++
#include <iostream>
#include <vector>

//typedef std::vector<std::pair<std::string,int> > pairlist_t;
//typedef std::string text_t;
//typedef int number_t;

using text_t = std::string;
using number_t = int;

int main() {

    text_t firstName = "Bro";
    number_t age = 21;

    std::cout << firstName << '\n';
    std::cout << age << '\n';


    //pairlist_t pairlist;
    return 0;
}
```
- typedef = reserved keyword used to create an additional name (alias) for another data type. New identifier for an existing type. Helps with readability and reduces typos. Use when there is a clear benefit. Replaced with 'using' (work better w/ templates)
	- `typedef` has been largely replaced with the `using` keyword because the `using` keyword works much better with templates
- Given `#include <vector>`, could have a data type for a pair list:
	- `typedef std::vector<std::pair<std::string, int>> pairlist_t`
		- Could give this data type an alias using this typedef keyword. Will come up with a new name such as `pairlist_t`
		- A common convention when using the typedef keyword is that the new identifier usually ends with `_t` for type
- You might get an
	- `helloworld.cpp:9:18: warning: alias declarations are a C++11 extension [-Wc++11-extensions]` warning when doing the `using` keyword but you can follow this [guide](https://stackoverflow.com/questions/27385199/how-do-i-update-my-compiler-to-use-c11-features#:~:text=0-,Go,-to%20Settings%20%3D%3E) to remove the warning. 