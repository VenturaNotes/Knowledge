---
Source:
  - https://youtube.com/watch?v=adTDlH0lhaA
Reviewed: false
---
```java
import java.util.InputMismatchException;
import java.util.Scanner;

public class Main {

	public static void main(String[] args) {
		
		// exception = 	an event that occurs during the execution of a program that,
		//				disrupts the normal flow of instructions

		//unexpected events that occur that will stop your program such
		//as dividing by 0. That's known as an arithmetic exception
		
		Scanner scanner = new Scanner(System.in);
		
		//surround any dangerous code within a try block
		try {
		
			System.out.println("Enter a whole number to divide: ");
			int x = scanner.nextInt();
		
			System.out.println("Enter a whole number to divide by: ");
			int y = scanner.nextInt();
		
			int z = x/y;
		
			System.out.println("result: " + z);
		}
		//program won't be interrupted if caught
		catch(ArithmeticException e) {
			System.out.println("You can't divide by zero! IDIOT!");
		}
		catch(InputMismatchException e) {
			System.out.println("PLEASE ENTER A NUMBER OMFG!!!");
		}
		//will catch all exceptions but not good practice
		//it's good practice to catch and handle individual exceptions though
		catch(Exception e) {
			//This is a common thing people type for this kind of exception
			System.out.println("Something went wrong");
		}
		//Good use of the finally block is to close any scanners which may be open
		//This will run no matter what. If there is no exception caught or there is
		//an exception caught, the finally block will always run.
		//Could close files as well
		finally {
			scanner.close();
		}
			
	}
}
```

Output
```
Enter a whole number to divide: 
0
Enter a whole number to divide by: 
0
You can't divide by zero! IDIOT!
```