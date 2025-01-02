---
Source:
  - https://www.youtube.com/watch?v=taejaz9OwKY
Reviewed: false
---
- [[String interpolation]]: Allows us to insert variables into a string literal precede a string literal with $
	- {} are placeholders
- Other ways may need to concatenate the string together

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            String firstName = "Bro";
            String lastName = "Code";
            int age = 21;

            Console.WriteLine($"Hello {firstName} {lastName}.");
            //Adds 10 spaces worth of room to the left to display age
            Console.WriteLine($"You are {age,-10} old.");

            Console.ReadKey();
        }
    }
}
```

Output
```
Hello Bro Code.
You are 21         old.
```