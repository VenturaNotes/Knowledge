---
Source:
  - https://www.youtube.com/watch?v=uC0NJ3aJv5A
---
- [[Conditional Operator]]: Used in conditional assignment if a condition is true/false
	- (condition) ?  x : y

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            double temperature = 20;
            String message;

            message = (temperature >= 15) ? "It's warm outside!" : "It's cold outside!";

            Console.WriteLine(message);

            Console.ReadKey();
        }
    }
}
```

Output
```
It's warm outside!
```