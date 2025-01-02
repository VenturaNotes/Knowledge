---
Source:
  - https://youtube.com/watch?v=eboNNUADeIc
Reviewed: false
---
- Encapsulation adds a layer of security
	- Other classes won't have direct access to these values
- [[Encapsulation]]: attributes of a class will be hidden or private, can be accessed only through methods (getters & setters)
	- You should make attributes private if you don't have a reason to make them public/protected
```java
public class Main {

	public static void main(String[] args) {
		 Car car = new Car("Chevrolet", "Camaro", 2021);
		 //Use a getter method to access a private attribute
		 System.out.println(car.getMake());
		 System.out.println(car.getModel());
		 System.out.println(car.getYear());

		 car.setYear(2022);
		 System.out.println(car.getYear());


	}
}

class Car {
	private String make;
	private String model;
	private int year;

	Car(String make, String model, int year)
	{
		this.setMake(make);
		this.setModel(model);
		this.setYear(year);

		//Don't need this anymore b/c of setter methods
		//this.make = make;
		//this.model = model;
		//this.year = year;
	}

	public String getMake() {
		return make;
	}

	public String getModel() {
		return model;
	}

	public int getYear(){
		return year;
	}

	public void setMake(String make){
		this.make = make;
	}

	public void setModel(String model){
		this.model = model;
	}

	public void setYear(int year){
		this.year = year;
	}

}

```

Output
```
Chevrolet
Camaro
2021
2022
```