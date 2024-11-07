[Video](https://www.youtube.com/watch?v=EvSyka9vJho)

- [[Inheritance]]: 1 or more child classes receiving fields, methods, etc. from a common parent

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            Car car = new Car();
            Bicycle bicycle = new Bicycle();
            Boat boat = new Boat();

            Console.WriteLine(car.speed);
            Console.WriteLine(car.wheels);
            car.go();

            Console.WriteLine(bicycle.speed);
            Console.WriteLine(bicycle.wheels);
            bicycle.go();

            Console.WriteLine(boat.speed);
            Console.WriteLine(boat.wheels);
            boat.go();

            Console.ReadKey();
        }   
    }
    class Vehicle
    {
        public int speed = 0;

        public void go()
        {
            Console.WriteLine("This vehicle is moving!");
        }
    }
    //This shows inheritance
    class Car : Vehicle
    {
        public int wheels = 4;
    }
    class Bicycle : Vehicle
    {
        public int wheels = 2;
    }
    class Boat : Vehicle
    {
        public int wheels = 0;
    }
}
```

Output
```
0
4
This vehicle is moving!
0
2
This vehicle is moving!
0
0
This vehicle is moving!
```