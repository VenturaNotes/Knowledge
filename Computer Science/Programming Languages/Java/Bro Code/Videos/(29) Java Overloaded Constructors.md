---
Source:
  - https://youtube.com/watch?v=Xngu-8pt_TA
---
```java
public class Main {

	public static void main(String[] args) {
		
		//overloaded constructors = multiple constructors within a class with the same name,
		//							but have different paraametrs
		//							name + parameters = signature
		
		Pizza pizza = new Pizza("thicc crust","tomato","mozzerella","pepperoni");

		//Possible because we have an overloaded constructor
		//The attributes that are not assigned will equal null
		Pizza pizza1 = new Pizza("thicc crust","tomato","mozzerella");
		
		System.out.println("Here are the ingredients of your pizza: ");
		System.out.println(pizza.bread);
		System.out.println(pizza.sauce);
		System.out.println(pizza.cheese);
		System.out.println(pizza.topping);
				
	}
}

class Pizza {


	String bread;
	String sauce;
	String cheese;
	String topping;
	
	Pizza(){
		
	}
	
	Pizza(String bread){
		
		this.bread = bread;
	}
	
	Pizza(String bread,String sauce){
		
		this.bread = bread;
		this.sauce = sauce;
	}
	
	Pizza(String bread,String sauce,String cheese){
		
		this.bread = bread;
		this.sauce = sauce;
		this.cheese = cheese;
	}
	
	//If the constructor has the same name and parameters as another constructor, they'll
	//have the same signature making that not legal
	Pizza(String bread,String sauce,String cheese,String topping){
		
		this.bread = bread;
		this.sauce = sauce;
		this.cheese = cheese;
		this.topping = topping;
	}
}
```

- Output
```
Here are the ingredients of your pizza: 
thicc crust
tomato
mozzerella
pepperoni
```
