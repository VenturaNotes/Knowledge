---
Source:
  - https://www.youtube.com/watch?v=dWsjatPhWHQ
Reviewed: false
---
- [[ternary operator]]
	- Represented by ?: which is a replacement to an if/else statement
	- condition ? expression1 : expression2;
```c++
# include <iostream>

int main() {
    
    int grade = 75;
    
    // Original if statement
    if (grade >= 60)
    {
        std::cout << "You pass!\n";
    }
    else {
        std::cout << "You fail!\n";
    }
    
    // If statement with ternary operator
    grade >= 60 ? std::cout << "You pass!" : std::cout << "You fail!";
    
    
    return 0;
}
```
Output
```
You pass!
You pass!
```

Checking even or odd using modulus operator
```c++
# include <iostream>

int main() {
    
    int number = 8;
    number % 2 ? std::cout << "ODD" : std::cout << "EVEN";
    // Returns Even
    // 0 corresponds to false and 1 corresponds to true
    
    return 0;
}
```

Alternative method with bools
```c++
# include <iostream>

int main() {
    
    bool hungry = true;
    
    hungry ? std::cout << "You are hungry" : std::cout << "You are full!";
    std::cout << (hungry ? "You are hungry" : "You are full");
    
    return 0;
    // Output for both is "You are hungry"
}
```

- [[modulus]] gives remainder of a division
	- So `9 % 2` = 1