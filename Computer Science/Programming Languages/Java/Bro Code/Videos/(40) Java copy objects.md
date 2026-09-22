---
Source:
  - https://youtube.com/watch?v=ljGH04_ASG4
---
```java
//*********************************************
public class Main {

	public static void main(String[] args) {
		
		
		Car car1 = new Car("Chevrolet","Camaro",2021);
		//Car car2 = new Car("Ford","Mustang",2022);
		//car2.copy(car1);
		Car car2 = new Car(car1);

		//This will copy the attributes from car1 to car2 w/ different
		//memory addreses:
		//car2.copy(car1);

		//Don't do this to copy attributes from car1 to car2.
		//Car2 will reflect Car1, but that's because they're pointing to the same address:
		
		//car2 = car1;
		
		System.out.println(car1);
		System.out.println(car2);
		System.out.println();
		System.out.println(car1.getMake());
		System.out.println(car1.getModel());
		System.out.println(car1.getYear());
		System.out.println();
		System.out.println(car2.getMake());
		System.out.println(car2.getModel());
		System.out.println(car2.getYear());		
	
	}
}
//*********************************************
class Car {

	
	private String make;
	private String model;
	private int year;
	
	Car(String make,String model,int year){
		this.setMake(make);
		this.setModel(model);
		this.setYear(year);
	}
	
	//Overloaded Constructor
	//Allows you to construct a car object with the values of a
	//different car object
	Car(Car x){
		this.copy(x);
	}
	
	public String getMake() {
		return make;
	}
	
	public String getModel() {
		return model;
	}
	
	public int getYear() {
		return year;
	}
	
	public void setMake(String make) {
		this.make = make;
	}
	
	public void setModel(String model) {
		this.model = model;
	}
	
	public void setYear(int year) {
		this.year = year;
	}
	
	public void copy(Car x) {
		this.setMake(x.getMake());
		this.setModel(x.getModel());
		this.setYear(x.getYear());
	}
		
}
```

Output
```
Car@7ad041f3
Car@251a69d7

Chevrolet
Camaro
2021

Chevrolet
Camaro
2021
```