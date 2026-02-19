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
  - https://www.w3schools.com/java/java_exercises.asp
Reviewed: false
---
## Syntax
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
## Output Text
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
## Output Numbers
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
## Comments
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
## Variables
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
## Print Variables
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
## Multiple Variables
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
## Variable Names
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
## Data Types
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
## Numbers
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
## Boolean Types
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
## Characters
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
## Type Casting
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
## Operators
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
## Strings
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
## String Concatenation
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
## Strings and Numbers
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
## Special Characters
- (1) Drag and drop the correct escape character to move `World!` to a new line.
	- `String txt = "Hello \n World!";`
- (2) Which of the following correctly uses special characters in Java String?
	- `String txt = "We are the so-called \"Vikings\" from the north.";`
- (3) What does the `\n` escape character do?
	- Insert a new line
- (4) You can insert a single backslash in a string with
	- `\\`
## Math
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
## Booleans
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
## If
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
## If Else
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
## Else if
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
## Short Hand If Else
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
## Switch
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
## While Loops
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
## Do While Loops
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
## For Loops
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
## Nested Loops
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
## For-Each Loops
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
## Break and Continue
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
## Arrays
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
## Arrays and Loops
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
## Multidimensional Arrays
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
## Methods
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
## Method Parameters
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
## Return Values
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
## Method Overloading
- (1) Fill in the return types for the overloaded methods
```java
static int plusMethod (int x, int y) {
	return x + y;
}

static double plusMethod(double x, double y) {
	return x + y;
}
```
- (2) What does method overloading mean?
	- That multiple methods can have the same name with different parameters
- (3) True or False: Multiple methods can have the same name as long as the number and type of parameters are different
	- #question Do they both need to be true or is either or okay?
	- True
- (4) Is this an example of overloading?
```java
static int plusMethod(int x, int y) {
	return x + y;
}

static double plusMethod(double x, double y){
	return x + y;
}

public static void main(String[] args) {
	int myNum1 = plusMethod(8, 5);
	double myNum2 = plusMethod(4.3, 6.26);
	System.out.println("int: " + myNum1);
	System.out.println("double: " + myNum2);
}

// Answer: Yes
```
- #question How does java know which method to use when overloading? How is it stored?
## Scope
- (1) Drag and drop the variable that is OUT OF SCOPE outside the inner block
```java
public class Main {
	public static void main(String[] args) {
		int x = 10;
	{
		int y = 20;
		System.out.println(x + y); //OK
	}
	System.out.println(y); //Error if you try this
}
```
- #question How is the scope changing within `int y = 20`;? Why are you able to just randomly add the `{}` braces in a method? Does this only work in a main method?
- (2) Will this example work?
```java
public class Main {
	public static void main(String[] args) {
		System.out.println(x);
		int x = 100;
	}
}

// Answer: No
```
- (3) Will this example work?
```java
public class Main {
	public static void main(String[] args) {
		int x = 100;
		System.out.println(x);
	}
}
// Answer: Yes
```
- (4) Finish the sentence: A block of code refers to all of the code between
	- Curly braces `{}`
## Recursion
- (1) Complete the recursive call to make the countdown work
```java
static void countdown(int n) {
	if (n > 0) {
		System.out.print(n + " ");
		countdown(n-1);
	}
}

public static void main(String[] args) {
	countdown(5);
}
```
- (2) In simple words, what is recursion?
	- A technique of making a function call itself
- (3) What is the output of the following code?
```java
public static void main(String[] args) {
	int result = sum(5);
	System.out.println(result);
}

public static int sum (int k) {
	if (k > 0) {
		return k + sum(k-1);
	} else {
		return 0;
	}
}

// Output: 15
```
- (4) What is it called when a function never stops calling itself?
	- Infinite recursion
## OOP
- (1) Drag and drop the missing word
	- The DRY principle in programming stands for "Don't repeat yourself"
- (2) What does OOP stand for?
	- Object-oriented programming
- (3) Drag and drop the correct term
	- In an OOP example, `Volvo` is an object of the class `Car`
- (4) In simple words, what is OOP about?
	- Creating objects that represents concepts with the help of attributes and methods
- (5) What are the two main aspects of object-oriented programming?
	- Classes and objects
## Classes/Objects
- (1) Fill in the correct keyword to declare the class
```java
public class Main {
	int x = 5;
}
```
- (2) Create an object of the Main class and access its attribute
```java
class Main {
	int x = 5;
}

public class Program {
	public static void main(String[] args) {
		Main myObj = new Main();
		System.out.println(myObj.x);
	}
}
```
- (3) True or False: A Class is like a "blueprint" for creating objects
	- True
- (4) Create a class called `MyClass`
	- public class `MyClass`
- (5) Create an object of `MyClass` called `myObj`
	- `MyClass myObj = new MyClass();`
- (6) What is the output of the following code?
```java
int x = 5;

public static void main(String[] args) {
	Main myObj = new Main();
	System.out.println(myObj.x);
}
// Output: 5
```
- (7) True or False: A class must have a matching filename
	- True
	- #question What is meant by matching filename?
## Class Attributes
- (1) Create an object and print its attribute value (500).
```java
class Main {
	int x = 500;
}

public class Program {
	public static void main(String[] args) {
		Main myObj = new Main();
		System.out.println(myObj.x);
	}
}
```
- (2) Make the attribute constant so re-assignment is not allowed
```java
class Main {
	final int x = 10; // make constant
}
```
- #question Is `const` a keyword in java?
- (3) What is the output of the following code?
```java
int x = 15;

public static void main(String[] args) {
	Main my Obj = new Main();
	System.out.println(myObj.x);
}
// Output: 15
```
- (4) Use `myObj` to access and print the value of the `x` attribute of `MyClass`
```java
public class MyClass {
	int x = 5;
	
	public static void main(String[] args) {
		MyClass myObj = new MyClass();
		System.out.println(myObj.x);
	}
}
```
- (5) What is the output of the following code?
```java
int x;

public static void main(String[] args) {
	Main myObj = new Main();
	myObj.x = 40
	System.out.println(myObj.x);
}
// Output: 40
```
- #question Is this problem correct? I don't understand how you can create a `Main()` object when this class does not exist. Is `main` considered a class here?
- (6) What is the output of the following code?
```java
final int x = 10;

public static void main(String[] args) {
	Main myObj = new Main();
	myObj.x = 25;
	System.out.println(myObj.x);
}
// Output: Error
```
- #question Where is the `Main()` method coming from here?
	- It seems to only get an error here because x is marked as `final` meaning you can't change the value of the variable. 
## Class Methods
- (1) call the method inside `main`.
```java
public class Main {
	static void myMethod() {
		System.out.println("Hello World");
	}
	
	public static void main(String[] args){
		myMethod();
	}
}
```
- (2) What is the output of the following code?
```java
public class Main {
	static void myMethod() {
		System.out.println("Hello World!");
	}
	
	public static void main(String[] args) {
		myMethod();
	}
}
// Output: Hello World!
```
- (3) Call `myMethod` on the object
```java
public class MyClass {
	public void myMethod() {
		System.out.println("Hello World");
	}
	
	public static void main(String[] args) {
		MyClass myobj = new Myclass();
		myObj.myMethod();
	}
}
```
- (4) True or False: It is a good practice to create an object of a class and access it in another class
	- True
		- #question Why is this true? What are the benefits for this?
## Constructors
- (1) Fill in the correct name to complete the constructor
```java
public class Main {
	public Main() {
		System.out.println("Constructor called");
	}
}
```
- #comment The constructor name must match the class name
- (2) Complete the parameterized constructor and call it with the value 10.
```java
public class Main {
	int x;
	
	public Main(int y) {
		x = y;
	}
	
	public static void main(String[] args) {
		Main myObj = new Main(10);
		System.out.println(myObj.x);
	}
}
```
- (3) True or False: All classes have constructors by default
	- True
- (4) Create and call a class constructor of `MyClass`. Follow the comments to insert the missing parts of the code below
```java
// Create a MyClass class
public class MyClass {
	int x; // Create a class attribute x
	
	// Create a class constructor for the MyClass class
	public MyClass() {
		x = 5; // Set the initial value for the class attribute x to 5
	}
	
	public static void main(String[] args) {
		// Create an myObj object of class MyClass (This will call the constructor)
		MyClass myObj = new MyClass();
		// Print the value of x
		System.out.println(myObj.x);
	}
	
}
```
- (5) True or False: The constructor name must match the class name
	- True
- (6) True or False: A constructor can have a return type (like void)
	- False
## Modifiers
- (1) Fill in the correct access modifier so that x is accessible from all classes
```java
public class Main {
	public int x = 5;
}
```
- (2) Which modifier fits the following description: "The code is accessible for all classes"
	- public
- (3) Which modifier fits the following description: "The code is only accessible within the declared class"
	- Private
		- #question What does protected mean?
## Encapsulation
- (1) What is the meaning of encapsulation in Java?
	- Make sure that sensitive data is hidden from users
		- #question What does this look like in Java?
- (2) To achieve encapsulation, you should
	- Declare class attributes as private
- (3) You should also
	- Provide public getter and setter methods
## Packages
- (1) To use a class or a package from the Java API, which keyword should be used?
	- `import`
- (2) Fill in the missing parts to import `java.util.Scanner` class from the Java API
	- `import java.util.Scanner;`
- (3) How can you import all the classes in the `java.util` package?
	- `import java.util.*`
## Inheritance
- (1) Of the two categories subclass and superclass: When referring to the class that inherits from another class, is that the subclass or superclass?
	- Subclass
- (2) When referring to a superclass, are we talking about the child or the parent?
	- Parent
- (3) The `Car` class should inherit the attributes and methods from the `Vehicle` class. Add the correct keyword to make this possible
	- `class Car extends Vehicle`
## Polymorphism
- (1) In two words, what does polymorphism mean?
	- Many forms
- (2) Which of the following is a key advantage of polymorphism?
	- Perform a single action in different ways
- (3) True or False: Polymorphism is often used together with inheritance.
	- True
## Inner Classes
- (1) To access an inner class, you can
	- Create an object of the outer class, and then create an object of the inner class
		- #question What does this mean and what does it look like? 
- (2) If you don't want outside objects to access the inner class, declare the class as
	- private
- (3) True or False: If you try to access a private inner class from an outside class, an error occurs
	- True
		- #question What does this look like?
- (4) What is the output of the following code?
```java
class OuterClass {
	int x = 10;
	class InnerClass {
		int y = 5;
	}
}

public class Main {
	public static void main(String[] args) {
		OuterClass myOuter = new OuterClass();
		OuterClass.InnerClass myInner = myOuter.new InnerClass();
		System.out.println(myInner.y + myOuter.x);
	}
}
// Output: 15
```
## Abstraction
- (1) Which of the following statements best describes abstraction in Java?
	- Abstraction is the process of hiding certain details and showing only essential information to the user
		- #question What does this look like in Java? 
- (2) Which keyword is used to create an abstract class or method?
	- abstract
		- #question What does this look like?
- (3) True or False: Abstraction can only be achieved with public classes
	- False
		- #question I guess protected classes true? What other types of classes can you abstract?
## Interface
- (1) Which keyword is used to implement an interface?
	- implements
		- #question What does implements do?
		- #question What does an example look like?
		- #question What is an interface?
- (2) True or False: An interface is a completely "abstract class"
	- True
		- #question What does that mean?
- (3) To implement multiple interfaces, separate them with a
	- comma (,)
		- #question What does this look like in java code?
- (4) True or False: Interfaces can be used to create object
	- False
		- #question Why not?
- (5) True or False: An interface can contain a constructor
	- False
		- #question Why not?
## Enums
- (1) How can you access enum constants?
	- With a dot (.)
		- #question What is an enum constant?
		- #question What does it look like in Java?
- (2) What is an enum?
	- A special class that represents a group of constants
		- #question What does it look like?
		- #question Does this exist in python as well and what would it look like?
- (3) Consider the code
```java
enum Level {
	LOW,
	MEDIUM,
	HIGH
}
```
- Fill in the missing part below to loop through the constants of the Level enum
```java
for (Level myvar : Level.values()) {
	System.out.println(myVar);
}
```
- #question Why does `Level.values()` need `()` but `.length` doesn't need `()`?
- #question What other methods does `enum Level` have?
- #question What kind of data type is `enum`?
## User Input
- (1) What is a correct syntax to create a Scanner object?
	- `Scanner myObj = new Scanner(System.in);`
		- #question What library / module do you need to import for this to work?
- (2) Fill in the missing parts to import the `java.util.Scanner` class from the Java API
	- `import java.util.Scanner;`
- (3) Which method is used to read Strings from input?
	- The `nextLine()` method
		- #question What would an example look like?
- (4) What method is used to read integers from input?
	- The `nextInt()` method.
		- #question What does this look like?
## Date
- (1) What is a correct syntax to create a Date object?
	- `LocalDate myObj = LocalDate.now();`
		- #question Isn't there a Date object you could use to create this though?
- (2) Which package can be imported to work with date and time?
	- The `java.time` package
		- #question What does an example of this look like?
- (3) Which class can be used to display the current date and time?
	- The `LocalDateTime` class
		- #question What package does `LocalDateTime` come from?
## Exceptions
- (1) When an error occurs, Java will normally stop and generate an error message. The technical term for this is 
	- Exception
		- #question What does this look like in Java?
- (2) Insert the missing parts to handle the error in the code below
```java
try {
	int[] myNumbers = {1, 2, 3};
	System.out.println(myNumbers[10]);
} catch (Exception e) {
	System.out.println("Something went wrong.");
}
```
- (3) Insert the missing keyword to execute code, after `try.catch` ,regardless of the result
```java
try {
	int[] myNumbers = {1, 2, 3};
	System.out.println(myNumbers[10]);
} catch (Exception e) {
	System.out.println("Something went wrong.");
} finally {
	System.out.println("The 'try catch' is finished.");
}
```
- (4) You can also create a custom error with the 
	- throw statement
		- #question What does this look like?
## Files
- (1) What is a correct syntax to create a File object that represents a file called `filename.txt?`
	- `File myObj = new("filename.txt");`
		- #comment I assumed this because you are able to read string and int from a document. 
		- #question Are you able to read integers from a txt file? 
- (2) Fill in the missing parts to import the File class
	- `import java.io.File;`
- (3) Which method can be used to test whether a file is writable or not?
	- `canWrite()`
		- #question What does this look like in action?
## Create and Write Files
- (1) Which method can be used to create a file?
	- `createNewFile()`
		- #question Is there a `createFile()` method?
- (2) Which class is used to write to a file?
	- The `FileWriter` class
		- #question What does this look like in action?
- (3) Which method can be used to close the file?
	- `close()`
		- #question What does an example look like? 
## Read Files
- (1) Which method can be used to get the name of a file?
	- `getName()`
		- #question What does this look like in practice?
- (2) Which class is used to read the contents of a text file?
	- The Scanner class
		- #question How does this work?
- (3) Which method can be used to get the size of a file?
	- `length()`
		- #question Why is the `()` required here for length?
## Delete Files
- (1) Which method can be used to delete a file?
	- `delete()`
		- #question What does this look like in action?
- (2) True or False: You must import the File Class to be able to delete files
	- True
- (3) True or False: You can't delete a folder if it contain files. 
	- True
		- #question Is there not a method to override this limitation?
## ArrayList
- (1) True or False: An ArrayList is a fixed-size array, while a regular array is resizable.
	- False
- (2) Which method can be used to add elements to the ArrayList?
	- The `add()` method
		- #question What does this look like in practice?
- (3) In the following example, where is "Mazda" placed in the list?
```java
ArrayList<String> cars = new ArrayList<String>();
cars.add("Volvo");
cars.add("BMW");
cars.add("Ford");

cars.add(1, "Mazda");
```
- Between Volvo and BMW
- (4) Fill in the blanks to remove the second element in an ArrayList
	- `MyList.remove(1);`
- (5) What is the output of the following code?
```java
ArrayList<String> cars = new ArrayList<String>();
cars.add("Volvo");
cars.add("BMW");
cars.add("Ford");
System.out.println(cars.get(2));
```
- Ford
- (6) Use the correct method to find out how many elements there are in an ArrayList
	- `myList.size()`
		- #question How to know when to use `size()` or `length()` or `length`
## LinkedList
- (1) True or False: The LinkedList class is a collection which can contain many objects of the same type
	- True
		- #question Do the objects need to be of the same type?
- (2) Which method can be used to add elements to a LinkedList?
	- The `add()` method
		- #question What does this look like in practice?
- (3) In the following example, where is "Mazda" placed in the list?
```java
LinkedList<String> cars = new LinkedList<String>();
cars.add("Volvo");
cars.add("BMW");
cars.add("Ford");

cars.add(2, "Mazda");
```
- Between BMW and Ford
- (4) Which method can be used to add an item to the beginning of the list?
	- `addFirst()`
		- #question What does an example look like?
## List Sorting
- (1) Consider the following example
```java
ArrayList<String> cars = new ArrayList<String>();
cars.add("Volvo");
cars.add("BMW");
cars.add("Ford");
cars.add("Mazda");
```
- How can you sort the ArrayList alphabetically in ascending order?
	- `Collections.sort(cars);`
		- #question What is collections?
		- #question How do I import collections?
		- #question What would an example look like here?
		- #question Does this modify the `ArrayList<String>` itself?
- (2) Which method can be used to sort a list in reverse order?
	- The `reverseOrder()` method
		- #question Is this talking about an ArrayList?
		- #question What does this look like in action?
- (3) Fill in the blanks to sort myNumbers numerically
```java
ArrayList myNumbers = new ArrayList();
myNumbers.add(33);
myNumbers.add(15);
myNumbers.add(20);
myNumbers.add(34);
myNumbers.add(8);
myNumbers.add(12);

Collections.sort(myNumbers)
```
- #question What does the output look like here?
## HashSet
- (1) What is a correct syntax to create a HashSet object that will store strings?
	- `HashSet<String> myObj = new HashSet<String>();`
		- #question What does an example look like?
- (2) Which method can be used to add items to a HashSet?
	- The `add()` method
		- #question Example please
- (3) Use the correct method to find out how many items there are in a HashSet
	- `mySet.size()`
- (4) Fill in the missing parts to import the HashSet class from the java.util package
	- `import java.util.HashSet`
		- #question What does util stand for?
		- #question Why would you use a HashSet in Java?
## HashMap
- (1) A HashMap 
	- stores items in key/value pairs
- (2) Which method can be used to add items to a HashMap?
	- The `put()` method
		- #question What does this look like?
- (3) Fill in the blanks to remove "Norway" from a HashMap
	- `capitalCities.remove("Norway");`
- (4) Use the correct method to find out how many items there are in a HashMap
	- `myMap.size()`
## Iterator
- (1) What is a correct syntax to create an Iterator object named `it` for a `cars` collection?
	- `Iterator<String> it = cars.iterator();`
		- #question What is meant by collection here?
		- #question What does an iterator object do?
- (2) Fill in the missing parts to import the Iterator class from the `java.util` package
	- `import java.util.Iterator;`
- (3) True or False: It is called an "iterator" because "iterating" is the technical term for looping
	- True
- (4) Fill in the blanks to loop through a collection using certain methods
```java
while (it.hasNext()) {
	System.out.println(it.next())
}
```
- #question If the collection only has one item, will it still print that one item or null because there is no other element after the first?
## Wrapper Classes
- (1) To create a wrapper object of an `int` type called `myInt`, which of the following is used?
	- `Integer myInt = 5;`
		- #question How is this a wrapper? Why would you use `Integer` instead of `int`. 
		- #question Is `String myString = "Hello"` considered a wrapper?
- (2) True or False: Wrapper classes provide a way to use primitive data types as objects
	- True
		- #question Why would you want to use them as objects? Is it so you can create methods for the primitive data type?
- (3) Fill in the blanks to create a wrapper object of a `char` type
	- `Character myChar = 'B';`
- (4) Fill in the blanks to create a wrapper object of a double type
	- `Double myDouble = 9.99`
		- #question What are all the wrapper objects you can use?
		- #question What type of keyword is `Double` or `String` known as? Is it a wrapper class? Do you need to import this? Does it always need to start with a capital letter?
## Regular Expressions
- (1) What is a regular expression?
	- A sequence of characters that forms a search pattern
- (2) Fill in the missing parts to import the correct package to work with regular expressions
	- `import java.util.regex`
		- #question Why is the `r` in `regex` lowercase here?
- (3) How can you use an expression to find one character from the range 0 to 9?
	- `[0-9]`
		- #question What would an example look like?
- (4) What does the Pattern Class do?
	- Defines a pattern
		- #question What does an example look like?
- (5) What does the Matcher Class do?
	- Used to search for the pattern
		- #question What does an example look like?
## Threads
- (1) One way to create a thread is
	- By extending the Thread class and overriding its `run` method.
		- #question What is the difference between implementing, importing, and extending?
		- #question What does an example look like?
	- #question What are the other ways in java?
- (2) Another way to create a thread is
	- By implementing the Runnable Interface
		- #question What does this look like?
- (3) True or False: To avoid concurrency problems, it is best to share as few attributes between threads as possible 
	- True
		- #question What are concurrency problems?
## Lambda Expressions
- (1) What is a lambda expression?
	- A short block of code that takes in parameters and returns a value
- (2) The simplest lambda expression contains a single parameter and an expression. Fill in the missing part to finish the syntax:
	- parameter -> expression
		- #question How does this work? Why are we able to use an arrow?
		- #question Is there something is java which contains `::`?
- (3) Fill in the blanks to use more than one parameter:
	- `(parameter1, parameter2) -> expression`
		- #question Give a working example in java
- (4) Fill in the blanks to use a lambda expression in the ArrayList's forEach() method to print every item in the list:
```java
ArrayList numbers = new ArrayList();
numbers.add(5);
numbers.add(9);
numbers.add(8);
numbers.add(1);
numbers.forEach( (n) -> {System.out.println(n);});
```
- #question Does the above code print out every element of the ArrayList?
- #question Why did we not need to specify the type of ArrayList for this problem?
- #question What does for-each loops look like again? 
## Advanced Sorting
- (1)
- (2)
- (3)
