---
Source:
  - https://youtube.com/watch?v=w0VTlSOXBs8
---
```java
import java.util.Scanner;

public class Main {

	public static void main(String[] args) {
		
        double test1 = 3.14;
        double test2 = -10;

        //Returns the maximum number between variables
        Math.max(test1,test2);

        //Finds lesser of 2 values
        Math.min(test1,test2);

        //Returns absolute value of variable
        Math.abs(test2);

        //Returns the sqrt
        Math.sqrt(test1);

        //rounds to nearest integer
        Math.round(test1);

        //rounds up to nearest integer
        Math.ceil(test1);

        //Will always round down
        Math.floor(test1);

        //Finds the hypotenuse of a triangle
		double x;
		double y;
		double z;
		
		Scanner scanner = new Scanner(System.in);
				
		System.out.println("Enter side x: ");
        //Wants a double variable
		x = scanner.nextDouble();
		System.out.println("Enter side y: ");
		y = scanner.nextDouble();
		
		z = Math.sqrt((x*x)+(y*y));
		
		System.out.println("The hypotenuse is : "+z);
		
		scanner.close();
				
	}
}
```

- Output
```
Enter side x: 
3
Enter side y: 
4
The hypotenuse is : 5.0
```