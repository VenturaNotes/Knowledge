[Video](https://www.youtube.com/watch?v=vQzREQUhGSA)

- [[List]]: data structure that represents a list of objects that can be accessed by index.
	- Similar to array, but can dynamically increase/decrease in size
		- However they use more memory?
	- using System.Collections.Generic;

Code
```C#
using System;
using System.Collections.Generic;

namespace MyFirstProgram
{
    class Program 
    {
        static void Main(string[] args)
        {

            // List = data structure that represents a list of objects that can be accessed by index.
            //        Similar to array, but can dynamically increase/decrease in size 
            //        using System.Collections.Generic;

            List<String> food = new List<String>();

            food.Add("pizza");
            food.Add("hamburger");
            food.Add("hotdog");
            food.Add("fries");

            //Console.WriteLine(food[0]);
            //Console.WriteLine(food[1]);
            //Console.WriteLine(food[2]);
            //Console.WriteLine(food[3]);

			//Removes an element
            //food.Remove("fries");

			//Adds an element
            //food.Insert(0, "sushi");

			//Finds number of elements in object
            //Console.WriteLine(food.Count);

			//Retuns the index of an element in object
            //Console.WriteLine(food.IndexOf("pizza"));

			//Returns the last index of an element in object
            //Console.WriteLine(food.LastIndexOf("fries"));

			//Returns true or false if object contains element
            //Console.WriteLine(food.Contains("pizza"));

			//Sorts the list in alphabetical order
            //food.Sort();

			//Reverses the current order of the list
            //food.Reverse();

			//Clears the list
            //food.Clear();
            //String[] foodArray = food.ToArray();

            foreach (String item in food)
            {
                Console.WriteLine(item);
            }

            Console.ReadKey();
        }
    }
}
```

Output
```
pizza
hamburger
hotdog
fries
```