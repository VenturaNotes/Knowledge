[Video](https://www.youtube.com/watch?v=ToKbMa3xvMs)

- [[Method overriding]]: Provides a new version of a method inherited form a parent class
	- Inherited method must be: abstract, virtual, or already overridden
	- Used with ToString(), polymorphism

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args) {
        
            Dog dog = new Dog();
            Cat cat = new Cat();

            dog.Speak();
            cat.Speak();

            Console.ReadKey();
        }
    }
	//Known as a super class or base class
    class Animal 
    {
	    //Could make this abstract, but would require class to be abstract and the method can't have a body
        public virtual void Speak()
        {
            Console.WriteLine("The animal goes *brrr*");
        }
    }
    class Dog : Animal
    {
        public override void Speak()
        {
            Console.WriteLine("The dog goes *woof*");
        }
    }
    class Cat : Animal
    {

    }
}
```

Output
```
The dog goes *woof*
The animal goes *brrr*
```