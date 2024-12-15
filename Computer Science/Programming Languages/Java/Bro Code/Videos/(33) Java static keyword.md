---
Source:
  - https://youtube.com/watch?v=wa1HzkMqY9A
---
```java
public class Main {

	public static void main(String[] args) {
		
		// static = modifier. A single copy of a variable/method is created and shared.
		//			The class "owns" the static member

		//Anything that the class owns is shared by all instances of that class
		//meaning if we create objects from this class, they all have to share this
		//one variable or method. Only has 1 copy.
		
		Friend friend1 = new Friend("Sponegbob");
		Friend friend2 = new Friend("Patrick");
		Friend friend3 = new Friend("Patrick");

		//To call static method of friend class, you need to type the name of the Friend Class
		// (not the instance) 
		Friend.displayFriends();

		/*
		 * In the Math class, Math.round() is static because it wouldn't make sense
		 * to create a math object: Math math = new Math()
		 * It's more simple to type the name of the class and use the function that you want
		 * 
		 */
		

		//It's possible to access a static variable using an object instance name itself
		//but not recommended because it should be accessed in a static way.
		//Best practice is to type in name of class that owns static member followed by
		//static member you're trying to access
		//Since there is only 1 copy, all instances of friend class are forced to share
		//this static member
		//Below is a static reference
		//Will give us total number of friends we created in this class
		System.out.println(Friend.numberOfFriends);
	}
}

class Friend {


	String name;
	
	static int numberOfFriends;
	
	Friend(String name){
		this.name=name;
		numberOfFriends++;
	}	

	static void displayFriends()
	{
		System.out.println("You have "+numberOfFriends+" friends");
	}
}
```

- Output
```
You have 3 friends
3
```