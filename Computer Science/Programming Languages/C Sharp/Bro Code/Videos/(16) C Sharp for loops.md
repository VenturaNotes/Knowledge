[Video](https://www.youtube.com/watch?v=h4hY2hho73Q)

- [[For loop]]: repeats some code a finite amount of times

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            // Count up to 10
            //i stands for index
            for (int i = 1; i <= 10; i++)
            {
                Console.WriteLine(i);
            }
               
            // Count down from 10
            for (int i = 10; i > 0; i--)
            {
                Console.WriteLine(i);
            }
            Console.WriteLine("HAPPY NEW YEAR!");

            Console.ReadKey();
        }
    }
}
```


Output
```
1
2
3
4
5
6
7
8
9
10
10
9
8
7
6
5
4
3
2
1
HAPPY NEW YEAR!
```