[Video](https://www.youtube.com/watch?v=G1kYoPr1Ru8)

- [[Multidimensional array]]: An array of arrays
	- Sort of a grid or matrix of data

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program 
    {
        static void Main(string[] args)
        {

            String[,] parkingLot = { { "Mustang", "F-150", "Explorer" }, 
                                                   { "Corvette", "Camaro", "Silverado" }, 
                                                   { "Corolla", "Camry", "Rav4" } 
                                                 };

            parkingLot[0, 2] = "Fusion";
            parkingLot[2, 0] = "Tacoma";
            /*
            foreach(String car in parkingLot)
            {
                Console.WriteLine(car);
            }
            */

			//Able to display data in multidimensional array
			//0 represents the first dimension
			//1 represents the second dimension
            for(int i = 0; i < parkingLot.GetLength(0); i++)
            {
                for (int j = 0; j < parkingLot.GetLength(1); j++)
                {
                    Console.Write(parkingLot[i, j] + " ");
                }
                Console.WriteLine();
            }

            Console.ReadKey();
        }
    }
}
```

Output
```
Mustang F-150 Fusion 
Corvette Camaro Silverado 
Tacoma Camry Rav4 
```