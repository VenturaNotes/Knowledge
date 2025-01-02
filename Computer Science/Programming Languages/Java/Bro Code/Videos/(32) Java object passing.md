---
Source:
  - https://youtube.com/watch?v=nRJWltqX4UY
Reviewed: false
---
```java
public class Main {

	public static void main(String[] args) {
			
		Garage garage = new Garage();
		
		Car car1 = new Car("BMW");
		Car car2 = new Car("Tesla");
		
		garage.park(car1);
		garage.park(car2);
		
	}
}

class Garage {


	//parameter has data type of car
	void park(Car car) {
		System.out.println("The "+car.name+" is parked in the garage");
	}
}
class Car {


	String name;
	
	Car(String name){
		this.name = name;
	}
	
}
```

- Output
```
The BMW is parked in the garage
The Tesla is parked in the garage
```