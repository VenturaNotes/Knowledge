[Video](https://youtube.com/watch?v=v5p_SUfi710)

```java
public class Main {

	public static void main(String[] args) {
		
		// method = a block of code that is executed whenever it is called upon

		//in our main method, we can call/invoke the hello method
		//Need to make a static reference to a static method

		//This will display the hello method 3 times:
		//hello();
		//hello();
		//hello();

		//You can also pass in a value or variable to a method
		//The values or variables that you're sending to a method are known as arguments
		//And they can be confused with parameters
		//You need a matching set of parameters for this

		//for the below to work, we need a string parameter
		// for parameters, you don't need to keep names of values consistent
		// (argument and parameter name don't need to be the same)
		String name = "Hello";
		hello(name);

		hello2("Bob",22);

		int x = 3;
		int y = 4;
		
		//even though z exists in the add() method, it is a local variable
		//it is only recognized by anything within the immediate set of curly braces
		int z = add(x,y);
		System.out.println(z);

		//This is also possible
		System.out.println(add(x,y));
	}


	//The convention for methods is to have the first letter lowercase
	//void is used when you have nothing to return
	static void hello(String name) {
		System.out.println("Hello" + name);
	}

	static void hello2 (String name, int age)
	{
		System.out.println("Hello " + name);
		System.out.println("You are " + name);

	}
	
	//Methods
	//Need to list data type of value we're returning
	static int add(int x, int y) {
		
		int z = x + y;
		return z;

		//also valid to just return x + y
		//return x+y;
		
	}
}
```

- Output
```
HelloHello
Hello Bob
You are Bob
7
7
```