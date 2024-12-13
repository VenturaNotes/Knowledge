---
Source:
  - https://www.youtube.com/watch?v=2lcIKzFHjSM
---
- Namespace examples
```c++
#include <iostream>

namespace first{
    int x = 1;
}

namespace second{
    int x = 2;
}

namespace third{
    int x = 3;
}

int main() {

    using namespace third;

    std::cout <<first::x << "\n";
    std::cout <<x << "\n";

    return 0;
}
```
- [[Namespace]] = provides a solution for preventing name conflicts in large projects. Each entity needs a unique name. A namespace allows for identically named entities as long as the namespaces are different
- If we don't explicitly state which namespace we're using, we'll be using the local version of an entity 
- To refer a variable found in the namespace `namespace second`, we would get the variable by doing
	- `std:: cout << first::x;`
		- The two colons is known as the scope resolution operator
		- We're referring to the version of `x` found within the first namespace
		- If we want a different namespace, we would precede that entity with the second namespace followed by the scope resolution operator
- So entities can have the same name as long as they're in a different namespace
- You might see `using namespace first`
	- If we have some entity without a prefix of the namespace, it's assumed that we're using the entity found within that particular namespace
Not optimal `using namespace std`
```c++
#include <iostream>
int main() {

    using namespace std;

    string name = "Bro";

    cout << "Hello " << name;

    return 0;
}
```

More optimal use of `using std::cout;` and `using std::string;`
```c++
#include <iostream>

int main() {

    using std::cout;
    using std::string;

    string name = "Bro";

    cout << "Hello " << name;

    return 0;
}
```
- Doing `using namespace std;` is valid but the standard namespace has hundreds of different entities. There is a high likelihood of a naming conflict. For example, there is an entity called "data".
- We could do `using std::cout;` which would cut down on some of the standard repetition.
	- Or `using std::string;`
	- It's a safer alternative to `using namespace std;`
- In future, won't be `using namespace std` 