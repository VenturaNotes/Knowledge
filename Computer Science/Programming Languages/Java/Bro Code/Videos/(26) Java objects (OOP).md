---
Source:
  - https://youtube.com/watch?v=kd3dr39rgrk
---
```java
public class Main {

	public static void main(String[] args) {

		/*
		 * object = an instance of a class that may contain attributes and methods
		 * Think of attributes as the characteristics that the object has
		 * And methods as the different actions that this object can perform
		 * 
		 * 
		 * attributes(Characteristics of an object) and methods(what actions this object can perform)
		 * 
		 * Examples of attributes:
		 * 
		 * Color of coffee cup is white
		 * 			String color = "white";
		 * 
		 * Room temperature at 20°C
		 * 			double temp = 20.0;
		 * 
		 * status of whether cup is empty or full
		 * 			boolean empty = true;
		 * 
		 * Examples of methods (actions of coffee cup):
		 * drink() {System.out.print("you drink the coffee")};
		 * spill() {System.out.print("you spill the coffee :(")};
		 * 
		 * You can create a class in the same java file or a separate java file
		 * Make sure to declare class outside the same class you're working with
		 * However, 2 public classes cannot be in the same file
		 * This is because if you are able to write many public classes in one file,
		 * then you have to search among many files for the definition of the class
		 * which you have to debug.
		 * You could create the car class in a separate class called Car.java
		 */
	
		// example: (phone, desk, computer, coffee cup)
		
		//The car class will act as a blueprint
		//All of the objects will be the exact same, but that's why constructors are important
		//Constructors prevent objects from being the same
		Car myCar1 = new Car();
		Car myCar2 = new Car();

		System.out.println(myCar1.make);
		System.out.println(myCar1.model);

		System.out.println(myCar2.make);
		System.out.println(myCar2.model);

		myCar1.drive();
		myCar1.brake();
	}
}

class Car {

	String make = "Chevrolet";
	String model = "Corvette";
	int year = 2020;
	String color = "blue";
	double price = 50000.00;
	
	void drive() {
		System.out.println("You drive the car");
	}
	void brake() {
		System.out.println("You step on the brakes");
	}	
}
```

- Output
```
Chevrolet
Corvette
Chevrolet
Corvette
You drive the car
You step on the brakes
```