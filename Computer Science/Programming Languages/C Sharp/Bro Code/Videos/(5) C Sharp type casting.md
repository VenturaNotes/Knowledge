---
Source:
  - https://www.youtube.com/watch?v=uajWePMMs84
---
- [[Type casting]] is converting a value to a different data type. Useful when we accept user input (string). Different data types can do different things.

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            //Convert double to integer
            double a = 3.14;
            int b = Convert.ToInt32(a); //Truncates the decimal portion

            //Convert integer to double
            int c = 123;
            double d = Convert.ToDouble(c);

            //Convert Integer to String
            int e = 321;
            String f = Convert.ToString(e);

            //Convert String to Char
            String g = "$";
            char h = Convert.ToChar(g);

            //Convert String to Bool
            String i = "true";
            bool j = Convert.ToBoolean(i);

            //Displays the data type of the variable
            Console.WriteLine(b.GetType());
            Console.WriteLine(d.GetType());
            Console.WriteLine(f.GetType());
            Console.WriteLine(h.GetType());
            Console.WriteLine(j.GetType());

            Console.ReadKey();
        }
    }
}
```

Output
```
System.Int32
System.Double
System.String
System.Char
System.Boolean
```
