---
Source:
  - https://www.youtube.com/watch?v=IPpEefuFiVM
---
- [[Method]]: Performs a section of code, whenever it's called "invoked". Benefit = Lets us reuse code w/o writing it multiple times.
	- Methods don't have access to variables in another method.
- [[Arguments]]: What is sent to methods
- [[Parameters]]: What a method needs to receive to be invoked

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            String name = "Bro";
            int age = 21;

            SingHappyBirthday(name, age);

            Console.ReadKey();
        }
        //Static because invoking a method from main method which is static
        static void SingHappyBirthday(String birthdayBoy, int yearsOld)
        {
            Console.WriteLine("Happy birthday to you!");
            Console.WriteLine("Happy birthday to you!");
            Console.WriteLine("Happy birthday dear " + birthdayBoy);
            Console.WriteLine("You are " + yearsOld + " years old!");
            Console.WriteLine("Happy birthday to you!");
            Console.WriteLine();
        }
    }
}
```


Output
```
Happy birthday to you!
Happy birthday to you!
Happy birthday dear Bro
You are 21 years old!
Happy birthday to you!

```