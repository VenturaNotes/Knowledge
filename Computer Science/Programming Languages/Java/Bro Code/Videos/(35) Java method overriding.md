---
Source:
  - https://youtube.com/watch?v=E-0MMeNi5Cw
---
```java
//*******************************************
class Main {

	public static void main(String[] args) {
		
		// method overriding = 	Declaring a method in sub class,
		//						which is already present in parent class.
		//						done so that a child class can give its own implementation
		
		Animal animal = new Animal();
		Dog dog = new Dog();
		
		//each class is going to use the method that is more closely
		//associated with it. If the dog class gets rid of its speak method
		//it will use the Animal class's speak method
		dog.speak();
				
	}
}

class Animal {

	//Considered overridden method
	void speak() {
		System.out.println("The animal speaks");
	}
}

//Dog inherits everything that the Animal class has
class Dog extends Animal{

	//overriding method
	//Lets users know that it is an overriding method, but no additional functionality
	@Override //not necessary but good practice
	void speak() {
		System.out.println("The dog goes *bark*");
	}
}
```

- Output
```
The dog goes *bark*
```