---
Source:
  - https://www.youtube.com/watch?v=EyghyKO4BlA
---
- [[While loop]]: repeats some code while some condition remains true

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            String? name = "";

            while (name == "")
            {
                Console.Write("Enter your name: ");
                name = Console.ReadLine();
            }

            Console.WriteLine("Hello " + name);

            Console.ReadKey();
        }
    }
}
```


Output
```
Enter your name: Julian //My Input
Hello Julian
```