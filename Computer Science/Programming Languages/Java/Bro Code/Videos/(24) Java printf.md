---
Source:
  - https://youtube.com/watch?v=c2B_Av3x65s
Reviewed: false
---
```java
public class Main {

	public static void main(String[] args) {

		// printf() = 	an optional method to control, format, and display text to the console window
		//				two arguments = format string + (object/variable/value)
		//				% [flags] [precision] [width] [conversion-character]
				
		boolean myBoolean = true;
		char myChar = '@';
		String myString = "Bro";
		int myInt = 50;
		double myDouble = 1000;

		//variable can be added to a string wherever a format specifier is placed
		//Need an object, variable or value
		//A conversion character is a letter that appears after the format specifier
		//%d corresponds with decimal numbers
		//The % is the format specifier and the character is the conversion-character afterwards
		//Specifier must be in format string
		//System.out.printf("This is a format string %d", 123);
			
		// [conversion-character]
		//System.out.printf("%b",myBoolean);
		//System.out.printf("%c",myChar);
		//System.out.printf("%s",myString);
		//System.out.printf("%d",myInt);
		//System.out.printf("%f",myDouble);
		
		//[width]
		// minimum number of characters to be written as output
		// This prints a minimum of 10 characters for the name including the length of the name
		//System.out.printf("Hello %10s",myString);

		//Setting a negative number will left-justify the text
		//Setting it to a negative number is a flag
		//All of the space comes after the "myString" text
		//System.out.printf("Hello %-10s",myString);
		
		//[precision]
		// sets number of digits of precision when outputting floating-point values
		// Limits number of digits after decimal portion
		//System.out.printf("You have this much money %.1f",myDouble);
		
		// [flags]
		// adds an effect to output based on the flag added to format specifier
		// - : left-justify
		// + : output a plus ( + ) or minus ( - ) sign for a numeric value
		// 0 : numeric values are zero-padded
		// , : comma grouping separator if numbers > 1000
		
		//Right justified
		System.out.printf("You have this much money %20f\n",myDouble);

		//Left justified
		System.out.printf("You have this much money %-20f\n",myDouble);

		//Shows if the symbol is positive or negative
		System.out.printf("You have this much money %+f\n",myDouble);

		//Pad the number with 0s
		System.out.printf("You have this much money %020f\n",myDouble);

		//Add a comma to number
		System.out.printf("You have this much money %,f\n",myDouble);

	}
}
```

- Output
```
You have this much money          1000.000000
You have this much money 1000.000000         
You have this much money +1000.000000
You have this much money 0000000001000.000000
You have this much money 1,000.000000
```