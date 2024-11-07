[Video](https://youtube.com/watch?v=pZHJU9T0vwE)

```java
public class Main {

    public static void main(String[] args) {
     
     // expression =     operands & operators
     // operands =  values, variables, numbers, quantity
     // operators = + - * / % 

     //Modulus gives you remainder of division

     double friends = 10;

     //longhand of incrementing
    //  friends = friends + 5;
    //  friends = friends - 5;
    //  friends = friends * 5;
    //  friends = friends / 5;
    //  friends = friends % 5;

     //shorthand of incrementing/decmenting
     //friends++;
     //friends--;

     //program will truncate remainder decimal values
    //  friends = friends / 3;
    //  System.out.println(friends);

    // for an easy fix
    // cast result as a double or float value. friends also needs to change to double since it can't store decimal
    // however, that would make casting redundant but for its purpose, it still does what we need it to do.
    friends = (double) friends / 3;
    System.out.println(friends);

    } 
   }
```

- Output
```
3.3333333333333335
```