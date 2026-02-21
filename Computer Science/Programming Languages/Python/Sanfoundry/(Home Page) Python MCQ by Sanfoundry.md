---
status: open
priority: normal
dateCreated: 2026-02-13T20:36:36.064-05:00
dateModified: 2026-02-13T20:36:36.064-05:00
reminders:
  - id: rem_1771032981213_q4u08eqto
    type: relative
    description: ""
    relatedTo: scheduled
    offset: -PT0H
tags:
  - task
  - status/incomplete
  - type/website
Source:
  - https://www.sanfoundry.com/1000-python-questions-answers/
---
## Intro
- (1) Who developed Python Programming Language?
	- Guido van Rossum
		- Python language is designed by a Dutch programmer Guido van Rossum in the Netherlands
		- #question What is the background of Guido van Rossum?
- (2) Which type of Programming does Python support?
	- All of the below
		- Object-oriented programming
		- [[structured programming]]
			- #question What is structured programming in python? What does it look like?
		- Functional programming
			- #question What is functional programming in python? What does it look like?
	- Python is an interpreted programming language, which supports object-oriented, structured, functional programming
- (3)  Is python case sensitive when dealing with identifiers?
	- Yes
		- Case is always significant while dealing with identifiers in python.
	- #question What are identifiers? Are these types?
- (4) Which of the following is the correct extension of the python file?
	- `.py`
		- `.py` is the correct extension of the python file. Python programs can be written in any text editor. To save these programs we need to save in files with file extension `.py`
			- #question What kind of text editors can you write in?
			- #question Is Microsoft word a text editor? If I saved a docx file as a py file, would I then be able to run the code written within this software?
- (5) Is python code compiled or interpreted
	- Python code is both complied and interpreted
		- Many languages have been implemented using both compilers and interpreters, including C, Pascal, and Python
			- #question When python was originally written, was it also compiled? If not, what version could it be compiled 
			- #question What does it mean for a language to be compiled vs interpreted
- (6) Most keywords in Python are lowercase, but some like True, False, and None are capitalized
- (7) What will be the value of the following expression?
	- `print(4+3%5)`
		- In Python, the modulus operator % has higher precedence than addition `+`. So, the expression is evaluated as `4+(3%5)` which is 4 + 3 = 7
			- #comment Given 3 % 5, we have 3 left over that doesn't go into 5 which is why it comes to 3.  
- (8) Which of the following is used to define a block of code in Python language?
	- Indentation
		- In Python, to define a block of code we use indentation. Indentation refers to whitespaces at the beginning of the line.
- (9) Which keyword is used for function in python Language?
	- `def`
		- The def keyword is used to create, (or define) a function in python.
- (10) Which of the following character is used to give single-line comments in Python?
	- `#`
		- To write single-line comments in Python, use the Hash character (#) at the beginning of the line. It is also called number sign or pound sign. To write multi-line comments, close the text between triple quotes
```python
# Single-line text

""" Multi-line text
Comment 
Text
"""
```
- (11) What will be the output of the following python code?
```python
i = 1
while True:
	if i%3 == 0:
		break
	print(i)
	
	i + = 1
	
```
- `SyntaxError`
	- The output will be a `SyntaxError` because `i += 1` is invalid syntax in Python. There should be no space between `+` and `=`. The correct syntax is `i += 1`
	- #question What does SyntaxError look like in Python?
- (12) Which of the following functions can help us to find the version of python that we are currently working on?
#active
## (1) Python MCQ on Variable Names & Operators
### (1.1) Python Variable Names
- (1) Is Python case sensitive when dealing with identifiers
	- Yes
		- Yes, Python is case sensitive. For example, Variable, variable, and VARIABLE are all treated as different identifiers.
		- #question What is an identifier in Python?
- (2) What is the maximum possible length of an identifier?
	- In Python, identifiers can be of any length. There is no fixed maximum, though extremely long names are not practical.
		- #question What would be an example of an identifier. Is this basically just a variable or function name you create?
- (3) Which of the following is not allowed in Python?
	- Allowed in Python
		- `_a = 1`
		- `__a = 1`
		- `__str__` = 1
	- All the given statements are valid in Python and will run without errors. However, using names like `__str__` can reduce readability or interfere with built-in functionality
		- #question How could it interfere with built-in functionality. Could you give an example?
		- #question What are some rules for variable names? What symbols are you allowed to use to start a variable name and what are you not allowed to start with? Can you start with a number for a variable name?
- (4) Which of the following is an invalid variable?
	- `1st_string`
		- Variable names in Python cannot start with a digit. Since 1st_string begins with the digit 1, it is invalid. The other options follow Python's variable naming rules, where names can start with letters or underscores and can include digits after the first character
		- #question Is `_` considered a valid variable?
- (5) Why are local variable names beginning with an underscore discouraged?
	- They are used to indicate a private variable of a class
		- As Python has no concept of private variables, leading underscores are used to indicate variables that must not be accessed from outside the class
			- #question Is this just a naming convention or will there be an error returned when a python program is run? 
			- #question Could you give an example of this?
- (6) Which of the following is not a keyword in Python?
	- `eval`
		- `eval` is a built-in function, not a keyword. The others (assert, nonlocal, and pass) are Python keywords
			- #question Could you give an example of each in practice in python? (`eval`, `assert`, `nonlocal`, and `pass`)
- (7) Most keywords in Python are in lowercase, but some like True, False, and None are capitalized
- (8) Which of the following is true for variable names in Python?
	- unlimited length
		- Python allows variable names of unlimited length. Private members usually have only a leading underscore, not both leading and trailing. The ampersand (&) is not permitted in variable names; only the underscore `(_)` is allowed as a special character
			- #question What is meant by ampersand not being permitted in variable names? Do you mean by convention or a variable name can't contain an ampersand?
- (9) Which of the following is an invalid statement?
	- `a b c = 1000 2000 3000`
		- In Python, variable names cannot have spaces between them, so above is invalid syntax
	- Valid syntax
		- `abc = 1,000,000`
		- `a,b,c = 1000, 2000, 3000`
		- `a_b_c = 1,000,000`
- (10) Which of the following cannot be a variable name in Python? 
	- `in`
		- `in` is a reserved keyword in Python used for membership testing and loops, so it cannot be used as a variable name. The other options `(__init__, it, on)` are valid identifiers
			- #question Isn't `__init__` a type of keyword though?
### (1.2) Python Basic Operators
- (1) Which is the correct operator for power $(x^y)$ in python?
	- $x^*\\^*y$
		- In python, the power operator is $x^*\\^*y$. For example, $2^*\\^*3=8$ results in 8.
- (2) Which one of these is floor division?
	- `//`
		- The `//` operator in Python performs floor division, which returns the largest integer less than or equal to the division result. For example, `5 // 2` results in 2, not 2.5. The `/` operator, on the other hand, performs true division and returns a float `(5/2 = 2.5)`. To get the integer result without the fractional part, use `//`. 
		- #question Does double exist in python?
- (3) What is the order of precedence in Python?
	- Parentheses, Exponential, Multiplication, Division, Addition, Subtraction
		- Python follows the PEMDAS rule (similar to BODMAS): Parentheses, Exponentiation, Multiplication/Division, and then Addition/Subtraction. Operators at the same level are evaluated left to right.
			- #question What is BODMAS?
- (4) What is the answer to this expression, `22 % 3` is?
	- 1
		- The modulus operator (\%) returns the remainder when one number is divided by another. In this case, `22 % 3` gives the remainder 1 (since 22 divided by 3 is 7 with a remainder of 1).
- (5) Mathematical operations can be directly performed on a string in Python without conversion
	- False
		- In Python, you cannot perform mathematical operations like addition, subtraction, multiplication, or division directly on a string. To perform arithmetic operations, you must first convert the string to a numerical type (e.g., int or float). Otherwise, Python will raise a TypeErorr
			- #question Could you give an example of a TypeError in python? 
			- #comment However, I believe you can concatenate a two strings together by using `+`. 
- (6) Operators with the same precedence are evaluated in which manner?
	- Can't say
		- In Python language, most of the operators with the same precedence are evaluated with left to right such as a lot of binary operators. However, exponent operator, unary operators, ternary, and assignment operators are evaluated from right to left.
			- #question What is a binary operator?
			- #question Please give an example for exponent operator, unary operator, ternary operator, and assignment operators evaluating from right to left in python
			- #question Is there an operation between unary and ternary?
- (7) What is the output of this expression, `3*1**3`?
	- 3
		- In Python, the exponentiation operator (`**`) has higher precedence than multiplication `(*)`. Therefore, the expression is evaluated as `1**3` first, which equals 1. Then `3*1` is evaluated, giving the final result of 3.
- (8) Which one of the following has the same precedence level?
	- Addition and subtraction
		- In Python, Addition `(+)` and Subtraction `(-)` operators have the same precedence level. Similarly, Multiplication (`*`) and Division `(/)` operators also share the same precedence level, but they are evaluated before addition and subtraction due to their higher precedence
- (9) The expression `int(x)` implies that the value of variable `x` is converted to an 
	- True
		- The expression `int(x)` explicitly converts the value of variable `x` to the integer data type. This is an example of explicit type conversion in Python.
- (10) Which one of the following has the highest precedence in the expression?
	- Parentheses > Exponential > Multiplication > Addition
		- The parentheses `()` have the highest precedence in Python, followed by Exponentiation `**`, then Multiplication and Division, and finally Addition and Subtraction. This order is known as PEMDAS (Parentheses, Exponentiation, Multiplication/Division, Addition/Subtraction).
## (2) Python MCQ on Data Types & Numeric Types
### (2.1) Python Core Data Types
- (1) Which of the following is not a core data type in Python?
	- Class
		- Classes are user-defined data types, while lists, dictionaries, and tuples are built-in (core) data types in Python.
- (2) Given a function that does not return any value, what is the default return value when it is executed in the Python shell?
	- None
		- If a function does not explicitly return a value, Python returns `None` by default. The type of `None` is `NoneType`
			- #question What is `NoneType`?
- (3) What will be the output of the following python code?
```python
str = "hello"
print(str[:2])
```
- `he`
	- The code `str[:2]` slices the string from the beginning (index 0) up to, but not including, index 2. This results in the substring "he".
- (4) Which of the following will run without errors?
	- `round(45.8)`
		- The `round()` function in Python takes one or two values. It gives an error if more than two values are passed. You can type `help(round)` in the Python shell to see more about how it works
			- #question What is meant by shell? 
			- #question How can the round function take two values? 
- (5) What is the return type of the `id()` function in python?
	- `int`
		- The `id()` function returns a unique integer that shows the memory address of an object You can use `help(id)` in the Python shell to learn more?
		- #question Why would you use `id()` in python?
- (6) In Python, variable types are not explicitly declared$\textemdash$they are inferred at runtime. Consider the following incomplete operation: `x = 13 ? 2`. The objective is to ensure that `x` has an integer value. Select all options that achieve this (python 3.x): 
	- All of the below do this
		- `x = 13 // 2`
			- Floor division returns 6 (an integer)
		- `x = int(13 / 2)`
			- Regular division returns 6.5, and `int()` converts it to 6
		- `x = 13 % 2`
			- Modulus returns the remainder 1, which is also an integer
	- All three assign an integer value to x, so all are valid in Python 3.x
		- #question Would these not work in Python 2.x? What is the main difference between 3.x and 2.x?
- (7) What error occurs when you execute the following Python code snippet?:
```python
apple = mango
```
- NameError
	- The variable mango is not defined before it is used, so Python raises a NameError indicating the name is not recognized
		- #question When would a TypeError or ValueError show? Give me examples for both. 
- (8) What will be the output of the following Python code snippet?
```python
def example(a):
	a = a + '2'
	 a = a*2
	return a
example("hello")
```
- Indentation Error
	- The line `a = a*2` has an extra space at the beginning, which makes the indentation uneven. Python needs all lines in a block to be properly indented. This causes an indentation Error, and the code won't run.
- (9) What data type is the object below?
```python
L = [1, 23, 'hello', 1]
```
- List
	- The variable `L` is enclosed in square brackets `[]`, which defines a list in Python. Lists can hold multiple data types, such as integers and strings
- (10) In Python, which core data type is used to store values in the form of key-value pairs?
	- dictionary
		- A dictionary is a built-in Python data type that stores data in the form of key-value pairs. It allows fast lookups and efficient data organization based on unique keys
- (11) Which of the following will cause a SyntaxError in Python?
	- `3\`
		- `3\` is not valid because the backslash escapes the closing quote, but there is no character after it. This makes Python throw a SyntaxError
- (12) The following is displayed by a print function call. Select all of the function calls that result in this output
```python
''' Get these outputs
tom
dick
harry
'''
# Solution 
print(‘tom\ndick\nharry’)

# Won't Work
print('''tom
\ndick
\nharry''')

# This one outputs:
tom

dick

harry
```
- (13) What is the average value of the following Python code snippet?
```python
grade1 = 80
grade2 = 90
average = (grade1 + grade2) / 2
print(average)
```
- `85.0`
	- The expression `(grade1 + grade2) / 2` becomes `(80+90)/2 = 170/2`, which evaluates to `85.0.` In Python 3, the `/` operator performs floating-point division, so the result includes a decimal
		- #question Is this different from Python 2.x?
- (14) Which of the following will print this output?
```python
hello-how-are-you
```
- `print('hello-'+'how-are-you')`
	- The code correctly concatenates the strings with hyphens, resulting in the output `hello-how-are-you`. Other variations either insert spaces or miss a hyphen between words.
```python
print('hello-'+'how-are-you')
```
- (15) What is the return type of `trunc()` in Python?
	- `int`
		- The `trunc()` function removes the decimal part of a number and returns an integer. For example, `trunc(4.7)` returns 4.
### (2.2) Python Numeric Types
- (1) What is the output of print `0.1 + 0.2 == 0.3`?
	- `False`
		- Due to the limitations of floating-point representation in binary, neither `0.1, 0.2,` nor `0.3` can be represented precisely. This leads to a small rounding error when adding `0.1` and `0.2`, causing the result to be slightly different from 0.3. Therefore, `0.1 + 0.2 == 0.3` evaluates to False.
			- #question How exactly are floating-point numbers represented in binary?
			- #question Is this true only for Python? 
- (2) Which of the following is not a complex number?
	- `k = 2 + 3l`
		- In python, complex numbers are represented using `j` or `J` (e.g., 2 + 3j or complex(2, 3)). However, l (or L) is used to denote a long integer in some contexts, not a complex number. Therefore, `k = 2 + 3l` is not a complex number.
			- #question What is a long integer?
	- These are complex numbers
		- `k = 2 + 3j`
		- `k = complex(2, 3)`
		- `k = 2 + 3J
- (3) What is the type of `inf`?
	- In Python, `inf` represents infinity, which is a special case of floating-point numbers. It can be created using `float('inf')` or directly as `inf`. Thus, the type of `inf` is float.
		- #question How do you use `inf` in python?
		- #question Please show examples of `inf` and `float('inf')` in usage.
- (4) What does `~4` evaluate to?
	- `-5`
		- In Python, the `~` operator is the bitwise NOT operator. It inverts the bits of the number. The expression `~x` is equivalent to $-(x+1)$. For x = 4, ~4 evaluates to -5
- (5) What does \~\~\~\~\~\~5 evaluate to?
	- #comment So there are 6 total
		- `~5 = -6`
		- `-6 -> 5` (since 6 divisible by 2, result is +5)
	- 5
		- The operator `~` inverts the bits of a number and is equivalent to `-(x+1)`. When applied twice (`~~x`), it cancels out, returning the original number. Since `~x`is applied six times, it effectively results in the same value as x. Therefore, `~~~~~~5` evaluates to `~5`
- (6) Which of the following is incorrect?
	- `x = 03964`
		- In Python, numbers starting with a 0 are considered octal numbers (base 8). However, octal numbers can only contain digits from 0 to 7. Since 9 is not a valid digit in an octal number, 03964 is incorrect.
			- #question What is the use case of octal numbers. Why is base 8 important? 
			- #question Is `0x4f5` an octal number or a hexadecimal number? How do I read this? 
	- Valid
		- `x = 30963`
		- `x = 19023`
		- `x = 0x4f5`
- (7) What is the result of `cmp(3, 1)`
	- 1
		- The `cmp(x,y)` function compares two values, returning 1 if `x > y`, `0` if `x == y`, and `-1` if `x < y`. Since `3 > 1`, the result of `cmp(3,1)` is 1.
- (8) Which of the following is incorrect in Python?
	- `float('12+34')`
		- In Python, 
	- Valid
		- `float('inf')`
		- `float('56' + '78')`
			- #question Does it add them up together?
		- `float('nan')`
			- #question What is `nan`? Could you also just write `nan` for same effect?
- (9) What is the result of `round(0.5) - round(-0.5)`?
	- Value depends on Python version
		- The behavior of the `round()` function is different in Python 2 and Python 3. 
			- In Python 2, it rounds off numbers away from 0 when the number to be rounded off is exactly halfway through. `round(0.5)` is 1 and `round(-0.5)` is -1
			- In Python 3, it rounds off numbers towards nearest even number when the number to be rounded is exactly halfway through. See the below output.
				- #question The `even` number is intentional. 
- Here's the runtime output for Python version 2.7 interpreter
```
$ python
Python 2.7.17 (default, Nov 7 2019, 10:07:09)
>>> round(0.5)
1.0
>>> round(-0.5)
- 1.0
>>>
```
- The `round()` functions on 0.5 and -0.5 are moving away from 0 and hence "round(0.5) - (round(-0.5)) = 1 - (-1) = 2"
- Here's the runtime output for Python version 3.6 interpreter
```
$ python3
Python 3.6.8 (default, Oct 7 2019, 12:59:55)
>>> round(0.5)
0
>>> round(-0.5)
0
>>> round(2.5)
2
>>> round(3.5)
4
```
- In the above output, you can see that the `round()` functions on `0.5` and `-0.5` are moving towards 0 and hence `round(0.5) - (round(-0.5)) = 0 - 0 = 0`. 
	- Also note that the `round(2.5)` is `2` (which is an even number) whereas `round(3.5)` is `4` (which is an even number).
		- #comment This is because in python version 3, when a number ends in `.5`, it will always round to the nearest even number
- (10) What does `3^4` evaluate to?
	- 7
		- In Python, the `^` operator is the binary XOR (exclusive OR) operator, not exponentiation. The result of `3^4` is the bitwise XOR of the binary representations of 3 (0011) and 4 (0100), which results in 0111 (decimal 7). Thus, `3^4` evaluates to 7
			- #comment So it seems like it adds them together
				- So if you have `3^6`, this equals 5. Their binary representation is 
					- $3 = 0011_2$ and  $6 = 0110_2$
					- When comparing left to right, we get `0101` which is 5 in binary
					- #question Is there a method of finding the binary representation of a base 10 number faster? 

## (3) MCQ on Precedence and Associativity in Python
### (3.1) Python Precedence and Associativity-1
- (1) The value of the expressions `4/(3*(2-1))` and `(4/3*(2-1)` is the same
	- #comment First solution is $1 \frac 13$ and second solution is $1 \frac 13$
	- True
		- Although the presence of parenthesis does affect the order of precedence, in the case shown above, it is not making a difference. The result of both of these expressions is 1.333333333. Hence the statement is true. 
- (2) What will be the value of the following Python expression?: `print(4+3%5)`
	- 7
		- In Python, the modulus operator % has higher precedence than addition `+`. So, the expression is evaluated as `4 + (3 % 5)`, which is `4 + 3 = 7`
- (3) Evaluate the expression given below if `A = 16` and `B = 15`. `A % B // A`
	- 0
		- The expression `A%B // A` becomes `16 % 15 // 16`, which simplifies to `1 // 16`. Using floor division, the result is 0
- (4) Which of the following operators has its associativity from right to left? 
	- `**`
		- Most operators in Python are left-associative, but the exponentiation operator `***` is right-associative. So `2**3**2` is evaluated as `(2**(3**2).`
			- #question Is this for just in python or math rules as well? I think it follows math rules as well
- (5) What will be the value of `x` in the following Python expression?
```python
x = int(43.55+2/2)
print(x)
```
- #comment 2/2 $\to$ 1.0 + 43.55 $\to$ 44.55 $\to$ 44
- 44
	- The expression evaluates as `int(43.55+ 1) -> int(44.55)`, which results in 44 due to explicit conversion (truncates the decimal part).
- (6) What is the value of the following expression?
- `print(2+4.00, 2**4.0)`
	- (6.0, 16.0)
		- In Python, `2 + 4.00` results in `6.0 (float)`, and `2**4.0` results in `16.0` because any operation involving a float yields a float. So, the final result is `(6.0, 16.0)`
			- #question For `2 + 4.00`, I understand that the output would be a float giving `6.0` but why doesn't the result yield `6.00`. Why is the hundredths place truncated? Is this true no matter how many 0s there are after the decimal?
- (7) Which of the following is the truncation division operator?
	- `//`
		- `//` is the truncation (floor) division operator in Python. It returns only the integer part of the result by discarding the decimal part. For example, `20 // 3` gives 6. 
- (8) What are the values of the following Python expressions?
```python
print(2**(3**2))
print((2**3)**2)
print(2**3**2)
```
- #comment 
	- `3**2 = 9 -> 2**9 = 512`
	- `2**3 = 8 -> 8**2 = 64`
- 512, 64, 512
	- Expression 1 is evaluated as `2**9`, which is equal to 512. Expression 2 is evaluated as `8**2`, which is equal to 64. The last expression is evaluated as `2**(3**2).` This is because the associativity of `**` operator is from right to left. Hence the result of the third expression is 512
- (9) What is the value of the following expression?
```python
print(8/4/2, 8/(4,2))
```
- `1.0 4.0`
	- The first parts 8/4/2 is evaluated left to right: 2.0 / 2 = 1.0. The second part 8/(4/2) becomes 8/2 = 4.0. Hence, the result is 1.0 4.0
- #question What does a comma mean in a print statement?
- (10) What is the value of the following expression?
```python
print(float(22//3+3/3))
```
- #comment `7 + 3/3 -> 7 + 1.0 -> 8.0`
- 8.0
	- The given expression `print(float(22/ 3 + 3/3))` involves both integer and float operations. First, the division `22//3` evaluates to 7 because it divides 22 by 3 and discards the decimal part. Next, the division `3/3` evaluates to 1.0 since it is a floating-point operation. When these two values are added $\textemdash$ 7 + 1.0 $\textemdash$ the result is 8.0, because adding an integer and a float results in a float. Finally, applying `float()` to 8.0 does no change its value. Therefore, the final output of the expression is 8.0.
### (3.2) Python Precedence and Associativity-2
- (1) What will be the output of the following Python expression?
```python
print(4.00/(2.0+2.0))
```
- #comment `4.00 / 4.0 = 1.0`
- 1.0
	- The expression evaluates as `4.00 / 4.0`, which results in 1.0. Therefore, the output is 1.0. 
- (2) What will be the value of X in the following Python expression?
```python
X = 2+9*((3*12)-8)/10
print(X)
```
- 27.2
	- The expression shown above is evaluated as: `2+9*(36-8)/10`, which simplifies to give `2+9*(2.8)`, which is equal to 2+25.2 = 27.2. Hence the result of this expression is 27.2. 
- (3) Which of the following expressions involves coercion when evaluated in Python?
	- `1.7 % 2`
		- Coercion is the implicit (automatic) conversion of operands to a common type. Coercion is automatically performed on mixed-type expressions. The expression `1.7 % 2` is evaluated as `1.7 % 2.0` (that is, automatic conversion of `int` to `float`)
			- #question Is coercion is the same thing as implicit conversion or implicit casting? Are these terms just aliases?
- (4) What will be the output of the following Python expression?
```python
print(24//6%3, 24//4//2)
```
- 1 3
	- The expression `24 // 6 % 3, 24 // 4 // 2` evaluates to `(1, 3)` because the operations are performed from left to right, with `24 // 6` giving 4, followed by `4 % 3` resulting in 1, and `24 // 4` giving `6`, followed by `6 // 2` resulting in `3`.
		- #question Does division and the modulus operator have the same precedence? So that if you find one, you just compute it from left to right? 
- (5) Which among the following list of operators has the highest precedence?
	- `+, -, **, %, <<, >>, |`
	- 
## (4) Python MCQ on Bitwise & Boolean
### (4.1) Python Bitwise - 1
### (4.2) Python Bitwise - 2
### (4.3) Python Boolean
## (5) Multiple Choice Questions on Formatting & Decorators in Python
### (5.1) Python Formatting - 1
### (5.2) Python Formatting - 2
### (5.3) Python Advanced Formatting
### (5.4) Python Decorators
## (6) Python MCQ on While and For Loops
### (6.1) Python While & For Loops - 1
### (6.2) Python While & For Loops - 2
### (6.3) Python While & For Loops - 3
### (6.4) Python While & For Loops - 4
### (6.5) Python While & For Loops - 5
### (6.6) Python While & For Loops - 6
## (7) Python MCQ on Strings
### (7.1) Python Strings - 1
### (7.2) Python Strings - 2
### (7.3) Python Strings - 3
### (7.4) Python Strings - 4
### (7.5) Python Strings - 5
### (7.6) Python Strings - 6
### (7.7) Python Strings - 7
### (7.8) Python Strings - 8
### (7.9) Python Strings - 9
### (7.10) Python Strings - 10
### (7.11) Python Strings - 11
### (7.12) Python Strings - 12
### (7.13) Python Strings - 13
## (8) Python Multiple Choice Questions on Lists
### (8.1) Python Lists - 1
### (8.2) Python Lists - 2
### (8.3) Python Lists - 3
### (8.4) Python Lists - 4
### (8.5) Python Lists - 5
### (8.6) Python Lists - 6
### (8.7) Python Lists - 7
## (9) Python MCQ on List Comprehension
### (9.1) Python List Comprehension
###  (9.2) Python List Comprehension - 1
###  (9.3) Python List Comprehension - 2
###  (9.4) Python Matrix List Comprehension
## (10) MCQ on Python Tuples
### (10.1) Python Tuples - 1
- (1) Which of the following is a Python tuple?
	- `(1, 2, 3)`
		- A tuple in Python is an immutable sequence type and is defined using round brackets `()`. For example, `(1, 2, 3)` is a tuple
- (2) Suppose `t = (1, 2, 4, 3)`, which of the following is incorrect?
	- `t[3] = 45`
		- Tuples are immutable, meaning their elements can't be changed after creation. So, `t[3] = 45` is invalid and will raise a `TypeError`
- (3) What will be the output of the following Python code?
```python
t = (1, 2, 4, 3)
print(t[1:3])
```
- `(2,4)`
	- `t[1:3]` extracts elements from index 1 up to (but not including) index 3. So it returns `(2,4)` from the tuple `(1, 2, 4, 3)`. Slicing in tuples works like in lists or strings.
- (4) What will be the output of the following Python code?
```python
t = (1, 2, 4, 3)
print(t[1:-1])
```
- `(2,4)`
	- `t[1:-1]` slices the tuple from index 1 up to (but not including) the last element. So it returns `(2, 4)` from `(1, 2, 4, 3)`. Negative indices count from the end, just like in lists or strings.
		- #question Dose a `-0` exist for an index?
- (5) What will be the output of the following Python code?
```python
t = (1, 2, 4, 3, 8, 9)
print([t[i] for i in range(0, len(t), 2)])
```
- `[1,4,8]`
	- The list comprehension picks every second element from the tuple starting at index 0. This gives elements at indices 0, 2, and 4, resulting in `[1, 4, 8]`

#active
### (10.2) Python Tuples - 2
### (10.3) Python Tuples - 3
## (11) MCQ on Python Sets
### (11.1) Python Sets - 1
- (1) Which of these about a set is not true?
	- Immutable data type
		- A set in python is a mutable data type, meaning its elements can be added or removed after creation. It does not allow duplicate values and stores elements in an unordered manner.
- (2) Which of the following is not the correct syntax for creating a set?
	- `set([[1, 2], [3, 4]))`
		- While sets require an iterable as input, all elements inside the iterable must also be hashable. Lists like `[1, 2]` and `[3, 4]` are unhashable, so `set([[1, 2],[3,4]])` will raise a TypeError. The other options use valid and hashable elements like integers or tuples
	- Valid
		- `{1,2,3,4}`
		- `set((1,2,3,4))`
		- `set([1,2,2,3,4])`
- (3) What will be the output of the following Python code?
```python
nums = set([1, 1, 2, 3, 3, 3, 4, 4])
print(len(nums))
```
- 4
	-  In the code `nums = set([1,1,2,3,3,3,4,4])`, the list contains duplicates, but when it’s converted to a set, all duplicates are removed. The resulting set is `{1, 2, 3, 4}`, which has 4 unique elements. Thus, `len(nums)` returns 4.
- (4) What will be the output of the following Python code?
```python
a = [5,5,6,7,7,7] # Creates a list
b = set(a) #Turns list to set
def test(lst): # Function
    if lst in b:
        return 1
    else:
        return 0
for i in  filter(test, a): 
    print(i,end=" ")
```
- `[5, 6, 7]`
- #question What does the filter method do in python? In this case, it seems to call a function in the first argument and the second argument seems to call an iterable. 
- #comment So if `a` is `[5, 5, 6, 7, 7, 7]`, and we know that `b` will have every element that exists in `b`, then I think the answer is `5 5 6 7 7 7`
- `5 5 6 7 7 7`
	- The test function checks whether each element of list `a` exists in set `b`. Since all elements of `a` are present in `b`, the filter includes every item in `a`. Therefore, the output is the full list: 5 5 6 7 7 7.
- (5) Which of the following statements is used to create an empty set?
	- `set()`
		- Explanation: In python, using `{}` creates an empty dictionary, not a set. To create an empty set, you must use the `set()` constructor. Options like `[]` and `()` create empty list and tuple respectively, not sets. Therefore, only `set()` correctly creates an empty set
- (6) What will be the output of the following Python code?
```python
a = {5, 4}
b = {1, 2, 4, 5}
print(a < b)
```
- True
	- In Python, the `<` operator checks whether one set is a [[Proper Subset]] of another. In this case, `a = {5, 4}` and `b = {1, 2, 4, 5}`. All elements of set `a` are present in set `b`, and `a` is not equal to `b`, so `a < b` evaluates to True.
- (7) If `a={5,6,7,8}`, which of the following statements is false?
	- `a[2] = 45`
		- Sets in Python are unordered collections, so their elements cannot be accessed or modified using indexing like `a[2].` Therefore, `a[2] = 45` is invalid and raises a `TypeError`, making it the false statement. 
- (8) If `a = {5, 6, 7}`, what happens when `a.add(5)` is executed?
	- `a = {5, 6, 7}`
		- In a set, duplicate elements are automatically ignored. So, adding 5 again does nothing since it already exists in the set. The set remains unchanged as {5, 6, 7}.
- (9) What will be the output of the following python code?
```python
a = {4, 5, 6}
b = {2, 8, 6}
print(a+b)
```
- `Error as unsupported operand type for sets`
	- The `+` operator is not supported between sets in Python. To combine two sets, you should use set methods like `union()` or the `|` operator. Using `a + b` results in a `TypeError.`
- (10) What will be the output of the following Python code?
```python
a = {4, 5, 6}
b = {2, 8, 6}
print(a-b)
```
- {4, 5}
	- The `-` operator performs set difference. It returns elements that are in set `a` but not in set `b`. Since `6` is present in both sets, it is excluded from the result, leaving {4, 5}.
- (11) What will be the output of the following Python code?
```python
a = {5, 6, 7, 8}
b = {7, 8, 10, 11}
print(a^b)
```
- The `^` operator performs a [[Symmetric Difference]], which returns elements that are in either `a` or `b`, but not in both. Since 7 and 8 are common in both sets, they are excluded. The result is `{5, 6, 10, 11}`

#active 
###  (11.2) Python Sets - 2
### (11.3) Python Sets - 3
### (11.4) Python - 4
### (11.5) Python Sets - 5
## (12) Multiple Choice Questions on Python Dictionary 
### (12.1) Python Dictionary - 1
### (12.2) Python Dictionary - 2
### (12.3) Python Dictionary - 3
### (12.4) Python Dictionary - 4
## (13) Python MCQ on Built-in Functions
### (13.1) Python Built-in Functions - 1
### (13.2) Python Built-in Functions - 2
### (13.3) Python Built-in Functions - 3
## (14) Multiple Choice Questions on Python Functions
### (14.1) Python Function - 1
### (14.2) Python Function - 2
### (14.3) Python Function - 3
### (14.4) Python Function - 4
## (15) Python MCQ on Argument Passing, Variables and Recursion
### (15.1) Python Argument Passing - 1
### (15.2) Python Argument Passing - 2
### (15.3) Python Global vs Local Variables - 1
### (15.4) Python Global vs Local Variables - 2
### (15.5) Python Recursion
### (15.6) Python Shallow Copy vs Deep Copy
## (16) Python MCQ on Mapping Functions
### (16.1) Python Functional Programming Tools
### (16.2) Python Mapping Functions - 1
### (16.3) Python Mapping Functions - 2
### (16.4) Python Mapping Functions - 3
## (17) Python MCQ on Modules
### (17.1) Python Modules
### (17.2) Python Math - 1
### (17.3) Python Math - 2
### (17.4) Python Math - 3
### (17.5) Python Datetime Module - 1
### (17.6) Python Datetime Module - 2
### (17.7) Python Random Module - 1
### (17.8) Python Random Module - 2
### (17.9) Python Sys Module
### (17.10) Python Operating System
### (17.11) Python Turtle Module - 1
### (17.12) Python Turtle Module - 2
### (17.13) Python Turtle Module - 3
### (17.14) Python Pickle Module
## (18) Python MCQ on Regular Expressions
### (18.1) Python Regular Expressions
### (18.2) Python Regular Expressions - 1
### (18.3) Python Regular Expressions - 2
### (18.4) Python Regular Expressions - 3
### (18.5) Python Regular Expressions - 4
### (18.6) Python Regular Expressions - 5
## (19) Python Multiple Choice Questions on Files
### (19.1) Python Files - 1
### (19.2) Python Files - 2
### (19.3) Python Files - 3
### (19.4) Python Files - 4
### (19.5) Python Files - 5
## (20) Python MCQ on Classes and Objects
### (20.1) Python Operator Overloading
### (20.2) Python Classes and Objects - 1
### (20.3) Python Classes and Objects - 2
## (21) Python MCQ on OOPs
### (21.1) Python Inheritance - 1
### (21.2) Python Inheritance - 2
### (21.3) Python Polymorphism
### (21.4) Python Encapsulation
## (22) Python MCQ on Exception Handling
### (22.1) Python Exception Handling - 1
### (22.2) Python Exception Handling - 2
### (22.3) Python Exception Handling - 3
