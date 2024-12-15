---
Source:
  - https://www.youtube.com/watch?v=BKYBiUAWZKM
---
- [[C Sharp String Methods]]
- [[C Sharp String Properties]]
- To view more methods or properties, just do `<string name>.` and after the dot, the list will be there in visual studio

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            String fullName = "Bro Code";
            String phoneNumber = "123-456-7890";

			//Turns the entire string uppercase
            //fullName = fullName.ToUpper();

			//Turns the entire string to lowercase
            //fullName = fullName.ToLower();
            //Console.WriteLine(fullName);

			//Removes dashes from phone number
            //phoneNumber = phoneNumber.Replace("-","");
            //Console.WriteLine(phoneNumber);

			//Can create a new string with text inserted at any index
            //String userName = fullName.Insert(0,"Mr.");
            //Console.WriteLine(userName);

			//The Length property hold the value for the length of the string
			//No parentheses needed as do methods
            //Console.WriteLine(fullName.Length);

			//Gets a subsection of the Substring
            String firstName = fullName.Substring(0, 3);
            String lastName = fullName.Substring(4, 4);

            Console.WriteLine(firstName);
            Console.WriteLine(lastName);

            Console.ReadKey();
        }
    }
}
```

Output
```
Bro
Code
```