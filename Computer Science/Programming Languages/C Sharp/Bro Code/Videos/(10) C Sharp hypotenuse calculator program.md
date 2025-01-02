---
Source:
  - https://www.youtube.com/watch?v=PBEQuE_ln08
Reviewed: false
---
Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {

            Console.WriteLine("Enter side A: ");
            double a = Convert.ToDouble(Console.ReadLine());

            Console.WriteLine("Enter side B: ");
            double b = Convert.ToDouble(Console.ReadLine());

            double c = Math.Sqrt((a * a) + (b * b));

            Console.WriteLine("The hypotenuse is: " + c);

            Console.ReadKey();
        }
    }
}
```

Output
```
Enter side A: 
3 //My input value
Enter side B: 
4 //My input value
The hypotenuse is: 5
```