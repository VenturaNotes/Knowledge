[Video](https://www.youtube.com/watch?v=ZITVn87McQ8)

- [[Anonymous objects]]
	- new Car("Mustang")

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args) {

            Car[] garage = { new Car("Mustang"), new Car("Corvette"), new Car("Lambo") };

            foreach (Car car in garage)
            {
                Console.WriteLine(car.model);
            }

            Console.ReadKey();
        }   
    }
    class Car 
    {
        public String model;

        public Car(String model)
        {
            this.model = model;
        }
    }
}
```

Output
```
Mustang
Corvette
Lambo
```
