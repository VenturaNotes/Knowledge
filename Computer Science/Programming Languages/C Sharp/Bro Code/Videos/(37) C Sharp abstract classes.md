---
Source:
  - https://www.youtube.com/watch?v=06BrbJm7Sho
Reviewed: false
---
- [[Abstract Classes]]: Modifier that indicates missing components or incomplete implementation
	- So we should not be able to instantiate objects from that class itself (adds a little bit of security)

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            // abstract classes =  modifier that indicates missing components or incomplete implementation

            Car car = new Car();
            Bicycle bicycle = new Bicycle();
            Boat boat = new Boat();

            Console.WriteLine(car.speed);
            Console.WriteLine(bicycle.speed);
            Console.WriteLine(boat.speed);

            //Vehicle vehicle = new Vehicle(); //can't create a vehicle object

            Console.ReadKey();
        }   
    }
    abstract class Vehicle
    {
        public int speed = 0;

        public void go()
        {
            Console.WriteLine("This vehicle is moving!");
        }
    }

    //The classes below have complete implementations
    class Car : Vehicle
    {
        public int wheels = 4;
        int maxSpeed = 500;
    }
    class Bicycle : Vehicle
    {
        public int wheels = 2;
        int maxSpeed = 50;
    }
    class Boat : Vehicle
    {
        public int wheels = 0;
        int maxSpeed = 100;
    }
}
```

Output (Get 3 warnings since maxSpeed is never used)
```
0
0
0
```