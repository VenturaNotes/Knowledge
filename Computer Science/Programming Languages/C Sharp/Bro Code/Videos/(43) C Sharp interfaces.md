[Video](https://www.youtube.com/watch?v=RuhGv81tpoU)

- [[Programming Interface|Programming Interface]]: defines a "contract" that all the classes inheriting from should follow
	- An interface declares "what a class should have"
	- An inheriting class defines "how it should do it"
	- Benefit = security + multiple inheritance + "plug-and-play"
- Implementing a method is the job of the inheriting class that would like to use an interface

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            Rabbit rabbit = new Rabbit();
            Hawk hawk = new Hawk();
            Fish fish = new Fish();

            rabbit.Flee();
            hawk.Hunt();
            fish.Flee();
            fish.Hunt();

            Console.ReadKey();
        }
        interface IPrey
        {
            void Flee();
        }
        interface IPredator
        {
            void Hunt();
        }
        class Rabbit : IPrey
        {
            public void Flee()
            {
                Console.WriteLine("The rabbit runs away!");
            }
        }
        class Hawk : IPredator
        {
            public void Hunt()
            {
                Console.WriteLine("The hawk is searching for food!");
            }
        }
        //Can inherit 2 interfaces. Needs to create the 2 methods then
        class Fish : IPrey, IPredator
        {
            public void Flee()
            {
                Console.WriteLine("The fish swims away!");
            }
            public void Hunt()
            {
                Console.WriteLine("The fish is searching for smaller fish!");
            }
        } 
    }  
}
```

Output
```
The rabbit runs away!
The hawk is searching for food!
The fish swims away!
The fish is searching for smaller fish!
```
