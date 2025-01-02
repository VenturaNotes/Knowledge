---
Source:
  - https://www.youtube.com/watch?v=WhACXlObR8s
Reviewed: false
---
- [[Foreach Loop]]: A simpler way to iterate over an array, but it's less flexible

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            String[] cars = {"BMW", "Mustang", "Corvette"};

			//Not as flexible as for loops
            foreach (String car in cars)
            {
                Console.WriteLine(car);
            }

            Console.ReadKey();
        }
    }
}
```


Output
```
BMW
Mustang
Corvette
```