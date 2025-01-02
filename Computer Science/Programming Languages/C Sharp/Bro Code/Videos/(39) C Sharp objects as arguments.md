---
Source:
  - https://www.youtube.com/watch?v=OuR9e9R3yWs
Reviewed: false
---
Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args) {

            Car car1 = new Car("Mustang","red");

			//Created a copy of car1 by returing a car object
            Car car2 = Copy(car1);

            Console.WriteLine(car2.color + " " + car2.model);

            Console.ReadKey();
        }

        public static void ChangeColor(Car car, String color)
        {
            car.color = color;
        }

        public static Car Copy(Car car)
        {
            return new Car(car.model, car.color);
        }
    }
    class Car 
    {
        public String model;
        public String color;

        public Car(String model, String color)
        {
            this.model = model;
            this.color = color;
        }
    }
}
```

Output
```
red Mustang
```