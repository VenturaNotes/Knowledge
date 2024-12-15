---
Source:
  - https://www.youtube.com/watch?v=FaK5Nh20gVA
---
- [[Return]]: returns data back to the place where a method is invoked

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            // return  = returns data back to the place where a method is invoked

            double x;
            double y;
            double result;

            Console.WriteLine("Enter in number 1: ");
            x = Convert.ToDouble(Console.ReadLine());

            Console.WriteLine("Enter in number 2: ");
            y = Convert.ToDouble(Console.ReadLine());

            result = Multiply(x, y);

            Console.WriteLine(result);

            Console.ReadKey();
        }
        static double Multiply(double x, double y)
        {
            return x * y;
        }
    }
}
```


Output
```
Enter in number 1: 
5
Enter in number 2: 
6
30
```