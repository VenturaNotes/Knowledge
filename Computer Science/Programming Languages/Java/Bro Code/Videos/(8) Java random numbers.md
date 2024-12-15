---
Source:
  - https://youtube.com/watch?v=VMZLPl16P5c
---
```java
/*
 * 
 * Important for game design
 * 
 */
import java.util.Random;

public class Main {

 public static void main(String[] args) {
  
  //Random is a name for the instance.
  // These are not true random numbers but pseudo-random numbers
  Random random = new Random();
  
  //Range of int is -2 billion to 2 billion

  // This is to return a random # from 1 to 6
  int x = random.nextInt(6)+1;

  // Double returns a random value of 0 and 1
  //double y = random.nextDouble();
  
  //Will give either true or false
  //boolean z = random.nextBoolean();
  
  System.out.println(x);
    
 }
}
```

- Output (will be a random number like 5 or 6)
```
6
```