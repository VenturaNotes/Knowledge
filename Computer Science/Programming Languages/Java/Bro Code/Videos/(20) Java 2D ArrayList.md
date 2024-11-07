[Video](https://youtube.com/watch?v=9tBxJoQF74E)

```java
import java.util.*;

public class Main {

	public static void main(String[] args) {
		
		//2D Arraylists is just a container for separate ArrayLists.
		//		You can do this for other collections too, but we've only covered ArrayLists

		ArrayList<ArrayList<String>> groceryList = new ArrayList<ArrayList<String>>();
		
		ArrayList<String> bakeryList = new ArrayList<String>();
		bakeryList.add("pasta");
		bakeryList.add("garlic bread");
		bakeryList.add("donuts");
		//System.out.println(bakeryList.get(0)); //Gets the 0th element of list
		
		ArrayList<String> produceList = new ArrayList<String>();
		produceList.add("tomatoes");
		produceList.add("zucchini");
		produceList.add("peppers");
		
		ArrayList<String> drinksList = new ArrayList<String>();
		drinksList.add("soda");
		drinksList.add("coffee");
		
		groceryList.add(bakeryList);
		groceryList.add(produceList);
		groceryList.add(drinksList);
		
		//Prints out entire list of lists
		System.out.println(groceryList);

		//Get first element of first list
		System.out.println(groceryList.get(0).get(0));
		
	}
}
```

- Ouput
```
[[pasta, garlic bread, donuts], [tomatoes, zucchini, peppers], [soda, coffee]]
pasta
```