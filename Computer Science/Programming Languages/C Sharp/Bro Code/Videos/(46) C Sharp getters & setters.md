---
Source:
  - https://www.youtube.com/watch?v=8FmE_-QXg3Y
Reviewed: false
---
- [[getters & setters]]: add security to fields by [[encapsulation]]
	- They're accessors found within properties
- [[Properties]]: Combine aspects of both fields and methods (share name with field)
- [[Get accessor]]: used to return the property value
- [[Set accessor]]: Used to assign a new value
- [[Value keyword]]: defines the value being assigned by the set (parameter)

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {   
            Car car = new Car(400);

            car.Speed = 1000000000;

            Console.WriteLine(car.Speed);

            Console.ReadKey();
        }   
    }
    class Car
    {
        private int speed;

        public Car(int speed)
        {
            Speed = speed;
        }

        public int Speed
        {
            get { return speed; } //reads values in field
            set                   //writable
            {
                if (value > 500)
                {
                    speed = 500;
                }
                else
                {
                    speed = value;
                }
            }
        }

    }
}
```

Output
```
500
```