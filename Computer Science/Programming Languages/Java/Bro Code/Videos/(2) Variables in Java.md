---
Source:
  - https://youtube.com/watch?v=so1iUWaLmKA
Reviewed: false
---
Variable (a placeholder for a value that behaves as the value it contains)
x = 123
y = "Hello"
z = true

| Date Type | Size    | Primitive/reference | Value                                                                      |
| --------- | ------- | ------------------- | -------------------------------------------------------------------------- |
| boolean   | 1 bit   | primitive           | true or false                                                              |
| byte      | 1 byte  | primitive           | -128 to 127                                                                |
| short     | 2 bytes | primitive           | -32,768 to 32,767                                                          |
| int       | 4 bytes | primitive           | -2 billion to 2 billion                                                    |
| long      | 8 bytes | primitive           | -9 quintillion to 9 quintillion                                            |
| float     | 4 bytes | primitive           | fractional number up to 6-7 digits ex. 3.141592f (ending with f important) |
| double    | 8 bytes | primitive           | fractional number up to 15 digits ex. 3.141592653589793                    |
| char      | 2 bytes | primitive           | single character/letter/ASCII value ex. 'f' (single quotes important)      |
| String    | varies  | reference           | a sequence of characters ex. "Hello World"                                 |

| Primitive                     | Reference                |
| ----------------------------- | ------------------------ |
| 8 types (boolean, byte, etc.) | unlimited (user defined) |
| stores data                   | stores an address        |
| can only hold 1 value         |     can hold more than 1 value                     |
| less memory                   |     more memory                     |
| fast                          | slower                         |

Creating a variable:
1. int x; declaration
2. x = 123; assignment
3. int x = 123; initialization

- The x variable behaves as the value it contains
- surrounding "text" in quotes creates a string literal to print
	- System.out.println("x");
- largest number to store in an integer variable is just over 2 billion
- Creating a large number
	- long x = 64564447645645L;
- bytes can store to 127 (don't use bytes and shorts much as a beginner)
	- byte x = 1;
- double can store number with fractional portion

- Variables
```java
public class Main {

	public static void main(String[] args){
		
		int x = 123;
		double y = 3.14; //stores up to 15 digits after decimal portion

        // only holds true or false
		boolean z = true;

        //It's a character
		char symbol = '@';
		String name = "Bro";

        float number1 = 3.14f; 
        //need to put f after it (but people use doubles more
        //      which doesn't require the f and also has more precision)
		
		System.out.println("Hello "+name);
		
	}
}
```

- Output
```
Hello Bro
```