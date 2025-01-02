---
Source:
  - https://www.youtube.com/watch?v=kfK0z8Oj1xc
Reviewed: false
---
- [[ToString()]]: converts an object to its string representation so that it is suitable for display

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program 
    {
        static void Main(string[] args)
        {

            Car car = new Car("Chevy", "Corvette", 2022, "blue");

            Console.WriteLine(car.ToString());
            //Don't need to directly say ToString()
            Console.WriteLine(car);

            Console.ReadKey();
        }
    }
    class Car
    {
        String make;
        String model;
        int year;
        String color;

        public Car(String make, String model, int year, String color)
        {
            this.make = make;
            this.model = model;
            this.year = year;
            this.color = color;
        }
        //Need to override it
        public override string ToString()
        {       
            return "This is a " + make + " " + model;
        }
    }
}
```

Output
```
This is a Chevy Corvette
This is a Chevy Corvette
```