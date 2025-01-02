---
Source:
  - https://youtube.com/watch?v=nhIB2S6NiFA
Reviewed: false
---
```java
//****************************************************
public class Main {

	public static void main(String[] args) {

		//Common arrays that we use
		int[] numbers = new int[3];
		char[] characters = new char[4];
		String[] strings = new String[5];
		
		//This is an array that can hold food objects for us
		//Food[] refrigerator = new Food[3];
		
		Food food1 = new Food("pizza");
		Food food2 = new Food("hamburger");
		Food food3 = new Food("hotdog");
		
		Food[] refrigerator = {food1,food2,food3};
		
		//This is how we would've placed the Food objects in the Food Array
		//refrigerator[0] = food1;
		//refrigerator[1] = food2;
		//refrigerator[2] = food3;
		
		System.out.println(refrigerator[0].name);
		System.out.println(refrigerator[1].name);
		System.out.println(refrigerator[2].name);
		
	}
}
//****************************************************
class Food {

	String name;
	
	//Constructor is the same name as the class
	Food(String name){
		this.name = name;
	}	
}//****************************************************
```

- Output
```
pizza
hamburger
hotdog
```