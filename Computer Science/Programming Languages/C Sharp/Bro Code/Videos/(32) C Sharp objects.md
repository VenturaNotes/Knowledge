---
Source:
  - https://www.youtube.com/watch?v=heoTab1e41A
---
- [[Object]]: A instance of a class
	- A class can be used as a blueprint to create objects (OOP)
	- Objects can have [[fields]] & [[method|methods]] (characteristics & actions)
		- Fields are what an object has
		- Methods are what an object can do
- [[Access modifier]]: public is an example

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            Human human1 = new Human();
            Human human2 = new Human();

            human1.name = "Rick";
            human1.age = 65;

            human2.name = "Morty";
            human2.age = 16;

            human1.Eat();
            human1.Sleep();

            human2.Eat();
            human2.Sleep();

            Console.ReadKey();
        }
    }
    class Human
    {
	    //These are fields which are defining characteristics of what an object has
        public String? name;
        public int age;

        public void Eat()
        {
            Console.WriteLine(name + " is eating");
        }
        public void Sleep()
        {
            Console.WriteLine(name + " is sleeping");
        }
    }
}

```

Output
```
Rick is eating
Rick is sleeping
Morty is eating
Morty is sleeping
```