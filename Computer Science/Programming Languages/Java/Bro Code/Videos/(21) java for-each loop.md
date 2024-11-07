[Video](https://youtube.com/watch?v=_IT8F5W0ZO4)

```java
import java.util.ArrayList;

public class Main {

	public static void main(String[] args) {
		
		// This is known as an enchaned for-loop
		// for-each = 	traversing technique to iterate through the elements in an array/collection
		//				less steps, more readable
		//				less flexible
		
		//Example with array
		//String[] animals = {"cat","dog","rat","bird"};

		//Example withe collection
		ArrayList<String> animals = new ArrayList<String>();
		
		animals.add("cat");
		animals.add("dog");
		animals.add("rat");
		animals.add("bird");
		
		for(String i : animals) {
			System.out.println(i);
		}
	}
}
```

- Output
```
cat
dog
rat
bird
```