---
Source:
  - https://www.youtube.com/watch?v=nYCMW3kfTvs
---
- [[Polymorphism]]: Greek word that means to "have many forms". Objects can be identified by more than one type. Ex. A Dog is also: Canine, Animal, Organism
- Need to use override method when overriding a modifier

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args) {
        
            Car car = new Car();
            Bicycle bicycle = new Bicycle();
            Boat boat = new Boat();

            Vehicle[] vehicles = {car, bicycle, boat};

            foreach (Vehicle vehicle in vehicles)
            {
                vehicle.Go();
            }
           
            Console.ReadKey();
        }
    }
    class Vehicle
    {
        public virtual void Go()
        {

        }
    }
    class Car: Vehicle
    {
        public override void Go()
        {
            Console.WriteLine("The car is moving!");
        }
    }
    class Bicycle : Vehicle
    {
        public override void Go()
        {
            Console.WriteLine("The bicycle is moving!");
        }
    }
    class Boat : Vehicle
    {
        public override void Go()
        {
            Console.WriteLine("The boat is moving!");
        }
    }
}
```

Output
```
The car is moving!
The bicycle is moving!
The boat is moving!
```