[Video](https://www.youtube.com/watch?v=Z70AwnYYJOc)

- [[Auto-Implemented Properties]]: shortcut when no additional logic is required in the property.
	- You do not have to define a field for a property,
	- You only have to write get; and/or set; inside the property

Code
```C#
using System;

namespace MyFirstProgram
{
    class Program 
    {
        static void Main(string[] args)
        {
            Car car = new Car("Porsche");

            Console.WriteLine(car.Model);

            Console.ReadKey();
        }
    }

    class Car
    {
	    //auto-implemented property
        public String Model {get; set;}

/*      
		//Long way of doing getter and setter
		String model;
		public String Model
		{
			get {return model;}
			set {model = value;}
		}

*/

        public Car(String model)
        {
            this.Model = model;
        }
    }
}
```


Output
```
Porsche
```
