---
Source:
  - https://youtube.com/watch?v=919IUhotDCo
---
```java
public class Main {

	public static void main(String[] args) {
		
		// logical operators = used to connect two or more expressions
		//
		//						&& = (AND) both conditions must be true
		// 						|| = (OR) either condition must be true
		//						! = (NOT) reverses boolean value of condition

// -------------------------------- Example 1 --------------------------------
/*
		int temp = 15;
		
		if(temp>30) {
			System.out.println("It is hot outside");
		}
		else if(temp>=20 && temp<=30) {
			System.out.println("It is warm outside");
		}
		else {
			System.out.println("It is cold outside");
		}

*/
// -------------------------------- Example 2 --------------------------------
/*
		Scanner scanner = new Scanner(System.in);
		
		System.out.println("You are playing a game! Press q or Q to quit");
        
        //Next will store the next key that you press within a string variable
		String response = scanner.next();
		
        //alternate if statement with same logic. OR
        // if(response.equals("q") || response.equals("Q")) {

		if(!response.equals("q") && !response.equals("Q")) {
			System.out.println("YOu are still playing the game *pew pew*");
		}
		else {
			System.out.println("You quit the game");
		}
*/	
	}
}
```

- Output for Example 1
```
It is cold outside
```

- Output for Example 2
```
You are playing a game! Press q or Q to quit
q
You quit the game
```