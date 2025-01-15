---
Source:
  - https://www.youtube.com/watch?v=LZd5LhfnYsk
Reviewed: false
---
```c++
int add(int a){
    return a;
}
int add(int a, int b){
    return a + b;
}
int add(int a, int b, int c){
    return a + b + c;
}
int add(int a, int b, int c, int d){
    return a + b + c + d;
}
```
- In C++ and many other programming languages, you can have different versions of the same function
	- [[Overloaded functions]]

```c++
#include <iostream>

// Function declarations. Some accepting string
void bakePizza();
void bakePizza(std::string topping1);
void bakePizza(std::string topping1, std::string topping2);

int main()
{
    //bakePizza(); // no toppings
    //bakePizza("pepperoni"); //one topping
    //bakePizza("pepperoni", "mushroom"); //two toppings

    return 0;
}

void bakePizza(){
    std::cout << "Here is your pizza!\n";
}
void bakePizza(std::string topping1){
    std::cout << "Here is your " << topping1 << " pizza!\n";
}
void bakePizza(std::string topping1, std::string topping2){
    std::cout << "Here is your " << topping1 << " and " << topping2 << " pizza!\n";
}
```
- It is valid for functions to share the same name but you need a different set of parameters. 
- A function's name + its parameters is known as a [[function signature]]
	- Each function signature needs to be unique (similar to an ID)