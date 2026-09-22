---
Source:
  - https://www.youtube.com/watch?v=1gSFd-YVFP8
---
- [[Random Numbers in C Sharp]]
- These will be pseudorandom numbers
- A polyhedral dice can have as few as 3 sides and as many as 100. 20 sided dice is used for dungeons and dragons

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            Random random = new Random(); //Random object

            int num1 = random.Next(1, 7); //random number between 1 and 6 This is because the second number will be exclusive.
            int num2 = random.Next(1, 7);
            int num3 = random.Next(1, 7);

			//This will give a double number
            //double num = random.NextDouble();

            Console.WriteLine(num1);
            Console.WriteLine(num2);
            Console.WriteLine(num3);

            Console.ReadKey();
        }
    }
}
```

Output
```
3
3
2
```