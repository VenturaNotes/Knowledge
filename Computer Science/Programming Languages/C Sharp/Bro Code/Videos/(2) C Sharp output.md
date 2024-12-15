---
Source:
  - https://www.youtube.com/watch?v=b8BUFfgyjK4
---
[[Escape Sequence]]
- `\a`: Bell(alert)
- `\b`: Backspace
	- Adds backspace to text (might remove a letter)
- `\f`: [[Form feed]]
- `\n`: New line
	- Places text in front on new line
- `\r`: Carriage return
- `\t`: Horizontal tab
	- Adds a tab
- `\v`: Vertical tab
- `\'`: Single quotation mark
- `\"`: Double Quotation mark`
- `\\:` Backslash
- `\?`: Literal question mark

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            // Below will write on the same line
            Console.Write("Hey!"); //"Hey" is known as a string literal

            //This will create a new line for the next string literal output to console
            Console.WriteLine("Hello!"); //WriteLine known as a method

            //This is a comment
            /*
             * this
             * is
             * a
             * multiline
             * comment
             */

            Console.WriteLine("BroCode"); 
            
            //Program waiting for key to finish running
            Console.ReadKey();
        }
    }
}
```

Output
```
Hey!Hello!
BroCode
```