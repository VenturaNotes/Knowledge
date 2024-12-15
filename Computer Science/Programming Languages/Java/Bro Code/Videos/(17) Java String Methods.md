---
Source:
  - https://youtube.com/watch?v=P9hEmbfdiuc
---
- Reference datatypes in java are those which contains reference/address of dynamically created objects. These are not predefined like primitive data types. These are the reference types in Java [^1]
	- class types - This reference type points to an object of a class
	- array types - This reference type points to an array
	- Interface types - This reference type points to an object of a class which implements an interface
	
```java
public class Main {

	public static void main(String[] args) {
	 
	 // String = a reference data type that can store one or more characters
	 //   reference data types have access to useful methods
	 
	 String name = "Bro";
	 
	 boolean result = name.equals("bro"); //case is not ignored so returns false
	 boolean result2 = name.equalsIgnoreCase("bro"); //case is ignored so returns true
	 int result3 = name.length(); //returns 3
	 char result4 = name.charAt(0); //Returns B
	 int result5 = name.indexOf("o"); //Returns 2
	 boolean result6 = name.isEmpty(); //Returns False
	 String result7 = name.toUpperCase(); //BRO
	 String result8 = name.toLowerCase(); //bro
	 String result9 = name.trim(); //Removes empty space before and after characters you have
	 String result10 = name.replace('o', 'a'); //replaces all o with a

	 //typing "name." will prompt an entire list of methods that tell you what they do
	  
	 System.out.println(result);
	 System.out.println(result2);
	 System.out.println(result3);
	 System.out.println(result4);
	 System.out.println(result5);
	 System.out.println(result6);
	 System.out.println(result7);
	 System.out.println(result8);
	 System.out.println(result9);
	 System.out.println(result10);
	}
	
   }
```

- Output
```
false
true
3
B
2
false
BRO
bro
Bro
Bra
```
## References

[^1]: https://www.tutorialspoint.com/What-are-reference-data-types-in-Java#:~:text=Reference%20datatypes%20in%20java%20are,type%20points%20to%20an%20array