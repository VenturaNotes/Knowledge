---
Source:
  - https://youtube.com/watch?v=wAEPokhj5Q4
Reviewed: false
---
```java
// Scanner is a java utility pack
import java.util.Scanner;

public class Main {

 public static void main(String[] args) {
  
  //This is object oriented programming
  // Can be used to read contents of files
  Scanner scanner = new Scanner(System.in);
  
  System.out.println("What is your name? ");
  String name = scanner.nextLine();
  
  System.out.println("How old are you? ");
  int age = scanner.nextInt();
  
  //This clears the scanner for us.
  //We need to do this because the nextLine() method will read an entire line of text
  // and will stop when reaching a new line character. So when we call the nextLine method, 
  // the scanner is going to be empty. If we call a different method that doesn't read a
  // newLine character such as nextInt(). Submitting 18 + enter will give 18\n and \n will
  // still be with scanner when called again.
  scanner.nextLine();
  
  System.out.println("What is your favorite food?");
  String food = scanner.nextLine();
   
  System.out.println("Hello "+name);
  System.out.println("You are "+age+" years old");
  System.out.println("You like "+food);

  //This closes the scanner
  scanner.close();
 } 
}
```

- Output
```
What is your name? 
Julian
How old are you? 
23
What is your favorite food?
Pizza
Hello Julian
You are 23 years old
You like Pizza
```