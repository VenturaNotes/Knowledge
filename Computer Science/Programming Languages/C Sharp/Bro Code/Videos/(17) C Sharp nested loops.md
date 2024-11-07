[Video](https://www.youtube.com/watch?v=WFzLcZk137s)

- [[Nested Loops]]: Loops inside of other loops. Uses vary. Used a lot in sorting algorithms

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.Write("How many rows?: ");
            int rows = Convert.ToInt32(Console.ReadLine());

            Console.Write("How many columns?: ");
            int columns = Convert.ToInt32(Console.ReadLine());

            Console.Write("What symbol: ");
            String? symbol = Console.ReadLine();

            for (int i = 0; i < rows; i++)
            {
                for (int j = 0; j < columns; j++)
                {
                    Console.Write(symbol);
                }
                Console.WriteLine();
            }

            Console.ReadKey();
        }
    }
}
```


Output
```
How many rows?: 3
How many columns?: 5
What symbol: #
#####
#####
#####
```
