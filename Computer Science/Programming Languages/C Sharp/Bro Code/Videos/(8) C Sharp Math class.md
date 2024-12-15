---
Source:
  - https://www.youtube.com/watch?v=tzRK0QFEte0
---
- [[Math Class Methods in C Sharp]]

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {

            double x = 3;
            double y = 5;

            double a = Math.Pow(x, 2); //Raises x to power of 2
            double b = Math.Sqrt(x); //Finds square root of x
            double c = Math.Abs(x); //Finds absolute value of x
            double d = Math.Round(x); //Rounds x to nearest integer
            double e = Math.Ceiling(x); //Rounds number up to nearest integer
            double f = Math.Floor(x); //Rounds number down to nearest integer
            double g = Math.Max(x, y); //Returns maximum value of 2 variables
            double h = Math.Min(x, y); //Returns minimum value of 2 variables

            Console.WriteLine(a);

            Console.ReadKey();
        }
    }
}
```

Output
```
9
```