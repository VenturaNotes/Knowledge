---
Source:
  - https://youtube.com/watch?v=oKZnHNM9Ew4
---
```java
//******************************************
public class Main {

	public static void main(String[] args) {
		
		// super = 	keyword refers to the superclass (parent) of an object 
		//			(assuming you're using inheritance)
		//			very similar to the "this" keyword
		
		Hero hero1 = new Hero("Batman",42,"$$$");
		System.out.println(hero1.name);
		System.out.println(hero1.age);
		System.out.println(hero1.power);

		Hero hero2 = new Hero("Superman",43,"everything");
		System.out.println(hero2.toString());
		
	}
}
//******************************************
class Person {


	String name;
	int age;
	
	//still need to setup the parameters for this super class
	//for name and age
	Person(String name,int age){
		this.name = name;
		this.age = age;
	}
	
	public String toString() {
		return this.name + "\n" + this.age + "\n";
	}
	
}//******************************************
class Hero extends Person{


	String power;
	
	Hero(String name,int age,String power){	
		//send name value and age value to the super class
		//to the constructor of the super class
		//super refers to the parent class
		super(name,age);
		this.power = power;
	}
	
	//I think this is an overrided function?
	public String toString() {
		//uses the parent class toString method
		return super.toString()+this.power;
	}
}//******************************************
```

- Output
```
Batman
42
$$$
Superman
43
everything
```