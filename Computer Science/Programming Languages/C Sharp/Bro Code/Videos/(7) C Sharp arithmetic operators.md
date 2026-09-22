---
Source:
  - https://www.youtube.com/watch?v=k1ivOkhxxdw
---
- [[Modulo Operator]]
- [[Integer Division]]

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            int friends = 5;

			//Adding
            friends = friends + 1;
            //friends += 1;
            //friends++;

			//Subtracting
            //friends = friends - 1;
            //friends -= 1;
            //friends--;

			//Multiplication
            //friends = friends * 2;
            //friends *= 2;

			//Division (Integer Division specifically)
            //friends = friends / 2;
            //friends /= 2;

			//Modulus or Remainder Operator
            //int remainder = friends % 2;
            //Console.WriteLine(remainder);

            Console.WriteLine(friends);

            Console.ReadKey();
        }
    }
}
```

Output
```
6
```