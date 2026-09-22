---
Source:
  - https://www.youtube.com/watch?v=QqWfw_CFR6Q
---
- [[exception]]: errors that occur during execution
	- [[try]]: try some code that is considered "dangerous"
	- [[catch]]: catches and handles exceptions when they occur
	- [[finally]]: always executes regardless if exception is caught or not
		- Still need to handle the exception in some way
		- If catches were removed, the finally block would not work
- You can add a catch block that catches everything but it is not considered good practice to have by itself. You want the user to know what exactly went wrong.

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            int x;
            int y;
            double result;

            try
            {
                Console.Write("Enter number 1: ");
                x = Convert.ToInt32(Console.ReadLine());

                Console.Write("Enter number 2: ");
                y = Convert.ToInt32(Console.ReadLine());

                result = x / y;

                Console.WriteLine("result: " + result);
            }
            //can put a variable in front, ex: <FormatException e>
            catch (FormatException)
            {
                Console.WriteLine("Enter ONLY numbers PLEASE!");
            }
            catch (DivideByZeroException)
            {
                Console.WriteLine("You can't divide by zero! IDIOT!");
            }
            catch (Exception)
            {
                Console.WriteLine("Something went wrong!");
            }
            finally
            {
                Console.WriteLine("Thanks for visiting!");
            }

            Console.ReadKey();
        }
    }
}

```

Output
```
Enter number 1: 5
Enter number 2: 0
You can't divide by zero! IDIOT!
Thanks for visiting!
```