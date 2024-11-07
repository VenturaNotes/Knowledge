[Video](https://www.youtube.com/watch?v=w1mah-sjWUc)

- [[String Interpolation]]
	- Example
		- `Console.WriteLine($"Your result: {num1} + {num2} = " + result);`
- [[Do While Loop]]: Will always execute a body of code once and checks condition at end

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            do
            {
                double num1 = 0;
                double num2 = 0;
                double result = 0;

                Console.WriteLine("------------------");
                Console.WriteLine("Calculator Program");
                Console.WriteLine("------------------");

                Console.Write("Enter number 1: ");
                num1 = Convert.ToDouble(Console.ReadLine());

                Console.Write("Enter number 2: ");
                num2 = Convert.ToDouble(Console.ReadLine());

                Console.WriteLine("Enter an option: ");
                Console.WriteLine("\t+ : Add");
                Console.WriteLine("\t- : Subtract");
                Console.WriteLine("\t* : Multiply");
                Console.WriteLine("\t/ : Divide");
                Console.Write("Enter an option: ");


                switch (Console.ReadLine())
                {
                    case "+":
                        result = num1 + num2;
                        Console.WriteLine($"Your result: {num1} + {num2} = " + result);
                        break;
                    case "-":
                        result = num1 - num2;
                        Console.WriteLine($"Your result: {num1} - {num2} = " + result);
                        break;
                    case "*":
                        result = num1 * num2;
                        Console.WriteLine($"Your result: {num1} * {num2} = " + result);
                        break;
                    case "/":
                        result = num1 / num2;
                        Console.WriteLine($"Your result: {num1} / {num2} = " + result);
                        break;
                    default:
                        Console.WriteLine("That was not a valid option");
                        break;
                }
                Console.Write("Would you like to continue? (Y = yes, N = No): ");
            } while (Console.ReadLine()?.ToUpper() == "Y");
            //loop stops if input is anything other than Y

            Console.WriteLine("Bye!");
            Console.ReadKey();
        }
    }
}
```

Output
```
------------------
Calculator Program
------------------
Enter number 1: 5
Enter number 2: 6
Enter an option: 
        + : Add
        - : Subtract
        * : Multiply
        / : Divide
Enter an option: +
Your result: 5 + 6 = 11
Would you like to continue? (Y = yes, N = No): n
Bye!
```