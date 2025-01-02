---
Source:
  - https://youtube.com/watch?v=GhslBwrRsnw
Reviewed: false
---
```java
public class Main {

	public static void main(String[] args) {
		
		/*
		 * interface = a template that can be applied to a class.
		 * 			   similar to inheritance, but specifies what a class has/must do
		 * 			   classes can apply more than one interface
		 * 			   inheritance is limited to 1 super
		 * 
		 * With interfaces, you can declare variables like normally with inheritance.
		 * You can also declare some methods and you do not need to create a body for these
		 * methods. When a class is implementing one of these interfaces, they need to implement
		 * and define what the method is going to do.
		 * 
		 * 
		 */
		Fish fish = new Fish();
		
		fish.hunt();
		fish.flee();

		Rabbit rabbit = new Rabbit();
		rabbit.flee();

		Hawk hawk = new Hawk();
		hawk.hunt();
				
	}
}
interface Prey {
	void flee();
}
interface Predator {

	void hunt();
}

class Rabbit implements Prey{

	@Override
	public void flee() {
		System.out.println("*The rabbit is fleeing*");
		
        }
}
class Hawk implements Predator{


	@Override
	public void hunt() {
		System.out.println("*The hawk is hunting*");
		
        }
}
//Can implement 2 interfaces
class Fish implements Prey,Predator{


	@Override
	public void hunt() {
		System.out.println("*The fish is hunting for a smaller fish*");
		
	}

	@Override
	public void flee() {
		System.out.println("*The fish is fleeing from a larger fish*");
		
	}
}
```

- Output
```
*The fish is hunting for a smaller fish*
*The fish is fleeing from a larger fish*
*The rabbit is fleeing*
*The hawk is hunting*
```