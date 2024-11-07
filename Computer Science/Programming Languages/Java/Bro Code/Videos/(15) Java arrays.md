[Video](https://youtube.com/watch?v=ei_4Nt7XWOw)

``` java
public class Main {

	public static void main(String[] args) {
			
		// array = used to store multiple values within a single variable
		
		//data type values you're adding needs to be consistent with the data type of the array
		// This allocates the amount of elements we need and then storing values later on in program
		String[] cars = new String[3];
		
		cars[0] = "Camaro";
		cars[1] = "Corvette";
		cars[2] = "Tesla";

		//Alternative method
		String[] cars2 = {"One", "Two", "Three"};

		//ArrayIndexOutOfBoundsException if we try to get element from array
		//		greater than its size
		
		//Iteraters through all elements of array
		for(int i=0; i<cars.length; i++) {
			System.out.println(cars[i]);
		}
	
	}
}
```

- Output
```
Camaro
Corvette
Tesla
```