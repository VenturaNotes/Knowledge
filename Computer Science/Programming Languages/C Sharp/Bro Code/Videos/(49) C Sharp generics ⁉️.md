---
Source:
  - https://www.youtube.com/watch?v=aNTDJ9bnRU4
---
- [[Generic]]: "not specific to a particular data type"
	- Add `<T>` to: classes, methods, fields, etc
		- Allows for methods to accept any data type for example
		- You don't need to add `<T>` specifially could be anything you want like `<Thing>`
	- Allows for code reusability for different data types

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            int[] intArray = { 1, 2, 3 };
            double[] doubleArray = { 1.0, 2.0, 3.0 };
            String[] stringArray = { "1", "2", "3" };

            displayElements(intArray);
            displayElements(doubleArray);
            displayElements(stringArray);

            Console.ReadKey();
        }     
        public static void displayElements<Thing>(Thing[] array)
        {
            foreach (Thing item in array)
            {
                Console.Write(item + " ");
            }
            Console.WriteLine();
        }
    }
}
```


Output
```
1 2 3 
1 2 3 
1 2 3 
```