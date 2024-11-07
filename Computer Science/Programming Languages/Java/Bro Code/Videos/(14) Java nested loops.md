[Video](https://youtube.com/watch?v=oF3nBQFfpeM)

```java
import java.util.Scanner;

public class Main {

	public static void main(String[] args) {
		
		// nested loops = a loop inside of a loop
		
		Scanner scanner = new Scanner(System.in);
		int rows;
		int columns;
		String symbol = "";
		
		System.out.println("Enter # of rows: ");
		rows = scanner.nextInt();
		System.out.println("Enter # of columns: ");
		columns = scanner.nextInt();
		System.out.println("Enter symbol to use: ");
		// next() will split the line up into individual words, 
		// returning individual text Strings one at a time.
		// In this case, it will just take out a word and ignore text after a " "
		symbol = scanner.next();
		
		for(int i=1; i<=rows; i++) {
			System.out.println();
			for(int j=1; j<=columns;j++) {
				System.out.print(symbol);
			}
		}	

		scanner.close();
	}
}
```

- Output
```
Enter # of rows: 
3
Enter # of columns: 
3
Enter symbol to use: 
#

###
###
###%    
```