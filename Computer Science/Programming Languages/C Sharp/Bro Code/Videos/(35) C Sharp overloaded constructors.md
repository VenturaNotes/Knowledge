---
Source:
  - https://www.youtube.com/watch?v=OLxIscUoTgY
Reviewed: false
---
- [[Overloaded constructors]]: technique to create multiple constructors, with a different set of parameters.
	- name + parameters = [[signature]]

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            Pizza pizza = new Pizza("stuffed crust", "red sauce", "mozzarella");

            Console.ReadKey();
        }   
    }
    class Pizza
    {
        String? bread;
        String? sauce;
        String? cheese;
        String? topping;

        public Pizza(String bread)
        {
            this.bread = bread;
        }
        public Pizza(String bread, String sauce)
        {
            this.bread = bread;
            this.sauce = sauce;
        }
        public Pizza(String bread, String sauce, String cheese)
        {
            this.bread = bread;
            this.sauce = sauce;
            this.cheese = cheese;
        }
        public Pizza(String bread, String sauce, String cheese, String topping)
        {
            this.bread = bread;
            this.sauce = sauce;
            this.cheese = cheese;
            this.topping = topping;
        }
    }
}

```

Output (None)
```
```