---
Source:
  - https://youtube.com/watch?v=Zs342ePFvRI
---
```java
public class Main {

	public static void main(String[] args) {
		
		// inheritance = 	the process where one class acquires,
		//					the attributes and methods of another.
		
		Car car = new Car();
		
		car.go();
		
		Bicycle bike = new Bicycle();
		
		car.go();
		bike.stop();
		
		System.out.println(car.door);
		System.out.println(bike.pedals);
				
	}
}

class Vehicle{
double speed;

void go(){
System.out.println("This vehicle is moving");
}
void stop(){
System.out.println("This vehicle is stopped");
}
}

//To receive the attributes and methods of vehicle class, use extends
//and name of class you'd like to recieve everything from. This is inheritance
class Car extends Vehicle{

//can have unique and additional attributes
int wheels = 4;
int door = 4;
}

class Bicycle extends Vehicle{
int wheels = 2;
int pedals = 2;
}
```

- Output
```
This vehicle is moving
This vehicle is moving
This vehicle is stopped
4
2
```