---
Source:
  - https://youtube.com/watch?v=pSokndJB3Pw
---
```java
import java.util.Random;
//********************************************
public class Main {

	public static void main(String[] args) {
	 
	 //local =  declared inside a method
	 //   visible only to that method
	 
	 //global  = declared outside a method, but within a class
	 //   visible to all parts of a class
	 
	 DiceRoller diceRoller = new DiceRoller();
	 
	}
   }
   //********************************************
class DiceRoller {
	
	Random random;
	int number;
	
	DiceRoller(){


	 // These are local variables
	 // You could pass them as arguments to another method or
	 // You could declare them as global so other methods have access
	 // Random random = new Random();
	 // int number = 0;

	 random = new Random();
	 roll();
	}
	
	void roll() {
	 number = random.nextInt(6)+1;
	 System.out.println(number);
	}

	/*
	 * 
	 * //Below is a great way of passing local variables as arguments
	 * void roll(Random random, int number) {
	 * 		number = random.nextInt(6)+1;
	 * 		System.out.println(number);
	 * }
	 * 
	 */
   }
   //********************************************
```

- Output
```
6
```