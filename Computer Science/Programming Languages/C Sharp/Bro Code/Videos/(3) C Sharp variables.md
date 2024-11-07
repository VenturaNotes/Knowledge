[Video](https://www.youtube.com/watch?v=IxBMVztdlr4)

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            //Variables are containers for values

            //short for integer
            int x; // declaration
            x = 123; // initialization

            int y = 321; // declaration + initialization

            int z = x + y;

            int age = 21; // whole integer

            //decimal number. Like a floating point number but wih more precision
            double height = 300.5; // decimal number

            //Only stores true or false
            bool alive = false; //true or false

            //Can only assign a single character
            char symbol = '@'; // single character
            String name = "Bro"; // a series of characters 

            Console.WriteLine("Hello " + name);
            Console.WriteLine("Your age is " + age);
            Console.WriteLine("Your height is " + height + "cm");
            Console.WriteLine("Are you alive? " + alive);
            Console.WriteLine("Your symbol is: " + symbol);

            //
            String userName = symbol + name;

            Console.WriteLine("Your username is: " + userName);

            Console.ReadKey();
        }
    }
}
```

Output
```
Hello Bro
Your age is 21
Your height is 300.5cm
Are you alive? False
Your symbol is: @
Your username is: @Bro
```