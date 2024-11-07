[Video](https://youtube.com/watch?v=lhf8gaUx4yU)

```java
public class Main {

	public static void main(String[] args) {

		//Contructor = special method that is called when an object is instantiated (created)
		
		//Constructor will create an instance of a class for us / instantiate an object
		//We can even pass in arugments when instantiating 
		//If we'd like to assign arguments to attributes of our object,
		// we can setup constructor within the class
		// With the help of constructors, we can construct objects with different qualities
		// They are objects instantiated from the human class, but they have different attributes
		// that make them unique
		Human human1 = new Human("Rick",65,70);
		Human human2 = new Human("Morty",16,50);
			
		human1.drink();
		human2.eat();
		
	}
}
 class Human {

	String name;
	int age;
	double weight;
	
	//This is the constructor
	//They allow us to assign different attributes to each object we instantiate
	Human(String name,int age,double weight){
		
		//We need to assign each value to human1 (this specific object)
		//Imagine we replace "this" with the name of the object "human1"
		this.name = name;
		this.age = age;
		this.weight = weight;
	}
	
	//In order to access an object's attributes from within its own class,
	//we have to use the "this" keyword
	void eat() {
		System.out.println(this.name+" is eating");
	}
	void drink() {
		System.out.println(this.name+" is drinking *burp*");
	}
		
}
```

- Output
```
Rick is drinking *burp*
Morty is eating
```