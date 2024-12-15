---
Source:
  - https://youtube.com/watch?v=Lvnb83qt57g
---
```java
public class Main {

	public static void main(String[] args) {
		
		// abstract =  	abstract classes cannot be instantiated, but they can have a subclass
		//				abstract methods are declared without an implementation
		
		//Vehicle vehicle = new Vehicle();
		Car car = new Car();
		
		car.go();
	}
}
//This adds a layer of security
//Does not let you instantiate the type Vehicle
//Abstract methods do not specify a body
abstract class Vehicle {
	
	abstract void go();
}

class Car extends Vehicle{

	//Forced to create our own implementation of the go method
	//Ensures that we don't forget to create a go method
	@Override
	void go() {
		System.out.println("The driver is driving the car");
		
	}
}

```

- Output
```
The driver is driving the car
```