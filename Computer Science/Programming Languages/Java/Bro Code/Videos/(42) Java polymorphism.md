---
Source:
  - https://youtube.com/watch?v=2hkngtWLGvE
Reviewed: false
---
```java
public class Main {

	public static void main(String[] args) {
		
		// polymorphism = 	greek word for poly-"many", morph-"form"
		//					The ability of an object to identify as more than one type
		// It means being identified as more than 1 data type.
		
		Car car = new Car();
		Bicycle bicycle = new Bicycle();
		Boat boat = new Boat();
		
		//If you're going to store objects within an array, and they're all
		//different object types, you'll have to find what they have in common
		//and make an array of that type. That's how to store different objects in
		//an array using polymorphism

		//Could also identify as Object[] racers, but there's a few
		// other changes we'd need to make.
		Vehicle[] racers = {car,bicycle,boat};

		/*
		 * Inefficient way of calling go() method in objects;
		 * car.go();
		 * bicycle.go();
		 * boat.go();
		 * 
		 * 
		 */
		
		for(Vehicle x : racers) {
			x.go();
		}
	}
}
class Vehicle {

	public void go() {
		// TODO Auto-generated method stub
		
	}
}
class Car extends Vehicle{

	//good practice to add these annotations.
	//they all override the go method in the Vehicle super class
	@Override
	public void go() {
		System.out.println("*The car begins moving*");
	}
}
class Bicycle extends Vehicle{


	@Override
	public void go() {
		System.out.println("*The bicycle begins moving*");
	}
}
class Boat extends Vehicle{


	@Override
	public void go() {
		System.out.println("*The boat begins moving*");
	}
}
```

Output
```
*The car begins moving*
*The bicycle begins moving*
*The boat begins moving*
```