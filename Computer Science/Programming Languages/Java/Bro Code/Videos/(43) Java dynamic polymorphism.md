---
Source:
  - https://youtube.com/watch?v=tAIaK5LNatE
---
```java

import java.util.Scanner;
public class Main {

 public static void main(String[] args) {
  
  //Dynamic Polymorphism
  //ALSO KNOWN AS RUNTIME POLYMORPHISM
  
  Scanner scanner = new Scanner(System.in);

  //Sometimes we don't know what kind of animal we want

  // Benefit of dynamic polymorphism is that you can declare an object
  // and make space for it in memory even if you don't know what type
  // of object you want quite yet.
  Animal animal;

  /* 
   * Other examples:
   * In the pokemon series, you had to pick between a boy or girl.
   * You could declare that your data type is a human as a placeholder,
   * but you're going to use the appropiate game sprite for a boy or girl 
   * once you make your decision
   * 
   * In World of Warcraft, you have to pick a character class 
   * such as Warrior, Hunter, and Rogue. But when you first pick your
   * character, you don't quite have one picked out yet. So you have to
   * later decide which one to choose
   * 
   * Once an object does assume a form during runtime, 
   * it's going to inherit everything from the parent
   * classes. Overridden methods are in place of previous
   * methods
   * 
   * 
   */
  
  System.out.println("What animal do you want?"); 
  System.out.print("(1=dog) or (2=cat): ");
  int choice = scanner.nextInt();
  
  if(choice==1) {
   animal = new Dog();
   animal.speak();
  }
  else if(choice==2) {
   animal = new Cat();
   animal.speak();
  }
  else {
   animal = new Animal();
   System.out.println("That choice was invalid");
   animal.speak();
  }
  scanner.close();
 }
}

class Animal {

 public void speak() {
  System.out.println("animal goes *brrrr*");
 }
}

class Dog extends Animal{

 @Override
 public void speak() {
  System.out.println("dog goes *bark*");
 }
}
class Cat extends Animal{

 @Override
 public void speak() {
  System.out.println("cat goes *meow*");
 }
}
```

Output
```
What animal do you want?
(1=dog) or (2=cat): 1
dog goes *bark*
```