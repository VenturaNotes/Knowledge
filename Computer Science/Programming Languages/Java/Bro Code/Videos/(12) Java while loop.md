---
Source:
  - https://youtube.com/watch?v=t6gmQaTMTtM
---
- [[while loop]] = executes a block of code as long as a it's condition remains true
```java
import java.util.Scanner;

public class Main {

	public static void main(String[] args) {

		Scanner scanner = new Scanner(System.in);
		String name = "";
		
		while(name.isBlank()) {
			System.out.print("Enter your name: ");
			name = scanner.nextLine();
		}
		System.out.println("Welcome "+name);

        //Do loop ensures we run block of code once
        //and then condition is checked after
        do {
			System.out.print("Enter your name: ");
			name = scanner.nextLine();
		} while(name.isBlank());

		System.out.println("Welcome "+name);

        scanner.close();
	}
}
```

- Output
```
Enter your name: Julian
Welcome Julian
Enter your name: Julian
Welcome Julian
```
