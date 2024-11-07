[Video](https://youtube.com/watch?v=1nRj4ALuw7A)

```java
import java.util.ArrayList;

public class Main {

	public static void main(String[] args) {
			
		// ArrayList = 	a resizable array. 
		//				Elements can be added and removed after compilation phase
		//				store reference data types
		
		//Need to use wrapper class
		ArrayList<String> food = new ArrayList<String>();
		
		food.add("pizza");
		food.add("hamburger");
		food.add("hotdog");
		
		//food.set(0, "sushi"); //This will set the 0th index to "sushi"
		//food.remove(2); //Removes the element at 2nd index
		//food.clear(); //Removes all elements in array
		
		//Prints out elements in array
		for(int i=0; i<food.size(); i++) {
			System.out.println(food.get(i));
		}
	}
}
```

- Output
```
pizza
hamburger
hotdog
```