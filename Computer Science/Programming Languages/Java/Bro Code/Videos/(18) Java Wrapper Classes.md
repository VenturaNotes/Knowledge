[Video](https://youtube.com/watch?v=4MiEznM8y8Q)

```java
public class Main {

	public static void main(String[] args) {
	 
	 // wrapper class =  provides a way to use primitive data types as reference data types
	 //     reference data types contain useful methods
	 //     can be used with collections (ex.ArrayList)
	 

	 //The string class takes some useful methods and strings are an example of a reference data type
	 //Primitve data types are lot faster than reference data types
	 //		Doesn't take as much time or processing power
	
	 //Each primitive data type has a corresponding wrapper class
	 // There is also a naming convention. For the wrapper class, the first letter is capital
	 //		and the entire name is spelled out

	 //primitive  //wrapper
	 //---------  //-------
	 // boolean  Boolean
	 // char   Character
	 // int   Integer
	 // double  Double

	 // You use wrapper classes to create a reference data type.
	 
	 // autoboxing = the automatic conversion that the Java compiler makes between the primitive types and their corresponding object wrapper classes
	 // unboxing = the reverse of autoboxing. Automatic conversion of wrapper class to primitive
	 
	 //This is an example of autoboxing
	 Boolean a = true;
	 Character b = '@';
	 Integer c = 123;
	 Double d = 3.14;

	 //The advantages of these data types is that they may have some useful methods

	 //This shows unboxing since the variable still behaves like a primitive data type.
	 if (a==true)
	 {
		System.out.println("This is true");
	 }
	 
	}
	
   }
   
```

- Output
```
This is true
```