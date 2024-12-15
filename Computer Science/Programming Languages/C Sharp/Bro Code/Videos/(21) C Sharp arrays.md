---
Source:
  - https://www.youtube.com/watch?v=IHMmPVEOT64
---
- [[Array]]: A variable that can store multiple values. Fixed size

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            //String[] cars = {"BMW", "Mustang", "Corvette"};

            String[] cars = new string[3];

            cars[0] = "Tesla";
            cars[1] = "Mustang";
            cars[2] = "Corvette";

            for (int i = 0; i < cars.Length; i++)
            {
                Console.WriteLine(cars[i]);
            }

            Console.ReadKey();
        }
    }
}
```

Output
```
Tesla
Mustang
Corvette
```