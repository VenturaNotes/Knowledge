---
status: open
priority: normal
dateCreated: 2026-02-11T23:52:23.279-05:00
dateModified: 2026-02-11T23:52:23.279-05:00
reminders:
  - id: rem_1770871910847_9txvulkqf
    type: relative
    description: ""
    relatedTo: scheduled
    offset: -PT0H
tags:
  - task
  - status/incomplete
  - type/website
Source:
  - https://www.w3schools.com/java/default.asp
Reviewed: false
---
## Exercises
### Syntax
- (1) Drag and drop the correct class name to match the file name `Main.java`
```java
public class Main {
	public static void main(String[] args) {
		System.out.println("Hello");
	}
}
```
- (2) In Java, each code statement must end with a semicolon (;).
	- True
- (3) Drag and drop the missing symbol to complete the Java statement.
	- `System.out.println("Hello World!");`
- (4) A file containing a class called MyClass should be saved as:
	- `MyClass.java`
- (5) True or False: Java is case-sensitive: `MyClass` and `myclass` has different meaning
	- True
- (6) Insert the missing part of the code below to output "Hello World".
```java
public class MyClass {
	public static void main(String[] args) {
		System.out.println("Hello World");
	}
}
```
- (7) Drag and drop the correct parameter for the `main` method
```java
public class MyClass {
	public static void main(String[] args) {
		System.out.println("Hello")
	}
}
```
### Output Text
- (1) Drag and drop the correct method to print `Hello World` in Java
	- `System.out.println("Hello World");`
- (2) Drag and drop the correct text so the code prints `Hello Java`.
	- `System.out.println("Hello Java");`
- (3) Make `World` print on a new line
```Java
System.out.print("Hello");
System.out.println("World");
```
- (4) Text inside `println()` must be wrapped inside double quotes.
	- True
- (5)) The difference between `println()` and `print()` is that:
	- The `println()` methods adds a line break after printing, while `print()` does not
### Output Numbers
- (1) Make the program print `15`
	- `System.out.println(15);`
- (2) Print `20`
	- `System.out.println(10 + 10);`
- (3) Print `21`
	- `System.out.println(7*3);`
- (4) Print number 25
	- `System.out.println(25);`
- (5) Give output `System.out.println(5+5);`
	- `10`
- (6) To do arithmetic, numbers should not be wrapped in double quotes.
	- True
- (7) What is output of `System.out.println("10"+5);`
	- 105
		- #question Is this a number or string?
### Comments
- (1) What is syntax for single-line comment in Java?
	- `// This is a single-line comment`
- (2) What is the meaning of comments in Java?
	- To explain and document code
- (3) Comments in Java are written with special characters. Insert the missing parts
```java
// This is a single-line comment
/* This is a multi-line comment */
```
- (4) When to use multi-line comments?
	- For longer comments
- (5) Create a multi-line comment in Java
```java
/*
This is a multi-line comment
*/
```
### Variables
- (1) Drag and drop the correct data type to declare an integer variable.
```java
int myNum = 15;
System.out.println(myNum);
```
- #question Is `integer` ever used? Or like `Integer`?
- (2) Initialize the variable `age`
```java
String name = "John";
int age = 25;
System.out.println(age);
```
- (3) Drag and drop the correct values to complete the variable declarations.
```java
double price = 19.99;
String city = "London";
```
- (4) To create a variable in Java, you must specify the type first.
	- True
- (5) Create a variable named `carName` and assign the value `Volvo` to it.
	- `String carName = "Volvo"`
- (6) Create a variable named `maxSpeed` and assign the value `120` to it.
	- `int maxSpeed = 120`
### Print Variables
- (1) Drag and drop the correct method to print the variable `myNum`
```java
int myNum = 10;
System.out.println(myNmu);
```
- (2) Drag and drop the correct variable to complete the print statement.
```java
String name = "Jenny";
System.out.println("Hello " + name);
```
- (3) Drag and drop the correct expression to print the sum of `x` and `y` on one line.
```java
int x = 5, y = 7;
System.out.println(x+y);
```
- (4) Drag and drop the correct expression to print `Total: 7`.
```java
int a = 3, b = 4;
System.out.println("Total: " + (a+b));
```
- (5) Which method is often used to print variables?
	- `println()`
- (6) Insert the missing parts to combine both text and a variable.
```java
String name = "John";
System.out.println("Hello " + name);
```
- (7) Display the sum of `5 + 10`, using two variables: `x` and `y`.
```java
int x = 5;
int y = 10;
System.out.println(x + y);
```
- (8) Create a variable called `z`, assign `x + y` to it, and display the result
```java
int x = 5;
int y = 10;
int z = x + y;
System.out.println(z);
```
### Multiple Variables
- (1) Drag and drop the correct variable name to complete the declaration of multiple string variables.
```java
String firstName = "John", lastName = "Doe";
System.out.println(firstName + " " + lastName);
```
- (2) Which of the following declares multiple variables of the same type?
	- `int x = 1, y = 2, z = 3;`
- (3) Fill in the missing parts to create three variables of the same type, using a comma-separated list:
```java
int x = 5, y = 6, z = 50;
System.out.println(x + y + z);
```
- (4) Fill in the missing parts to assign the same value to multiple variables in one line:
```java
int x, y, z;
x = y = z = 50;
System.out.println(x + y + z);
```
### Variable Names
- (1) Drag and drop the correct variable name to replace the blank so the code compiles.
```java
int myVar = 10;
System.out.println(myVar);
```
- (2) Drag and drop the identifier that makes this code invalid because it duplicates the first variable name.
```java
int myNum = 5;
int myNum = 10; //Illegal - same name used twice
```
- (3) Which is NOT a legal variable name
	- `int int = 20;`
- (4) True or False: All Java variables must be identified with unique names.
	- True
- (5) Create a variable named `maxSpeed` and assign the value `120` to it.
	- `int maxSpeed = 120;`
### Data Types
- (1) Drag and drop the correct integer value to complete the code.
```java
int myNum = 10
System.out.println(myNum);
```
- (2) Drag and drop the correct decimal value to assign to the `double` variable.
```java
double my Decimal = 10.75;
System.out.println(myDecimal);
```
- (3) Drag and drop the correct Java data type keyword to declare a variable that can store true or false.
```java
boolean isJavaFun = true;
System.out.println(isJavaFun);
```
- (4) What is an `int` in Java?
	- A data type representing integers.
- (5) Add the correct data type for the following variables:
```java
int myNum = 9;
float myFloatNum = 8.99f;
char myLetter = 'A';
boolean myBool = false;
String myText = "Hello World";
```
- (6) `byte, short, int, long, float, double, boolean` and `char` are called
	- primitive data types
		- #question What does primitive data type mean?
### Numbers
- (1) Drag and drop the correct integer type to declare a variable named `age` with the value `25`.
```java
int age = 25;
System.out.println(age);
```
- (2) Drag and drop the correct floating-point type to declare a variable named `price` with a float value.
```java
float price = 19.99f;
System.out.println(price);
```
- (3) Drag and drop the correct integer value to complete the code.
```java
int myNum = 25;
System.out.println(myNum);
```
- (4) Integer types are used to store:
	- Whole numbers
		- #question What is the difference between whole numbers and integers? Can whole numbers be a subset of the integers similar to the natural numbers?
- (5) Which is NOT a valid integer type?
	- size
		- #question What is `short` as an integer type? If it exists?
- (6) A `float` variable has greater precision than `double`.
	- False
- (7) What is the correct letter suffix to use for float values?
	- `f`
		- #question Why do we need this?
### Boolean Types
- (1) Drag and drop the correct keyword to declare a boolean variable named `isSunny`
```java
boolean isSunny = true;
System.out.println(isSunny);
```
- (2) Drag and drop the correct boolean value to assign to `isJavaFun`.
```java
boolean isJavaFun = true;
System.out.println(isJavaFun);
```
- (3) What is the correct syntax for declaring a boolean variable in Java?
	- `boolean isJavaFun = true;`
- (4) The boolean data type can take two values, which are
	- `true and false`
- (5) What is the output of the following code?
```java
boolean isFishTasty = false;
System.out.println(isFishTasty);

// Output: false
```
### Characters
- (1) Drag and drop the correct character to assign the letter `A` to `grade`.
	- `char grade = 'A';`
- (2) Which data type is used to store a single character?
	- `char`
- (3) The character inside a `char` variable must be surrounded by
	- Single quotes
- (4) What is the output of the following code?
```java
char myLetter = 'B';
System.out.println(myLetter);

// Output: B
```
- (5) To store more than one character (a text), you must use:
	- The `String` data type
- (6) Drag and drop the correct value to assign `"John"` to the `name` variable
	- `"John"`
- (7) What is the output of the following code?
```java
String name = "John Doe";
System.out.println(name);

// Output: John Doe
```
### Type Casting
- (1) Drag and drop the correct value to show [[implicit casting|widening casting]] (automatic type conversion)
```java
int myInt = 9;
double myDouble = myInt
```
- (2) Drag and drop the correct syntax to perform [[Narrowing type casting|narrowing casting]] (manual).
```java
double myDouble = 9.78;
int myInt = (int) myDouble;
```
- (3) What is Type Casting?
	- When you assign a value of one primitive data type to another type.
		- #question Can `Integer` work this way too?
- (4) Passing a smaller size type to a larger size type, is called:
	- Widening Casting
- (5) True or False: Narrowing casting must be done manually
	- True
		- #question Why? Is it because you lose data so you need to make sure that's what you want to do?
- (6) What is the output of the following code?
```java
double myDouble = 5.99d;
int myInt = (int) my Double;
System.out.println(myInt);

// Output: 5
```
- #question Is the `d` suffix required for `double`?
- (7) Convert the following `double` type (myDouble) to an `int` type
```java
double myDouble = 9.78d;
int myInt = (int) myDouble;
```
### Operators
- (1) Drag and drop the correct operator to add the numbers
	- `int sum = 5 + 3;`
- (2) Drag and drop the correct operator to perform division.
	- `int reult = 10 / 2;`
- (3) Operators are used to:
	- Perform operations on variables and values
- (4) Multiply `10` with `5`, and print the result.
	- `System.out.println(10*5);`
- (5) Divide `10` by `5`, and print the result
	- `System.out.println(10/5);`
- (6) Use the correct operator to increase the value of the variable `x` by `1`.
```java
int x = 10;
++x;
```
- #question What is the difference between `++x` and `x++`
- (7) Use the addition assignment operator to add the value `5` to the variable `x`.
```java
int x = 10;
x+=5;
```
### Strings
- (1) Drag and drop the correct text to assign `Hello World` to the variable `greeting`
	- `String greeting = Hello World;`
- (2) Drag and drop the correct method to get the length of the string `txt`.
```java
String txt = "Hello";
System.out.println(txt.length())
```
- (3) Drag and drop the correct method to find the position of `World` inside the string
```java
String txt = "Hello World";
System.out.println(txt.indexOf("World"));

// Output: 6
```
- (4) Strings in Java are used to
	- Store text
- (5) Fill in the missing part to create a `greeting` variable of type `String` and assign it the value `Hello`
	- `String greeting = "Hello";`
- (6) Use the correct method to print the length of the `txt` string.
```java
String txt = "Hello";
System.out.println(txt.length());
```
- (7) What is the output of the following code?
```java
String name = "John Doe";
System.out.println(name);

// Output: John Doe
```
- (8) Return the index (position) of the first occurrence of "e" in the following string:
```java
String txt = "Hello Everybody";
System.out.println(txt.indexOf("e"));

// Comment
// It seems like the question was hard-coded and labeled the below
// incorrect, but it does work when I complied it on an online java
// compiler. A single quotation for 'e' should be allowed

String txt = "Hello Everybody";
System.out.println(txt.indexOf('e'));

```
### String Concatenation
- (1) Drag and drop the correct operator to combine `firstName` and `lastName` into one string.
```java
String firstName = "John";
String lastName = "Doe";
System.out.println(fristName + lastName);
```
- (2) Drag and drop the correct operator to add `"World!"` to the string `text`.
```java
String text = "Hello";
text = text + "World!";
System.out.println(text);
```
- (3) Which operator can be used to combine strings?
- (4) Use the correct operator to concatenate two strings
```java
String firstName = "John ";
String lastName = "Doe";
System.out.println(firstname+lastName);
```
- (5) Use the correct method to concatenate two strings:
```java
String firstName = "John ";
String lastName = "Doe";
System.out.println(firstName.concat(lastName));
```
### Strings and Numbers
- (1) Drag and drop the correct operator to add two integers `a` and `b`
```java
int a = 10;
int b = 20;
System.out.println(a + b);
```
- (2) Drag and drop the correct operator to concatenate the two strings `first` and `second.`
```java
String first = "Hello";
String second = "World";
System.out.println(first + second);
```
- (3) Java uses the `+` operator for both addition and concatenation. True or False: Strings are added and numbers are concatenated
	- False
- (4) What is the output of the following code?
```java
int x = 50;
int y = 25;
int z = x + y;
System.out.println(z);

// Output: 75
```
- (5) What is the output of the following code?
```java
String x = "50";
String y = "25";
Strng z = x + y;
System.out.println(z);

// Output: 5025
```
### Special Characters
- (1) Drag and drop the correct escape character to move `World!` to a new line.
	- `String txt = "Hello \n World!";`
- (2) Which of the following correctly uses special characters in Java String?
	- `String txt = "We are the so-called \"Vikings\" from the north.";`
- (3) What does the `\n` escape character do?
	- Insert a new line
- (4) You can insert a single backslash in a string with
	- `\\`
### Math
- (1) Drag and drop the correct method to return the smallest value.
	- `int result = Math.min(5, 10);`
- (2) Drag and drop the correct method to return the square root of 64.
	- `double result = Math.sqrt(64);`
- (3) Drag and drop the correct method to return the absolute value of `-7`.
	- `int result = Math.abs(-7);`
- (4) What is the output of the following code? `Math.min(5, 10);`
	- 5
- (5) Use the correct method to find the highest value of `x` and `y`.
```java
int x = 5;
int y = 10;
Math.max(x, y);
```
- (6) Use the correct method to find the square root of `x`
```java
int x = 16;
Math.sqrt(x);
```
- (7) Use the correct method to return a random number between 0 (inclusive), and 1 (exclusive).
```java
Math.random()
```
### Booleans
- (1) Drag and drop the correct operator 
- (2)
- (3)
- (4)
- (5)
- (6)
### If
- (1)
- (2)
- (3)
- (4)
- (5)
- (6)
### If Else
- (1)
- (2)
- (3)
- (4)
### Else if
- (1)
- (2)
- (3)
### Short Hand If Else
- (1)
- (2)
- (3)
- (4)
- (5)
### Switch
- (1)
- (2)
- (3)
- (4)
- (5)
### While Loops
- (1)
- (2)
- (3)
- (4)
- (5)
### Do While Loops
- (1)
- (2)
- (3)
- (4)
### For Loops
- (1)
- (2)
- (3)
- (4)
- (5)
- (6)
### Nested Loops
- (1)
- (2)
- (3)
- (4)
### For-Each Loops
- (1)
- (2)
- (3)
- (4)
- (5)
### Break and Continue
- (1)
- (2)
- (3)
- (4)
- (5)
- (6)
- (7)
### Arrays
- (1)
- (2)
- (3)
- (4)
- (5)
- (6)
- (7)
- (8)
--- Exercise
### Arrays and Loops
- (1)
- (2)
- (3)
- (4)
### Multidimensional Arrays
- (1)
- (2)
- (3)
- (4)
- (5)
- (6)
- (7)
- (8)
### Methods
- (1)
- (2)
- (3)
- (4)
- (5)
- (6)
### Method Parameters
- (1)
- (2)
- (3)
- (4)
- (5)
- (6)
### Return Values
- (1)
- (2)
- (3)
- (4)
- (5)
- (6)
- (7)
### Method Overloading
- (1)
- (2)
- (3)
- (4)
### Scope
- (1)
- (2)
- (3)
- (4)
### Recursion
- (1)
- (2)
- (3)
- (4)
### OOP
- (1)
- (2)
- (3)
- (4)
- (5)
### Classes/Objects
- (1)
- (2)
- (3)
- (4)
- (5)
- (6)
- (7)
### Class Attributes
- (1)
- (2)
- (3)
- (4)
- (5)
- (6)
### Class Methods
- (1)
- (2)
- (3)
- (4)
### Constructors
- (1)
- (2)
- (3)
- (4)
- (5)
- (6)
### Modifiers
- (1)
- (2)
- (3)
### Encapsulation
- (1)
- (2)
- (3)
### Packages
- (1)
- (2)
- (3)
### Inheritance
- (1)
- (2)
- (3)
### Polymorphism
- (1)
- (2)
- (3)
### Inner Classes
- (1)
- (2)
- (3)
- (4)
### Abstraction
- (1)
- (2)
- (3)
### Interface
- (1)
- (2)
- (3)
- (4)
- (5)
### Enums
- (1)
- (2)
- (3)
### User Input
- (1)
- (2)
- (3)
- (4)
### Date
- (1)
- (2)
- (3)
### Exceptions
- (1)
- (2)
- (3)
- (4)
### Files
- (1)
- (2)
- (3)
### Create and Write Files
- (1)
- (2)
- (3)
### Read Files
- (1)
- (2)
- (3)
### Delete Files
- (1)
- (2)
- (3)
### ArrayList
- (1)
- (2)
- (3)
- (4)
- (5)
- (6)
### LinkedList
- (1)
- (2)
- (3)
- (4)
### List Sorting
- (1)
- (2)
- (3)
### HashSet
- (1)
- (2)
- (3)
- (4)
### HashMap
- (1)
- (2)
- (3)
- (4)
### Iterator
- (1)
- (2)
- (3)
- (4)
### Wrapper Classes
- (1)
- (2)
- (3)
- (4)
### Regular Expressions
- (1)
- (2)
- (3)
- (4)
- (5)
### Threads
- (1)
- (2)
- (3)
### Lambda Expressions
- (1)
- (2)
- (3)
- (4)
### Advanced Sorting
- (1)
- (2)
- (3)
