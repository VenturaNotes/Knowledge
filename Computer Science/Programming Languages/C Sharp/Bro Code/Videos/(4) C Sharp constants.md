---
Source:
  - https://www.youtube.com/watch?v=yl8zQGhtBms
Reviewed: false
---
- [[Constants]] are immutable values which are known at compile time and do not change for the life of the program
	- Adds security to programs so that others can't change it later in the program

Code
``` C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {

            const double pi = 3.14;

            //pi = 420; //can't change this constant

            Console.WriteLine(pi);

            Console.ReadKey();
        }
    }
}
```

Output
```
3.14
```