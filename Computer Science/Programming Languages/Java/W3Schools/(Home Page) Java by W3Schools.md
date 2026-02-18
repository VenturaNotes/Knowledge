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
- (1) Drag and drop the correct operator to check if 10 is greater than 9.
```java
System.out.println(10 > 9);
```
- (2) Drag and drop the correct operator to check if 10 is equal to 15.
```java
System.out.println(10 == 15);
```
- (3) What will be the result of the following code `System.out.println(10 > 9);`
	- `True`
- (4) Fill in the missing parts to print the values `true` and `false`:
```java
boolean isJavaFun = true;
boolean isFishTasty = false;
System.out.println(isJavaFun);
System.out.println(isFishTasty);
```
- (5) Fill in the missing parts to print the value `true`:
```java
int x = 10;
int y = 9;
System.out.println(x > y);
```
- (6) What will be the result of the following code `System.out.prntln(10 == 15);`
	- `false`
### If
- (1) Drag and drop the correct keyword and condition to make the code print `Good Night.`
```java
int time = 20;
if (time > 18){
	System.out.println("Good Night");
}
```
- (2) Drag and drop the correct condition to print `It's hot!` when the temperature is 30 or more celsius.
```java
int temperature = 30;
if (temperature >= 30) {
	System.out.println("It's hot!");
}
```
- (3) What will be the result of the following code
```java
int number = 20;
if (number > 5) {
	System.out.println("Greater than 5");
}
// Result: Greater than 5
```
- (4) Drag and drop the correct condition to print `Pass` when the score is 75 or higher
```java
int score = 75;
if (score >= 75) {
	System.out.println("Pass");
}
```
- (5) Print "Hello World" if `x` is greater than `y`
```java
int x = 50;
int y = 10;
if (x > y) {
	System.out.println("Hello World");
}
```
- (6) Print "Hello World" if `x` is equal to `y`.
```java
int x = 50;
int y = 50;
if (x == y) {
	System.out.println("Hello World");
}
```
### If Else
- (1) Drag and drop the correct text that will be printed when `time` is 20.
```java
int time = 20;
if (time < 18) {
	System.out.println("Good day");
} else {
	System.out.println("Good evening");
}
```
- (2) What will be the result of the following code:
```java
int time = 20;
if (time < 18) {
	System.out.println("Good day");
} else {
	System.out.println("Good evening");
}
// Result: Good evening
```
- (3) Print "Yes" if `x` is equal to `y`, otherwise print "No".
```java
int x = 50;
int y = 50;
if (x == y) {
	System.out.println("Yes");
} else {
	System.out.println("No");
}
```
- (4) The `else` statement is used to specify a block of code to be executed if the condition in the `if` statement is:
	- false
### Else if
- (1) The `else if` statement is used to specify a new condition if the first condition in the `if` statement is
	- false
- (2) Print "1" if `x` is equal to `y`, print "2" if `x` is greater than `y`, otherwise print "3".
```java
int x = 50;
int y = 50;
if (x == y){
	System.out.println("1");
} else if (x > y) {
	System.out.println("2");
} else {
	System.out.println("3");
}
```
- (3) Insert the missing parts to output "Good evening":
```java
int time = 22;
if (time < 10) {
	System.out.println("Good morning.");
} else if (time < 18) {
	System.out.println("Good day.");
} else {
	System.out.println("Good evening.");
}
```
### Short Hand If Else
- (1) Drag and drop the correct condition so the program prints `Pass` when `score` is 95.
```java
int score = 95;
String grade = (score >= 50) ? "Pass" : "Fail";
System.out.println(grade);
```
- (2) Drag and drop the correct results so the program prints `Odd` when the number is 5.
```java
int number = 5;  
String result = (number % 2 == 0) ? "Even" : "Odd";  
System.out.println(result);
```
- (3) True or False: The ternary operator consists of three operands: a condition, a result for true, and a result for false.
	- #question What is a ternary operator?
	- True
- (4) Insert the missing parts to complete the following "short hand `if...else` statement" (ternary operator):
```java
int time = 20;
String result = (time < 18) ? "Good day." : "Good evening.";
System.out.println(result);
```
- (5) What will be the result of the following code
```java
int time = 22;  
String res = (time < 18) ? "Good day." : "Good evening.";  
System.out.println(res);

// Output: Good evening
```
### Switch
- (1) Drag and drop the correct keywords to complete the `switch` structure
```java
int day = 2;  
switch (day) {  
	case 1:  
		System.out.println("Monday");  
		break;  
	case 2:  
		System.out.println("Tuesday");  
		break;  
}
```
- (2) Drag and drop the correct keywords to add a `default` case in the `switch` statement.
```java
int number = 5;  
switch (number) {  
	case 1:  
		System.out.println("One");  
		break;  
	default:  
		System.out.println("Not One");  
}
```
- #question Do you not need a break for `default`? 
- (3) True or False: The `switch` statement is used to select one of many code blocks to be executed, based on the value of an expression.
	- True
- (4) Insert the missing parts to complete the following `switch` statement.
```java
int day = 2;
switch (day) {
	case 1:
		System.out.println("Saturday");
		break;
	case 2:
		System.out.println("Sunday");
		break;
}
```
- (5) Complete the `switch` statement, and add the correct keyword at the end to specify some code to run if there is no case match in the `switch` statement.
```java
int day = 4;
switch (day) {
	case 1:
		System.out.println("Saturday");
		break;
	case 2:
		System.out.println("Sunday");
		break;
	default:
		System.out.println("Weekend");
}
```
### While Loops
- (1) Drag and drop the correct keyword to start the loop
```java
int i = 0;
while (i < 3) {
	System.out.println(i);
	i++;
}
```
- (2) Drag and drop the correct comparison operator to make the loop run 4 times (from 0 to 3).
```java
int i = 0;
while (i <= 3) {
	System.out.println(i);
	i++;
}
```
- (3) How many times will the following loop execute?
```java
int i = 0;
while i < 4) {
	i++;
}
// Result: 4 times
```
- (4) Print `i` as long as `i` is less than 6
```java
int i = 1:
while (i < 6) {
	System.out.println(i);
	i++;
}
```
- (5) What will happen if you run the following code?
```java
int i = 1:
while (i == 1) {
	System.out.println("Oops");
}

// Result: An infinite loop
```
### Do While Loops
- (1) Fill in the blanks to complete the do-while loop.
```java
int i = 0;
do {
	System.out.println(i);
	i++
} while (i < 3);
```
- (2) What is the difference between a `while` loop and a `do-while` loop?
	- A do-while loop will execute at least once, while a while loop might not execute at all.
- (3) Use the `do/while` loop to print `i` as long as `i` is less than 6.
```java
int i = 1;
do {
	System.out.println(i);
	i++;
}
while (i < 6);
```
- (4) What will happen if you run the following code?
```java
int i = 0;
do {
	System.out.println(i);
}
while (i < 5);
// Result: An infinite loop
```
### For Loops
- (1) Fill in the blanks to start a for loop
```java
for (int i = 0; i < 5; i++) {
	System.out.println(i);
}
```
- (2) Drag and drop the correct condition to stop the loop when `i` is no longer less than 5.
```java
for (int i = 0; i < 5; i++){
	System.out.println(i);
}
```
- (3) When you know exactly how many times you want to loop through a block of code, use a:
	- for loop
- (4) Use a `for` loop to print "Yes" 5 times:
```java
for (int i = 0; i < 5; i++){
	System.out.print("Yes");
}
```
- (5) Consider the following code:
```java
for (statement 1; statement 2; statement 3) {
	// code block to be executed
}
```
- What happens in statement 1?
	- Statement 1 is executed once before the loop starts
- (6) Consider the following code
```java
for (statement 1; statement 2; statement 3) {
	// code block to be executed
}
```
- What happens in statement 2?
	- Statement 2 defines the condition for executing the code block
### Nested Loops
- (1) Drag and drop the correct keyword to create the inner-loop
```java
for (int i = 1; i <= 2; i++) {
	for (int j = 1; j <= 3; j++) {
		System.out.print(i + "," + j + " ");
	}
}
```
- (2) What is the output of the following code?
```java
for (int i = 1; i <= 2; i++) {
	for (int j = 1; j <= 3; j++) {
		System.out.print(i + "," + j + " ");
	}
}
// Output: 1,1 1,2 1,3 2,1 2,2 2,3
```
- (3) What does a "Nested Loop" mean?
	- A loop placed inside another loop
- (4) True or False: Regarding nested loops, the "inner loop" will be executed one time for each iteration of the "outer loop".
	- True
### For-Each Loops
- (1) Fill in the blanks to complete a for-each loop.
```java
int[] numbers = {10, 20, 30};
for (int num : numbers) {
	System.out.println(num);
}
```
- #question Is this similar to a python's `for in {1,2,3}` statement? 
- (2) Complete the for-each loop to print all car names
```java
String[] cars {"Volvo", "BMW", "Ford"};
for (String car : cars) {
	System.out.println(car);
}
```
- (3) What is the output of the following code?
```java
int[] myNumbers = {1, 2, 3, 4, 5};
for (int num : myNumbers) {
	System.out.println(num);
}

/* Output
1
2
3
4
5
*/
```
- (4) True or False: You can use a for-each loop to loop through elements in a switch statement.
	- False
- (5) Loop through the items in the `cars` array
```java
String[] cars = {"Volvo", "BMW", "Ford"};
for (String car : cars) {
	System.out.println(car);
}
```
### Break and Continue
- (1) Drag and drop the correct keyword to stop the loop when `i` is 3.
```java
for (int i = 0; i < 5; i++) {
	if (i == 3) {
		break;
	}
	System.out.println(i);
}
```
- (2) Drag and drop the correct keyword to skip printing the number 2
```java
for (int i = 0; i < 5; i++) {
	if (i == 2) {
		continue;
	}
	System.out.println(i);
}
```
- (3) Drag and drop the correct keywords to skip printing 2 and stop the loop at 4.
```java
for (int i = 0; i < 6; i++){
	if (i == 2) {
		continue;
	}
	if (i == 4){
		break;
	}
	System.out.println(i);
}
```
- (4) The `break` statement can only be used within switch statements
	- False
- (5) Stop the loop if `i` is 5
```java
for (int i = 0; i < 10; i++) {
	if (i == 5) {
		break;
	}
	System.out.println(i);
}
```
- (6) In the loop, when the value is "4", jump directly to the next value.
```java
for (int i = 0; i < 10; i++) {
	if (i == 4) {
		continue;
	}
	System.out.println(i);
}
```
- (7) What is the output of the following code?
```java
for (int i = 0; i < 6; i++) {
	if (i == 4) {
		continue;
	}
	System.out.println(i);
}

/* Output
0
1
2
3
5
*/
```
- 
### Arrays
- (1) Fill in the blanks to declare an integer array
	- `int[] numbers = {1, 2, 3, 4, 5};`
- (2) Drag and drop the correct type to declare a string array.
	- `String[] cars = {"Volvo", "BMW", "Ford"};`
- (3) Drag and drop the correct index to print "BMW"
```java
String[] cars = {"Volvo", "BMW", "Ford"};
System.out.println(cars[1]);
```
- (4) How can you declare an array of strings?
	- `String[] my Text;`
- (5) Create an array of type `String` called `cars`
```java
String[] cars = {"Volvo", "BMW", "Ford"};
```
- (6) Print the second item in the `cars` array
```java
String[] cars = {"Volvo", "BMW", "Ford"};
System.out.println(cars[1]);
```
- (7) Change the value from "Volvo" to "Opel", in the `cars` array.
```java
String[] cars = {"Volvo", "BMW", "Ford"};
cars[0] = "Opel"
System.out.println(cars[0]);
```
- (8) Find out how many elements the `cars` array have
```java
String[] cars = {"Volvo", "BMW", "Ford"};
System.out.println(cars.length);
```
- #question Why can you do cars.length? Don't you need to do cars.length()?
### Arrays and Loops
- (1) Complete the loop to print all numbers in the array.
```java
int[] numbers = {1, 2, 3};
for (int num : numbers) {
	System.out.prinln(num)
}
```
- (2) What is the output of the following code?
```java
String[] cars = {"Volvo", "BMW", "Ford"};
for (int i = 0; i < cars.length; i++) {
	System.out.println(cars[i]);
}

/* Output
Volvo
BMW
Ford
*/
```
- (3) Loop through the items in the `cars` array
```java
String[] cars = {"Volvo", "BMW", "Ford"};
for (String car : cars) {
	System.out.println(car);
}
```
- (4) What is the output of the following code?
```java
int[] myNumbers = {1, 2, 3, 4, 5};
for (int num : myNumbers) {
	System.out.println(num);
}
/*
1
2
3
4
5
*/
```
### Multidimensional Arrays
- (1) Drag and drop the correct index to print "Mazda"
```java
String[][] cars = {{"Volvo", "BMW"}, {"Ford", "Mazda"}};
System.ou.println(cars[1][1]);
```
- (2) Drag and drop the correct indexes to print the number `6`
```java
int[][] numbers = { {1, 2, 3}, {4, 5, 6} };
System.out.println(numbers[1][2]);
```
- (3) Fill in the blanks to declare a 2D array of integers
```java
int[][] matrix = { {1, 2}, {3, 4} };
```
- (4) Complete the nested for-each loops to print all elements of the 2D array.
```java
int[][] numbers = { {1, 2}, {3, 4} };
for (int[] row : numbers) {
	for (int num : row) {
		System.out.println(num);
	}
}
```
- (5) What is a multidimensional array?
	- An array of arrays
- (6) Insert the missing parts to create a two-dimensional array
	- `int[][] myNumbers = { {1, 2, 3, 4}, {5, 6, 7} };`
- (7) True or False: To access the elements of a multidimensional array, you must specify two indexes.
	- True
- (8) Yes or No: Is it possible to loop through a multidimensional array?
	- Yes
### Methods
- (1) Drag and drop the correct return type to declare a method that does not return a value
```java
public static void myMethod() {
	System.out.println("Hello World");
}
```
- (2) Drag and drop the correct statement to call the method inside `main`
```java
public class Main {
	static void myMethod() {
		System.out.println("Hello World");
	}
	
	public static void main (String[] args) {
		myMethod();
	}
}
```
- (3) How can you call a method in Java?
	- By using the name of the method followed by two parentheses and a semicolon
- (4) Insert the missing part to call `myMethod` from `main`
```java
static void myMethod() {
	System.out.println("I just got executed!");
}

public static void main (String[] args){
	myMethod();
}
```
- (5) Insert the missing part to call `myMethod` from `main` two times
```java
static void myMethod() {
	System.out.println("I just got executed!");
}

public static void main (String[] args){
	myMethod();
	myMethod();
}
```
- (6) True or False: In Java, a method must be declared within a class.
	- True
		- #question Is there any other way to declare a method besides in a class. Why?
### Method Parameters
- (1) Fill in the blanks to declare a method with a string and an integer parameter.
```java
static void myMethod(String name, int age) {
	System.out.println(name + " is " + age);
}
```
- (2) Fill in the blanks to make the code output `John` is `50`.
```java
static void myMethod(String name, int age) {
	System.out.println(name + " is " + age);
}

public static void main(String[] args){
	myMethod("John", 50)
}
```
- (3) In simple words: Inside a method, what does a parameter act as?
	- A variable
- (4) Add a `fname` parameter of type `String` to `myMethod`, and output "John Doe".
```java
static void myMethod(String fname) {
	System.out.println(fname + " Doe");
}

public static void main(String[] args) {
	myMethod("John");
}
```
- (5) What is the output of the following code?
```java
public class Main {
	static void myMethod(String fname, int age) {
		System.out.println(fname + " is " + age);
	}
	
	public static void main(String[] args) {
		myMethod("Liam", 5);
	}
}
// Output: Liam is 5
```
- (6) Follow the comments to insert the missing parts of the code below
```java
// Create a checkAge() method with an integer variable called age
static void main checkAge(int age) {

	//If age is less than 18, print "Access denied":
	if (age < 18) {
		System.out.println("Access denied");
	
	// If age is greater than, or equal, to 18, print "Access granted"
	} else {
		System.out.println("Access Granted");
	}
}

public static void main(String[] args) {
	// Call the checkAge method and pass along an age of 20
	checkAge(20);
}
```
### Return Values
- (1) Fill in the blanks to declare a method that returns an integer sum of two numbers
```java
static int addNumbers(int x, int y) {
	return x + y;
}
```
- (2) Fill in the blanks to call the method and store the return value
```java
static int addNumbers(int x, int y) {
	return x + y;
}

public static void main(String[] args){
	int result = addNumbers(5, 3);
	System.out.println(result);
}
```
- (3) Fill in the blanks to declare a method that returns a greeting message as text.
```java
static String greet(String name) {
	return "Hello " + name;
}

public static void main(String[] args) {
	String message = greet("Liam");
	System.out.println(message);
}
```
- (4) Which keyword indicates that a method should not return a value?
	- `void`
- (5) Which keyword indicates that a method should return a value?
	- `return`
- (6) Insert the missing part to print the number 8 in `main`, by using a specific keywod inside `myMethod`:
```java
static int myMethod(int x) {
	return 5 + x;
}

public static void main(String[] args) {
	System.out.println(myMethod(3));
}
```
- (7) What is the output of the following code?
```java
public class Main {
	static int myMethod(int x, int y) {
		return x + y;
	}
	
	public static void main(String[] args) {
		int z = myMethod(5, 3);
		System.out.println(z);
	}
}
// Output: 8
```
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
