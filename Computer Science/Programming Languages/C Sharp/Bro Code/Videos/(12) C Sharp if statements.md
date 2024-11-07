[Video](https://www.youtube.com/watch?v=pSPQnXleaS8)

- [[if statement]] is a basic form of decision making
- = is an as [[assignment operator]]

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
             //if statement = a basic form of decision making
            // -------------------- Example 1 -------------------- 

            Console.WriteLine("Please enter your age: ");
            int age = Convert.ToInt32(Console.ReadLine());

            if (age >= 18)
            {
                Console.WriteLine("You are now signed up!");
            }
            else if (age < 0)
            {
                Console.WriteLine("You haven't been born yet!");
            }
            else
            {
                Console.WriteLine("You must be 18+ to sign up!");
            }            
            // -------------------- Example 2 -------------------- 

            Console.WriteLine("Please enter your name: ");
            String? name = Console.ReadLine();

            if (name == "")
            {
                Console.WriteLine("You did not enter your name!");
            }
            else
            {
                Console.WriteLine("Hello " + name);
            }

            Console.ReadKey();
        }
    }
}
```

Output
```
Please enter your age: 
5 //my input
You must be 18+ to sign up!
Please enter your name: 
Julian //my input
Hello Julian
```