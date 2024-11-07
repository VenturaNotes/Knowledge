[Video](https://www.youtube.com/watch?v=_SXJyA605bI)


Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("What's your name?");

            //The String? tells the compiler that the variable can accept null values
            //This will solve the warning "Converting null literal or possible null value to nun-nullable type"
            String? name = Console.ReadLine(); //Takes the user input

            Console.WriteLine("What's your age?");
            
            //Will get a System.FormatException if input string was not correct format
            int age = Convert.ToInt32(Console.ReadLine());  

            Console.WriteLine("Hello " + name);
            Console.WriteLine("You are " + age + " years old");

            Console.ReadKey();
        }
    }
}
```

Output
```
What's your name?
Julian Ventura //My Input
What's your age?
23 //My Input
Hello Julian Ventura
You are 23 years old
```