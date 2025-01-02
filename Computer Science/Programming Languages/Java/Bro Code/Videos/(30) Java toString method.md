---
Source:
  - https://youtube.com/watch?v=GvbdMwfjB98
Reviewed: false
---
```java
public class Main {

	public static void main(String[] args) {
	 
	 // toString() = special method that all objects inherit, 
	 //    that returns a string that "textually represents" an object.
	 //    can be used both implicitly and explicitly
	 
	 Car car = new Car();
	 
	 
	 System.out.println(car.toString());

		/*
		 * 
		 * Above is much simpler than below
		 * 
		 * System.out.println(car.make);
		 * System.out.println(car.model);
		 * System.out.println(car.color);
		 * System.out.println(car.year);
		 * 
		 */

	 
	 //or
	 
	 //Without the toString method, it will only print the address
	 //of the car object in memory
	 //The toString method is called implicitly and so if you made this
	 //method in your car class, it will use it so you don't have to
	 //explicitly type it out.
	 System.out.println(car);
   
	   
	}
}

class Car {

String make = "Ford";
String model = "Mustang";
String color = "red";
int year = 2021;

public String toString() {

	//could also do this
	//String string = make +"\n"+model+"\n"+color+"\n"+year;
	//and then you'd return string
	
	return make +"\n"+model+"\n"+color+"\n"+year;
	
} 
}
```

- Output
```
Ford
Mustang
red
2021
Ford
Mustang
red
2021
```