[Video](https://www.youtube.com/watch?v=9V5B3dNoVIA)

- [[class (Computer Science)|class]]: A bundle of related code.
	- Can be used as a blueprint to create objects (OOP)
		- OOP is object oriented programming
			- This is what the math class has
- You can write your class in the same C# file or a different one
- To create a class, you either need to create an object from the class or precede class definition with static and all the methods in the class need to be static as well
	- Methods must be written as `public static void Waiting()`

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            Messages.Hello();
            Messages.Waiting();
            Messages.Bye();

            Console.ReadKey();
        }
    }
    static class Messages
    {
        public static void Hello()
        {
            Console.WriteLine("Hello! Welcome to the program");
        }
        public static void Waiting()
        {
            Console.WriteLine("I am waiting for something");
        }
        public static void Bye()
        {
            Console.WriteLine("Bye! Thanks for visiting");
        }
    }
}
```

Output
```
Hello! Welcome to the program
I am waiting for something
Bye! Thanks for visiting
```