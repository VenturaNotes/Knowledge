---
Source:
  - https://applyre.com/resources/500-interview-questions/python/
Length: "716"
tags:
  - status/incomplete
  - type/website
  - in-progress
Reviewed: false
---
- (1) Writing a comment in python
	- `# This is a comment`
- (2) Print 'Hello World'
	- `print('Hello, World')`
- (3) Creating variable 'x' and assign value 5 to it?
	- `x = 5`
- (4) Create multi-line string in Python
	- `""" This is a mult-line string"""` 
- (5) What is output of `print(2+3*4)`
	- `14`
- (6) Defining a function
	- `def myFunction():`
- (7) Call a function named `myFunction`
	- `myFunction()`
- (8) Creating list in python
	- `myLists = [1, 2, 3]`
- (9) What is output of following code
	- 15
```python
x = 5
y = 10
print(x+y)
```
- (10) Creating a dictionary python
	- `myDict = {'name': 'John', 'age': 30`
- (11) Output of code?
```python
for i in range(3):
	print(i)

#Output
"""
0
1
2
"""
```
- (12) Check if `x` equal to 10?
	- `if x == 10:`
- (13) Output of code?
	- `x is greater than 5`
```python
x = 10
if x > 5:
	print('x is greater than 5')
else:
	print('x is not greater than 5')
```
- (14) Creating [[tuple]] in python
	- `myTuple = (1, 2, 3)`
- (15) Output of code?
	- `2`
```python
x = 5
y = 2
print(x // y)
```
- (16) How to import the `math` module in `python`?
	- `import math`
- (17) Output of code
	- `3`
```python
x = [1, 2, 3]
print(len(x))
```
- (18) Set in Python?
	- `mySet = {1, 2, 3`
- (19) Output of code?
	- `50`
```python
x = 5
y = 10
print(x*y)
```
- (20) Writing if-else statement in Python
```python
if x > 5:
	print('x is greater than 5')
else:
	print('x is not greater than 5')
```
- (21) Purpose of a variable in Python
	- `To store data values`
- (22) Valid variable name in Python?
	- `variable_1`
	- Not valid
		- `1variable`
		- `variable-1`
		- `variable 1`
- (23) Result of `Hello, World!.rfind('o')`?
	- `8`
	- #comment
		- The `rfind()` method in Python is used to locate the last occurrence of a substring within a given string
- (24) How to format a string using a dictionary with the `format_map()` method?
	- `'Hello, {name}!'.format_map({'name': 'World'})`
- (25) Convert string to a case-folded string in python
	- string.[[casefold() (python)|casefold()]]
	- #comment A case-folded string is a string where all characters are converted to lowercase, but with a more aggressive approach than the [[lower() (Python)|lower()]] function, particularly for [[Unicode]] characters (which includes ASCII characters since ASCII is just a subset of Unicode). Essentially, it removes all case distinctions, aiming for a standardized lowercase representation for comparison purposes
- (26) Assigning value 10 to `x`
	- `x=10`
- (27) Output
	- 8
```python
x = 5
x = x + 3
print(x)
```
- (28) Which is NOT a valid variable name
	- `variable-1`
- (29) Scope of variable defined in function?
	- `Local`
- (30) Output of code
	- `10`
```python
x = 10
def func():
	x = 5
func()
print(x)
```
- (31) Update variable by adding 2 to its current value
	- `y = y + 2`
	- `y += 2`
- (32) Lifetime of a variable defined in a function
	- `Until the function ends`
- (33) What's true about variable naming conventions in Python?
	- `variable names are case-sensitive`
- (34) Output?
	- `3`
		- #comment Integers are immutable. When `z = 5` is executed, a new integer object `5` is created, and `z` is made to point to it. The object `3` that `y` is pointing to remains unchanged. If `y` and `z` were pointing to a mutable object (like a list), and `z` modified that object, then `y` would also see the change because both variables would be referencing the same underlying object.
			- #question This doesn't seem accurate as questioned as well in [[mutable (Python)|mutable]]. I ran a test as well using lists, and changing the second variable despite that they're supposed to reference the same object doesn't seem to change it? 
```python
y = 3
z = y
z = 5
print(y)
```
- (35) Correct way to delete a variable?
	- `del variable`
- (36) Output?
	- `10`
```python
x = 5
def func():
	global x
	x = 10
func()
print(x)
```
- (37) Declare multiple variables in a single line Python
	- `a, b, c = 1, 2, 3`
	- `a = 1; b = 2; c = 3`
- (38) Output of following code?
	- `10 5`
```python
x = 5
def func():
	x = 10
	print(x)
func()
print(x)
```
- (39) Result of following Python expression: 5+3
	- `8`
	- #comment Typing 5+3 in code does not result in an error (no output either)
- (40) Exponentiation in Python
	- `5 ** 2`
- (41) Result of following expression in Python: 10 % 3
	- `1`
	- #comment Acts as remainder 10/3 = 3 w/ remainder of 1
- (42) Integer variable
	- `x = 5`
- (43) Result of 7-2
	- `5`
- (44) `4*3`
	- `12`
- (45) Result of 9 / 2?
	- `4.5`
- (46) Which is not valid arithmetic operation
	- `Exponentiation with ^`
- (47) Result of `2**3`
	- 8
- (48) `15 // 4`
	- `3`
	- #comment Integer division
- (49) What is a floating-point number
	- `A number with a fractional part`
- (50) Valid floating-point number in Python?
	- `3.14`
- (51) `3.5 + 2.1`
	- `5.6`
- (52) Round `3.14159` to two decimal places
	- `round(3.14159, 2)`
- (53) Result of 10.0 / 3.0
	- `3.3333333333333335`
- (54) Convert string to floating-point number
	- `float('3.14')`
- (55) Result of operation `0.1 + 0.2`
	- `0.30000000000000004
		- #comment This occurs because of how computers represent floating-point numbers. Most floating-point numbers are stored using a binary (base-2) representation. Many decimal fractions (like 0.1, 0.2, 0.3) cannot be represented exactly as finite binary fractions so they're stored as approximations. This is a common characteristic of floating-point arithmetic in virtually all programming languages that use the IEEE 754 standard for floating-point numbers. 
			- #question What would a binary representation for a floating-point number look like? 
			- #question How is it stored as an approximation. What would this approximation be?
			- #question Can you show me the underlying floating-point arithmetic the program does so I can see the real values of `0.1` and `0.2` which gives `0.30000000000000004`?
			- #question How does floating-point arithmetic work? I would like for it to be broken down
			- #question What is the IEEE 754 standard for floating-point numbers? Is this consistent across programming languages?
				- #question What is the IEEE 754 standard? 
- (56) How to format `3.14159` to display two decimals in string
	- `'{:.2f}'.format(3.14159)`
		- #comment The colon introduces the format specifier to say: "format as floating-point number with two decimal places"
			-   `.2` is for two decimal places (and it rounds up if you'd have `3.14559` which would print `3.15)
			-   `f` is to format as fixed-point number (a floating-point number)
				- #question What is a fixed-point number? Is this different from a floating point number?
- (57) Operations in floating-point number?
	- `5/2`
- (58) Result of operation `round(2.675, 2)`
	- `2.67`
- (59) Replacing multiple characters in string with [[translation table]]
	- `string.translate(str.maketrans('abc', '123'))`
#comment 
- This creates a translation table that maps characters 'a', 'b', 'c' to '1', '2', '3' respectively. It then applies this translation to a string. It replaces every 'a' with 1, 'b' with 2 and 'c' with 3 in a given string as shown below
```python
x = "Hello abc"
string.translate(str.maketrans('abc', '123'))
print(x) # Hello 123
```
- (60) Result of `'Hello, World!'.partition(', ')`
	- `('Hello', ', ', 'World!')`
- (61) Remove leading whitespace from a string
	- `string.lstrip()`
- (62) [[Encoding]] a string to bytes using `UTF-8 encoding`
	- `string.encode('utf-8')`
- (63) Center-align a string with a specified width
	- string.[[center() python|center()]]
- (64) Check if all characters in string are uppercase
	- `string.isupper()`
- (65) Result of expression `'Hello, World!'[1:5]`?
	- `ello`
- (66) Correct way to define as string in Python?
	- (a) `string = 'Hello, World!'`
- (67) String literal
	- `'Hello, World!'`
- (68) Concatenate two strings
	- `'Hello' + "World'`
- (69) Result of `'Hello'*3`
	- `'HelloHelloHello'`
- (70) Find length of string
	- `len()`
- (71) uppercase string python
	- `string.upper()`
- (72) Replace a substring in a string
	- .[[replace() python|replace()]]
- (73) Result of `'Hello, World'.lower()`
	- `hello, world!'`
- (74) Split string into a list of words
	- `string.split()`
		- #question What does this look like? What is the delimiter / separator?
- (75) Join list of strings into a single string?
	- `join()`
		- #question would like to see example
- (76) Join list of strings into a single string with a comma separator 
	- `','join(['Hello', 'World'])'`
		- #question What is ',' called in this case? Is it a delimiter?
		- #question What happens if you use a different separator?
- (77) Result of `'Hello, World!'.find( 'World')`
	- 7
		- #comment returns the index of `W` in `World`
		- #question What does it return if can't find `W`?
- (78) Format string using f-strings
	- `f'Hello, {name}!'`
		- #question Need more examples
		- #question How would it format it? 
- (79) Format string using `format()` method
	- `'Hello, {}}!'.format(name)`
		- #question How would this work?
- (80) Result of `'Hello, {}!'.format('World')?`
	- `'Hello, World!'`
- (81) Format string using `%` operator
	- `Hello, %s! % name`
		- #question need example
- (82) Valid string literal
	- "Hello, World!"
- (83)Result of `Hello, World!'.replace('World','Python')`
	- 'Hello, Python!'
- (84) String starts with specific substring
	- `string.startswith(substring)`
- (85) Result of `'Hello, World!'.split(', ')?`
	- `['Hello', 'World!']`
- (86) Remove whitespace from beginning and end of string
	- `string.strip()`
		- #question what does `sting.trim()` do if it exists?
- (87) Value of `'Hello, World!'.count('o')?`
	- `2`
		- #comment seems to count number of occurrences of character
- (88) String contains specific substring
	- `'substring' in string`
- (89) Result of `'Hello, World!'.index('World')?`
	- 7
		- #question Which method is similar to this? How is this different from the find method? 
- (90) Convert string to lowercase in Python
	- `string.lower()`
- (91) Result of `'Hello, World!'.capitalize()`
	- `'Hello, world!'`
		- #comment seems like it capitalizes the first word
		- #question Does it need to be the first word or just first character?
- (92) Result of` '42'.zfill(5)`
	- `'00042'`
		- #comment seems like a spacing thing
		- #question is there a difference between `zfill` and `fill` if it exists?
- (93) Check if string ends with specific substring
	- `string.endswith(substring)`
- (94) Result of `Hello, World!.title()`?
	- `'Hello, World!'`
		- Capitalizes the first character of every word
- (95) How to check if all characters in a string are digits
	- `string.isdigit()`
		- #question What does `.isnumeric()` do? Isn't it the same?
- (96) Result of `Hello, World!'.swapcase()`
	- `'hELLO, WORLD!'`
- (97) Check if all characters in a string are alphabetic
	- `string.isalpha()`
- (98) Result of `'Hello, World!'.rsplit(', ')`
	- `['Hello', 'World!']`
		- #question how is this different from split?
- (99) Boolean literal in python
	- `True`
- (100) `print(True and False)`
	- `False`
- (101) `print(True or False)`
	- `True`
- (102) `print(not True)`
	- `False`
- (103) Comparison operator
	- `==`
- (104) `print(5 == 5)`
	- `True`
- (105) `print(5 != 5)`
	- False
- (106) `print(5 < 10)`
	- `True`
- (107) `print(10 > 5)`
	- `True`
- (108) `print(5 <= 5)`
	- `True`
- (109) `print(5 >= 10)`
	- `False`
- (110) Check if two variables not equal
	- `a != b`
- (111) `print(True and not False)`
	- `True`
- (112) `((5 > 3) and (2 < 4))`
	- `True`
- (113) Convert `'123'` to an integer in Python
	- `int('123')`
- (114) `float('3.14')`
	- `3.14`
- (115) Convert integer 10 to a string
	- `str(10)`
- (116) `bool(0)`
	- `False`
- (117) Implicit type conversion example
	- `result = 10 + 2.5`
- (118) `str(True)`
	- `'True'`
- (119) Explicitly convert `'False'` to boolean in Python
	- `bool('False')`
- (120) `int(3.99)`
	- 3
- (121) Convert boolean True to an integer
	- `int(True)`
	- #comment This would return `1`
- (122) `bool('')`
	- `False`
		- #comment Probably false because empty string (and true if string not empty)
- (123) Checking type of variable
	- `type(x)`
- (124) Check if a variable `x` is of type `int` using the `isinstance()` function
	- `isinstance(x, int)`
- (125) Difference between `type()` and `isinstance()`
	- `type()` checks the exact type, while `isinstance()` checks for subclass relationships as well
		- #question what does subclass relationships mean?
- (126) Mutable data type in `Python`
	- `List`
- (127) Which is correct about mutable and immutable types?
	- Mutable types can be changed after they are created, while immutable types cannot.
- (128) Example of immutable data type
	- `tuple`
		- #question is there a way to check in code if a data type is immutable or not similar to using the `type` method? 
- (129) Output of following code
	- `[1, 2, 3, 4]`
```python
x = [1, 2, 3]
y = x
y.append(4)
print(x)
```
- (130) Output of following code
	- `(1, 2, 3)`
	- #question How does `y+= (4,)` work? Does this only work for tuples?
```python
x = (1, 2, 3)
y = x
y += (4,)
print(x)
```
- (131) Not a mutable data type
	- `str`
- (132) Purpose of try-except block
	- Handle exceptions that occur in the try block
- (133) Correct syntax to catch a specific exception
	- `try: ... except Exception as e:`
		- #question I want to see an example
- (134) Output of Code
	- `cannot divide by zero`
```python
try:
	print(1 / 0)
except ZeroDivisionError:
	print("cannot divide by zero')
```
- (135) Raise an exception
	- `raise Exception('Error')`
- (136) Purpose of finally block
	- `Execute code regardless of whether an exception occurs or not`
		- #question What does this look like?
- (137) Truth about else block in try-except-else structure?
	- `executed only if no exception occurs`
- (138) Output?
	- `An error occurred`
	- #comment Explanation
		- The `raise ValueError` creates an instance of the `ValueError` exception with a message `An error occurred`
		- The `except` block catches the `ValueError` raised
		- `as e` assigns the caught exception to the variable `e`
		- `print(e)` outputs the message stored in the exception
```python
try:
	raise ValueError('An error occurred')
except ValueError as e:
	print(e)
```
- (139) What exception is raised when key not found in dictionary?
	- `KeyError`
- (140) How to catch multiple exceptions in a single block?
	- `except (Exception1, Exception2):`
- (141) Output
```python
try:
	x = int('abc')
except ValueError:
	print('ValueError occurred')
finally:
	print('Finnaly block executed')

#Output
"""
ValueError occurred
Finally block executed
"""
```
- (142) Return a value from a function
	- `return value`
- (143) Purpose of 'self' parameter in a method within a class?
	- It refers to the instance of the class
	- #question I would like to see an example of this
- (144) Define function with default parameters
	- `def myFunction(a, b=2):`
- Which of the following is a correct way to define a function with default parameters?
	- Options
		- (a) `def myFunction(a=1, b):`
		- (b) `def myFunction(a, b=2):`
		- (c) `def myFunction(a: int, b: int = 2):`
		- (d) `def myFunction(a: int = 1, b: int):`
	- #question Why is `b` the only correct answer? It doesn't seem to make sense. Seems like ChatGPT is suggesting only default parameters have to go after the non-default ones in python?
- (145) Define lambda function in python?
	- `lambda x: x + 1`
- #comment Example
	- Syntax for lambda functions is `lambda arguments: expression`
```python
add = lambda x, y: x + y
print(add(5,3))
# Output: 8
```
- (146) Output of code?
	- 5
```python
def myFunction(a, b):
	return a + b
print(myFunction(2, 3))
```
- (147) What is true about decorators?
	- decorators are used to modify the behavior of a function or method
	- #question What is a decorator?
- (148) Purpose of `global` keyword
	- To declare that a variable inside a function is global
- (149) Output of code
	- 6
```python
def myFunction(a, b=1, c=2):
	return a + b + c
print(myFunction(3))
```
- (150) What does `abs()` function do?
	- Returns the absolute value of a number
- (151) Output of `abs(-5.5)`
	- `5.5`
- (152) `all()` function
	- Returns True if all elements of the iterable are true
- (153) Output of `all([True, False, True])`
	- `False`
- (154) What does the `any()` function do
	- Returns True if any element of the iterable is true
- (155) Output of `any([False, False, True])`
	- True
- (156) What does `ascii()` function do
	- Returns a string containing a printable representation of an object
	- #question What does this mean? I need an example
- (157) What is output of `ascii('Hello, World'!)`?
	- `'Hello, World!'`
- (158) What does [[bin() (Python)|bin()]] function do?
	- Returns binary representation of an integer?
	- #question What does this look like?
- (159) What will be output of `bin(10)`?
	- `'0b1010`
		- #question why is there a 0b in the beginning?
- (160) What does `bool()` function do in `Python`?
	- Returns the boolean value of an object?
		- #question what does this look like?
- (161) Output of `bool(0)`
	- `False`
- (162) What does `bytearray()` function do?
	- Returns a new array of bytes?
	- #question How is this used and why?
- (163) What will be output of `bytearray('hello', 'utf-8')`
	- `bytearray(b'hello')`
		- #question What format is `bytearray`. Can this be used for encoding?
		- #question What would adding multiple strings look like?
- (164) `bytes()` function in python
	- Returns a new bytes object
	- #question Why? What are the benefits of a bytes object?
- (165) Output of `bytes('hello', 'utf-8')`
	- `b'hello'`
		- #question How is this different from `bytearray`?
- (166) What is `callable()` function in Python?
	- Returns True if the object appears callable
	- #question Examples please
- (167) What is output of `callable(len)`?
	- True
		- #question Why is it True? 
- (168) What does `chr()` function do in Python?
	- Returns the string representing a character whose Unicode code point is the integer?
		- #question What does this mean?
		- #question does `chr()` return a string or integer?
- (169) Output of `chr(97)`
	- `'a'`
		- #question Is this based on ASCII table or Unicode or are they the same?
- (170) What does `classmethod()` do?
	- `Converts a method into a class method`
	- #question What is the difference between method and class method?
- (171) Output of following code:
	- `Hello`
	- #question What does `@classmethod do`. Is this necessary to call the method?
	- #question Why are we able to call a method from a different class
	- #question Does it matter what class the print statement is currently in?
```python
class MyClass:
	@classmethod
	def my_method(cls):
		return 'Hello'
print(MyClass.my_method())
```
- (172) What does `compile()` function do?
	- Compiles the source into a code or AST object
	- #question What is the code or AST object?
- (173) What is output of following code?
	- `42`
	- #question what does the exec() function do? Why would you want to run code this way? Is this similar to rust?
	- #question What is the point of the `compile()` function? 
```python
code = compile('print(42)','','exec')
exec(code)
```
- (174) What does the `complex()` function do?
	- Returns a complex number
- (175) What is output of `complex(1, 2)`?
	- (1 + 2j)
- (176) What does `delattr()` do?
	- Deletes the named attribute from an object
	- #question Can I see an example of this?
- (177) What will be output of following code?
	- `False`
	- #question What happens when the attribute is deleted?
	- #question Why are you able to make an object from a class. Can you make an object from a method?
	- #question What does `hasattr()` do?
```python
class MyClass:
	def __init__(self):
		self.x = 10

obj = MyClass()
delattr(obj, 'x')
print(hasattr(obj, 'x'))
```
- (178) What does the `dict()` function do?
	- Creates a new dictionary
- (179) Output of `dict(a=1, b=2)`
	- `{'a': 1, 'b': 2}`
- (180) What does the `dir()` function do
	- Returns a list of the attributes and methods of an object
	- #question What is the difference between attributes and methods of an object
	- #question what can be an object in python
	- #question Give an example of an object having both attributes and methods. Can classes only have methods? 
- (181) Output of `dir([])`
	- A list of attributes and methods of a list object
	- #question What would be the output?
- (182) What does `divmod()` do?
	- `Returns a tuple containing the quotient and remainder`
	- #question I would like to see an example
- (183) Output of `divmod(10, 3)`
	- (3, 1)
- (184) What does `enumerate()` do?
	- Adds a counter to an iterable and returns it
- (185) Output of `list(enumerate(['a', 'b', 'c']))`
	- `[(0, 'a'), (1, 'b'), (2, 'c')]`
- (186) What does `eval()` do?
	- Evaluates the specified expression
	- #question Why would it not be "executes" the expression? Isn't it the same thing?
- (187) What is output of `eval('2+2')`?
	- 4
	- #question Is the eval interpreting a string?
- (188) What does `exec()` do?
	- Executes the specified code
	- #question I need example
- (189) `exec('print(42)')`
	- 42
	- #question What is the difference of doing `exec` and `print` in this case?
- (190) `filter()` function
	- Constructs an iterator from elements of an iterable for which a function returns true
	- #question How is this different from enumerate or map
	- #question Example please 
- (191) Output of `list(filter(lambda x: x > 0, [-1, 0, 1, 2]))`
	- `[1, 2]`
	- #question does filter always need to take a lambda? Could you just do x > 0 to indicate the condition? 
- (192) What does `float()` do?
	- Returns a floating point number
	- #question why do we have an integer number but not an integer point number?
- (193) Output of `float('3.14')`
	- 3.14
	- #question is it casting it from a string?
- (194) What does `format()` do?
	- Formats a specified value
	- #question What type of value can it specify?
- (195) Output for `format(1234, ',')`
	- `'1,234'`
	- #question is the output a string?
- (196) What does `frozenset()` do?
	- Returns a new frozenset object
	- #question what is a frozenset object? 
- (197) What does `frozenset([1, 2, 3])` output?
	- `frozenset({1, 2, 3})`
	- #question What's the difference between a set and a frozenset?
- (198) What does `getattr()` do?
	- Gets the value of an attribute of an object
	- #question Does it just work for objects?
	- #question Can you do this for classes to?
- (199) Using `getattr()` to get value of 'name' attribute of object `obj` with default value `Unknown` if attribute does not exist
	- `getattr(obj, 'name', 'Unknown'`
	- #question Example needed
- (200) What does `globals()` return?
	- A dictionary representing the current global symbol table
	- #question I would like an example
	- #question what is a global symbol table?
- (201) Which statement is true about `globals()`?
	- It can be used to modify global variables
	- #question How can it modify global variables
- (202) What does `hasattr()` do?
	- It checks if an object has a specific attribute
- (203)How to use `hasattr()` to check if object `obj` has an attribute `name`
	- `hasattr(obj, 'name')`
	- #question Can you use this for a class if it has a name?
	- #question What is the difference between a class being an object and then creating an object of a class (if that's a thing)
- (204) What does `hash()` do?
	- It returns the hash value of an object
	- #question Do all objects have hash values?
- (205) Which types can be hashed using the `hash()` function
	- `int, float, str, tuple`
	- #question Can these types only be hashed because they're immutable?
	- #question Are these types considered objects or just types? 
- (206) What does `help()` do?
	- It provides the documentation of an object
	- #question Does it provide the documentation of a built-in object or an object you have created yourself from a class you made
- (207) How to use `help()` to get documentation of `str` type
	- `help(str)`
	- #question Does python know `str` or `string`
	- #question Do you need to import `string` to make it work?
	- #question is `str` a type or object?
- (208) What does `hex()` do?
	- It converts an integer to a hexadecimal string
	- #question Why can't `hex` work on strings or floats?
	- #question What does a hexadecimal string look like?
- (209) Use `hex()` to convert integer 255 to hexadecimal string
	- `hex(255)`
	- #question What does the output look like?
- (210) What does `id()` return?
	- The unique identifier of an object
	- #question What is the unique identifier
	- #question Is the unique identifier at the memory address? How is this different from the hash value? 
- (211) Which is true about `id()` function?
	- It returns a unique identifier for the object during its lifetime
		- #question What does unique identifier look like?
		- #question What is meant by lifetime? Will the unique identifier change across runs or function calls?
		- #question Since python uses an interpreter, do you still call it a compilation when running it? 
- (212) Format 3.14159 to display only two decimal places in a string
	- `{:.2f}'.format(3.14159)`
		- #question What does the output look like?
- (213) Using `input()` function to prompt user with message "Enter your name"
	- `input('Enter your name')`
		- #question Is it possible to ask and save variable in one line?
- (214) What does `int()` do?
	- Converts number or string to integer
- (215) Using `int()` to convert string `123` to integer
	- `int('123')`
- (216) What does `isinstance()` do?
	- Checks if an object is an instance of a class or a tuple of classes?
		- #question What is meant by tuple of classes?
		- #question Example?
- (217) Using `isinstance()` to check if an object `x` is an instance of `int` class
	- `isinstance(x, int)`
		- #question Is `int` a built in term in python?
		- #question Would data type of `int` be `int`?
		- #question Output?
- (218) What does `issubclass()` do?
	- Checks if a class is a subclass of another class
		- #question What does this look like?
		- #question Are classes just functions?
- (219) Use `issubclass()` to check if `B` is a subclass of `A`
	- `issubclass (B, A)`
		- #question Are `B` and `A` classes or functions?
- (220) What does `iter()` do in Python?
	- It returns an iterator object
		- #question What is an iterator object?
		- #question How do I check if an object is iterable?
		- #question How would I return next item from iterator?
		- #question Is this related to generators at all?
- (221) How to use `iter()` function to create an iterator from a list `lst`
	- `iter(lst)`
		- #question What does this look like?
- (222) What does the `len()` function do in Python?
	- It returns the number of items in an object
- (223) How do you use the `len()` function to get the number of items in a list `lst`?
	- `len(lst)`
- (224) What does the `list()` function do in Python?
	- It creates a new List
- (225) How do you use the `list()` function to convert a tuple `tup` to a list?
	- `list(tup)`
- (226) What does the `locals()` function return in Python?
	- A dictionary representing the current local symbol table
		- #question What does this look like? I would like to see an example
- (227) Which of the following statements is true about the `locals()` function? 
	- It can be used to modify local variables
		- #question How? I would like to see an example of this. 
- (228) What does the `map()` function do in Python?
	- It applies a function to all items in an iterable
- (229) How do you use the `map()` function to apply a function `func` to all items in a list `lst`?
	- `map(func, lst)`
- (230) What does the `max()` function do in Python?
	- It returns the largest item in an iterable or the largest of two or more arguments
- (231) How do you use the `max()` function to find the largest number in a list `lst`?
	- `max(lst)`
- (232) What does the `memoryview()` function do in Python? 
	- It returns a memory view object of the given argument
		- #question What does this look like?
- (233) Which of the following statements is true about the `memoryview()` function?
	- It allows Python code to access the internal data of an object that supports the buffer protocol without copying
		- #question What is the buffer protocol?
		- #question What is meant by internal data?
		- #question I would like an example of this
- (234) What does the `min()` function do in Python?
	- It returns the smallest item in an iterable or the smallest of two or more arguments
- (235) How do you use the `min()` function to find the smallest number in a list `lst`
	- `min(lst)`
- (236) What does the `next()` function do in Python?
	- It returns the next item from an iterator.
		- #question Isn't it iterable? What is the difference between iterator and iterable?
- (237) How do you use the `next()` function to get the next item from an iterator `it` with a default value `None` if the iterator is exhausted?
	- `next(it, None)`
		- #question How can you get the next item if the iterator is exhausted?
- (238) What does the `object()` function do in Python?
	- It returns a new featureless object
		- #question What does this mean?
- (239) Which of the following statements is true about the `object()` function?
	- It returns a new featureless object that is the base for all classes
		- #question How is it the base for all classes?
- (240) What does the `oct()` function do in Python?
	- It converts an integer to an octal string
		- #question What does an octal string look like?
		- #question What makes it useful? 
- (241) How do you use the `oct()` function to convert the integer 8 to an octal string?
	- `oct(8)`
- (242) What does the `open()` function do in Python?
	- It opens a file and returns a file object
- (243) How do you use the `open()` function to open a file `example.txt` in read mode?
	- `open('example.txt', 'r')`
- (244) What does the Python built-in function `ord()` do? 
	- Converts a character to its corresponding ASCII value
- (245) Which of the following will return the ASCII value of the character `A` using `ord()`?
	- `ord('A')`
- (246) What does the Python built-in function `pow()` do?
	- Calculates the power of a number
- (247) Which of the following will correctly calculate 2 raised to the power of 3 using `pow()?`
	- `pow(2,3)`
- (248) What does the Python built-in function `print()` do?
	- Outputs a message to the console
- (249) Which of the following will correctly print `Hello, World!` to the console?
	- `print('Hello, World!')`
- (250) What does the Python built-in function `property()` do?
	- Creates a property of a class
		- #question What does this look like?
- (251) Which of the following correctly defines a property in a class using `propert()`?
	- `property(fget=None, fset=None, fdel=None, doc=None)`
		- #question So if I create a class andI want it to contain properties, I use this? I would like to see an example
- (252) What does the python built-in function `range()` do?
	- Generates a sequence of numbers
- (253) Which of the following will generate a sequence of numbers from 0 to 4 using `range()`?
	- `range(5)`
		- #question Isn't `range(0,5)` also valid? 
- (254) What does the Python built-in function `repr()` do?
	- Returns a string representation of an object for debugging
		- #question I would like an example for this
		- #question What other debugging features does python have?
- (255) Which of the following will return the string representation of the list `[1, 2, 3]` using `repr()`?
	- `repr([1, 2, 3])`
		- #question What is returned here?
- (256) What does the python built-in function `reversed()` do?
	- Returns a reversed iterator
		- #question What data structures in python are considered iterators?
- (257) Which of the following will return a reversed iterator of the list `[1, 2, 3]` using `reversed()`?
	- `reversed([1, 2, 3])`
- (258) What does the python built-in function `round()` do?
	- Rounds a number to a specified number of decimal places
		- #question How would this be done?
- (259) Which of the following will correctly round the number 3.14159 to 2 decimal places using `round()`?
	- `round(3.14159, 2)`
- (260) What does the Python built-in function `set()` do?
	- Creates a set
- (261) Which of the following will correctly create a set containing the elements 1, 2, and 3 using `set()`?
	- `set([1, 2, 3])`
		- #question Why won't the following work?
			- `set((1, 2, 3))`
				- #question Wouldn't this convert a tuple to a set?
			- `set(1, 2, 3)`
				- #question Does this just not work because it's not really a list?
- (262) What does the Python built-in function `setattr()` do?
	- Sets the value of an attribute of an object
		- #question What does an example look like?
- (263) Which of the following will correctly set the attribute `name` of an object `obj` to `John` using `setattr()`?
	- `setattr(obj, 'name', 'John'`
		- #question I would like to see an example of this

## Solutions
-   **(74) What does this look like? What is the delimiter / separator?**
    The `string.split()` method splits a string into a list of substrings.
    -   **Without arguments**: If no separator is provided, `split()` treats any sequence of whitespace characters (spaces, tabs, newlines) as a single delimiter and removes empty strings from the result.
    -   **With an argument**: If a separator string is provided, the string is split by occurrences of that separator.
    Examples:
    ```python
    s1 = "Hello World Python"
    print(s1.split()) # Output: ['Hello', 'World', 'Python']

    s2 = "apple,banana,cherry"
    print(s2.split(',')) # Output: ['apple', 'banana', 'cherry']
    ```

-   **(75) would like to see example**
    The `join()` method is a string method that concatenates elements of an iterable (like a list or tuple of strings) into a single string. The string on which `join()` is called acts as the separator between the elements.
    Example:
    ```python
    words = ['Hello', 'World', 'Python']
    separator = ' '
    result = separator.join(words)
    print(result) # Output: 'Hello World Python'
    ```

-   **(76) What is ',' called in this case? Is it a delimiter?**
    In `','.join(['Hello', 'World'])`, the `','` is the **separator** (or delimiter) that will be placed between each element of the list when they are joined together.

-   **(76) What happens if you use a different separator?**
    The string used before `.join()` will be inserted between the elements of the iterable.
    Example:
    ```python
    my_list = ['apple', 'banana', 'cherry']
    print('-'.join(my_list))      # Output: 'apple-banana-cherry'
    print('***'.join(my_list))    # Output: 'apple***banana***cherry'
    ```

-   **(77) What does it return if can't find `W`?**
    The `find()` method returns `-1` if the substring is not found.
    Example:
    ```python
    s = "Hello, World!"
    print(s.find('Python')) # Output: -1
    ```

-   **(78) Need more examples**
    **(78) How would it format it?**
    F-strings (formatted string literals) provide a concise and convenient way to embed expressions inside string literals for formatting. They are prefixed with `f` or `F`. It formats by evaluating the expressions inside the curly braces `{}` and converting them to strings, then inserting them into the f-string. You can also apply format specifiers (like `:.2f` for two decimal places) within the curly braces.
    Examples:
    ```python
    name = "Alice"
    age = 30
    print(f"My name is {name} and I am {age} years old.")
    # Output: My name is Alice and I am 30 years old.

    price = 19.99
    print(f"Price: ${price:.2f}")
    # Output: Price: $19.99
    ```

-   **(79) How would this work?**
    The `str.format()` method uses curly braces `{}` as placeholders for values. You pass the values as arguments to the `format()` method, and they are inserted into the placeholders in order, or by name/index.
    Example:
    ```python
    name = "World"
    print('Hello, {}!'.format(name)) # Output: 'Hello, World!'

    # Positional arguments
    print('My name is {} and I am {} years old.'.format('Bob', 25))
    # Output: My name is Bob and I am 25 years old.
    ```

-   **(81) need example**
    The `%` operator is an older way to format strings in Python.
    Example:
    ```python
    name = "Alice"
    age = 30
    print("Hello, %s! You are %d years old." % (name, age))
    # Output: Hello, Alice! You are 30 years old.

    pi = 3.14159
    print("The value of pi is approximately %.2f." % pi)
    # Output: The value of pi is approximately 3.14.
    ```

-   **(86) what does `sting.trim()` do if it exists?**
    Python strings do not have a `trim()` method. The equivalent functionality is provided by `strip()`, `lstrip()`, and `rstrip()`.
    -   `strip()`: Removes leading and trailing whitespace.
    -   `lstrip()`: Removes leading whitespace.
    -   `rstrip()`: Removes trailing whitespace.

-   **(89) Which method is similar to this? How is this different from the find method?**
    The `index()` method is similar to `find()` in that both return the lowest index in the string where the substring is found.
    The key difference is how they behave if the substring is *not* found:
    -   `str.find(sub)`: Returns `-1` if the substring is not found.
    -   `str.index(sub)`: Raises a `ValueError` if the substring is not found.
    Example:
    ```python
    my_string = "Hello World"
    print(my_string.find("Python")) # Output: -1
    # print(my_string.index("Python")) # This would raise a ValueError
    ```

-   **(91) Does it need to be the first word or just first character?**
    `str.capitalize()` capitalizes only the *first character* of the entire string and converts all other characters to lowercase. It doesn't care about words.
    Example:
    ```python
    s1 = "hello world"
    print(s1.capitalize()) # Output: 'Hello world'
    ```

-   **(92) is there a difference between `zfill` and `fill` if it exists?**
    Python strings have a `zfill()` method, but there is no built-in `fill()` method for strings. `zfill(width)` pads the string on the left with zero digits to fill a specified `width`. It's specifically for numeric strings and handles signs correctly.
    Example:
    ```python
    s1 = "42"
    print(s1.zfill(5)) # Output: '00042'
    ```

-   **(95) What does `.isnumeric()` do? Isn't it the same?**
    `str.isdigit()`, `str.isnumeric()`, and `str.isdecimal()` are related but have subtle differences, especially with Unicode characters:
    -   `isdigit()`: Returns `True` if all characters are digits (0-9 and some Unicode digits).
    -   `isnumeric()`: Returns `True` if all characters are numeric characters, including digits, fractions, Roman numerals, etc. It's the broadest category.
    -   `isdecimal()`: Returns `True` if all characters are decimal characters (0-9).
    For most common use cases with standard Arabic numerals (0-9), `isdigit()` is often sufficient. `isnumeric()` is broader and includes more types of numbers.

-   **(98) how is this different from split?**
    `str.rsplit()` is very similar to `str.split()`, but it splits the string starting from the *right* side. This difference is only significant when you provide a `maxsplit` argument. If `maxsplit` is not provided, `rsplit()` behaves identically to `split()`.
    Example:
    ```python
    s = "apple,banana,cherry,date"
    print(s.split(',', 1))  # Splits once from the left: ['apple', 'banana,cherry,date']
    print(s.rsplit(',', 1)) # Splits once from the right: ['apple,banana,cherry', 'date']
    ```

-   **(119) Explicitly convert `'False'` to boolean in Python**
    The provided answer `bool('False')` is correct, but it's important to note that it evaluates to `True`. In Python, `bool()` converts values based on their "truthiness": empty sequences, numeric zero, and `None` are `False`; all other values (including the non-empty string `'False'`) are `True`.
    If you want to convert the *word* "False" in a string to its boolean value, you would typically use a conditional statement:
    ```python
    s = 'False'
    boolean_value = True if s.lower() == 'true' else False
    print(boolean_value) # Output: False
    ```

-   **(122) Probably false because empty string (and true if string not empty)**
    Yes, that's correct. `bool('')` returns `False` because an empty string is considered "falsy" in Python. Any non-empty string would evaluate to `True`.

-   **(125) what does subclass relationships mean?**
    In object-oriented programming, a subclass relationship (inheritance) means that one class (the subclass or child class) derives properties and behaviors from another class (the superclass or parent class). `isinstance()` checks if an object is an instance of a class *or any of its subclasses*, while `type()` checks for the *exact* class.
    Example:
    ```python
    class Animal: pass
    class Dog(Animal): pass
    my_dog = Dog()
    print(isinstance(my_dog, Animal)) # True (Dog is a subclass of Animal)
    print(type(my_dog) == Animal)     # False (not the exact type)
    ```

-   **(128) is there a way to check in code if a data type is immutable or not similar to using the `type` method?**
    There isn't a direct built-in function. Immutability is a property of the *type*. You can infer it by checking the type against known immutable types (e.g., `int`, `float`, `str`, `tuple`, `frozenset`, `bytes`).
    ```python
    def is_immutable_type(obj):
        return isinstance(obj, (int, float, str, tuple, frozenset, bytes))
    print(is_immutable_type(5))      # True
    print(is_immutable_type([1,2]))  # False
    ```

-   **(130) How does `y+= (4,)` work? Does this only work for tuples?**
    `y += (4,)` performs tuple concatenation. `(4,)` creates a single-element tuple (the comma is essential). Since tuples are immutable, this operation creates a *new* tuple by concatenating `y` with `(4,)`, and then `y` is reassigned to point to this new tuple. The original tuple `x` still points to `(1, 2, 3)`. This concatenation behavior works for other sequence types like lists and strings, but the immutability aspect is specific to tuples and strings.

-   **(133) I want to see an example**
    ```python
    try:
        num = int(input("Enter a number: "))
        result = 10 / num
        print(f"Result: {result}")
    except ValueError as e:
        print(f"Invalid input: {e}. Please enter an integer.")
    except ZeroDivisionError as e:
        print(f"Error: {e}. Cannot divide by zero.")
    except Exception as e: # Catch-all for any other unexpected exceptions
        print(f"An unexpected error occurred: {e}")
    ```

-   **(136) What does this look like?**
    The `finally` block is always executed, regardless of whether an exception occurred or was caught. It's used for cleanup.
    Example:
    ```python
    file = None
    try:
        file = open("my_file.txt", "r")
        content = file.read()
        print(content)
    except FileNotFoundError:
        print("File not found!")
    finally:
        if file:
            file.close()
            print("File closed.")
    ```

-   **(143) I would like to see an example of this**
    In Python classes, `self` is the first parameter of any instance method. It refers to the instance of the class itself, allowing you to access its attributes and other methods.
    Example:
    ```python
    class Dog:
        def __init__(self, name):
            self.name = name # 'self.name' refers to the instance's name

        def bark(self):
            print(f"{self.name} says Woof!") # Uses 'self.name'

    my_dog = Dog("Buddy")
    my_dog.bark() # Output: Buddy says Woof!
    ```

-   **(144) Why is `b` the only correct answer? It doesn't seem to make sense. Seems like ChatGPT is suggesting only default parameters have to go after the non-default ones in python?**
    Yes, that's correct. In Python, **all parameters with default values must come after any parameters without default values.** This is a syntax rule to avoid ambiguity.
    -   (a) `def myFunction(a=1, b):` - Invalid (non-default `b` after default `a`).
    -   (b) `def myFunction(a, b=2):` - Valid.
    -   (c) `def myFunction(a: int, b: int = 2):` - Valid (type hints don't change the rule).
    -   (d) `def myFunction(a: int = 1, b: int):` - Invalid (non-default `b` after default `a`).

-   **(147) What is a decorator?**
    A decorator is a design pattern that allows you to modify or enhance the behavior of a function or method without permanently altering its code. It's a function that takes another function as an argument, adds some functionality, and returns a new function. They are typically used with the `@decorator_name` syntax.
    Example:
    ```python
    def my_decorator(func):
        def wrapper():
            print("Before function call")
            func()
            print("After function call")
        return wrapper

    @my_decorator
    def say_hello():
        print("Hello!")

    say_hello()
    # Output:
    # Before function call
    # Hello!
    # After function call
    ```

-   **(156) What does this mean? I need an example**
    The `ascii()` function returns a string containing a printable representation of an object, but it escapes any non-ASCII characters using `\x`, `\u`, or `\U` escapes. This is useful for debugging or when you need a representation that is strictly ASCII.
    Example:
    ```python
    s = "Hello, España!" # 'ñ' is non-ASCII
    print(ascii(s)) # Output: 'Hello, Espa\xf1a!'
    ```

-   **(158) What does this look like?**
    The `bin()` function converts an integer to its binary representation, prefixed with `0b`.
    Example:
    ```python
    print(bin(5)) # Output: '0b101'
    ```

-   **(159) why is there a 0b in the beginning?**
    The `0b` prefix is a standard convention in Python (and many other programming contexts) to indicate that the following digits represent a binary number. It helps distinguish binary numbers from decimal, octal, or hexadecimal numbers.

-   **(160) what does this look like?**
    The `bool()` function converts a value to its boolean representation (`True` or `False`).
    Examples:
    ```python
    print(bool(1))      # True
    print(bool(0))      # False
    print(bool("hello")) # True
    print(bool(""))      # False
    ```

-   **(162) How is this used and why?**
    `bytearray()` returns a new array of bytes. Unlike `bytes` objects, `bytearray` objects are **mutable**. This means you can modify their contents after creation. They are used when you need to perform in-place modifications on a sequence of bytes, which is common in low-level programming, network protocols, or file manipulation for memory efficiency.
    Example:
    ```python
    ba = bytearray("hello", "utf-8")
    ba[0] = ord('J') # Modify the first byte
    print(ba) # Output: bytearray(b'Jello')
    ```

-   **(163) What format is `bytearray`. Can this be used for encoding?**
    The output `bytearray(b'hello')` indicates it's a `bytearray` object containing the byte sequence `b'hello'`. The `b` prefix denotes a bytes literal. Yes, `bytearray()` can be used for encoding; you must specify the encoding (e.g., `bytearray("你好", "utf-8")`).

-   **(163) What would adding multiple strings look like?**
    You can't directly add multiple strings in the constructor. You would typically encode them individually and then extend the `bytearray`:
    ```python
    ba = bytearray("Hello", "utf-8")
    ba.extend(bytearray(" World", "utf-8"))
    print(ba) # Output: bytearray(b'Hello World')
    ```

-   **(164) Why? What are the benefits of a bytes object?**
    `bytes()` returns a new `bytes` object, which is a sequence of **immutable** bytes.
    Benefits:
    -   **Immutability**: Makes them hashable (usable as dictionary keys, set elements) and safe from accidental modification.
    -   **Representing binary data**: Primary way to handle binary data (files, network, crypto).
    -   **Efficiency**: Efficient for operations that don't require in-place modification.

-   **(165) How is this different from `bytearray`?**
    The fundamental difference is **mutability**:
    -   **`bytes`**: Immutable. Content cannot be changed after creation.
    -   **`bytearray`**: Mutable. Content can be changed in-place.

-   **(166) Examples please**
    The `callable()` function returns `True` if the object appears callable (can be called like a function), and `False` otherwise.
    Examples:
    ```python
    def func(): pass
    class MyClass:
        def __call__(self): pass # Makes instances callable
    obj = MyClass()
    print(callable(func))    # True
    print(callable(len))     # True
    print(callable(MyClass)) # True (class itself is callable to create instances)
    print(callable(obj))     # True (instance is callable due to __call__)
    print(callable(123))     # False
    ```

-   **(167) Why is it True?**
    `len` is a built-in function in Python. Functions are callable objects, meaning you can execute them by placing parentheses after their name (e.g., `len("abc")`). Therefore, `callable(len)` returns `True`.

-   **(168) What does this mean?**
    **(168) does `chr()` return a string or integer?**
    `chr()` returns a **string** of a single character. It takes an integer argument, which is interpreted as a Unicode code point, and returns the corresponding character. A Unicode code point is a unique number assigned to each character in the Unicode standard.
    Example:
    ```python
    print(chr(65))   # Output: 'A'
    print(chr(8364)) # Output: '€'
    ```

-   **(169) Is this based on ASCII table or Unicode or are they the same?**
    `chr()` is based on **Unicode**. ASCII is a subset of Unicode, meaning the first 128 Unicode code points (0-127) correspond to ASCII characters. `chr()` can handle a much wider range of integer values beyond ASCII, covering all of Unicode.

-   **(170) What is the difference between method and class method?**
    -   **Instance Method**: Takes `self` (the instance) as its first parameter. Can access/modify instance and class data. Called on an instance (`instance.method()`).
    -   **Class Method**: Takes `cls` (the class) as its first parameter. Decorated with `@classmethod`. Can access/modify class data, but not instance data directly. Can be called on the class (`Class.method()`) or an instance (`instance.method()`).

-   **(171) What does `@classmethod do`. Is this necessary to call the method?**
    -   `@classmethod` is a decorator that transforms a regular method into a class method, ensuring `cls` (the class itself) is passed as the first argument.
    -   It is **necessary** if you want the method to behave as a class method. Without it, `my_method` would be an instance method, and `MyClass.my_method()` would raise a `TypeError`.

-   **(171) Why are we able to call a method from a different class**
    You are not calling a method from a *different* class. You are calling `my_method` directly on `MyClass` itself, not on an instance of `MyClass`. This is precisely what class methods are designed for: they can be invoked directly on the class without needing to create an object first.

-   **(171) Does it matter what class the print statement is currently in?**
    No, it does not matter. The `print(MyClass.my_method())` statement is outside the class definition, at the top level of the script. `MyClass` is accessible globally, so its class methods can be called from anywhere `MyClass` is visible.

-   **(172) What is the code or AST object?**
    -   **Code object**: An internal representation of executable Python bytecode. It's what the Python interpreter actually runs.
    -   **AST (Abstract Syntax Tree) object**: A tree representation of the abstract syntactic structure of source code. `compile()` can take an AST object, allowing programmatic manipulation of code structure before compilation.

-   **(173) what does the exec() function do? Why would you want to run code this way? Is this similar to rust?**
    -   **`exec()` function**: Executes dynamically created Python code (string or code object). It runs statements and returns `None`.
    -   **Why run code this way?**: For dynamic execution (user input, config files), plugins, interactive shells, or code generation.
    -   **Similar to Rust?**: Not directly. `exec()` runs Python code *within the current Python interpreter process*, unlike Rust which is compiled and typically runs external processes for dynamic execution.

-   **(173) What is the point of the `compile()` function?**
    `compile()` is useful to:
    1.  **Pre-compile code**: For efficiency if code is executed multiple times.
    2.  **Control execution context**: Specify `filename` and `mode` for error reporting.
    3.  **Working with ASTs**: Allows programmatic manipulation of code structure.

-   **(176) Can I see an example of this?**
    ```python
    class Car:
        def __init__(self, make):
            self.make = make
    my_car = Car("Toyota")
    print(hasattr(my_car, 'make')) # Output: True
    delattr(my_car, 'make')        # Delete the 'make' attribute
    print(hasattr(my_car, 'make')) # Output: False
    # print(my_car.make) # This would now raise an AttributeError
    ```

-   **(177) What happens when the attribute is deleted?**
    When an attribute is deleted using `delattr()`, it is removed from the object's `__dict__`. Trying to access it again will raise an `AttributeError`.

-   **(177) Why are you able to make an object from a class. Can you make an object from a method?**
    -   **Object from a class**: A class is a blueprint for creating objects (instances). `obj = MyClass()` creates a new instance.
    -   **Object from a method**: No, you cannot directly "make an object from a method." A method is a function associated with a class/object; you can call it, but it's not a blueprint for new entities.

-   **(177) What does `hasattr()` do?**
    `hasattr(object, name)` returns `True` if the `object` has an attribute with the given `name` (as a string), and `False` otherwise. It's a safe way to check for an attribute's existence.

-   **(180) What is the difference between attributes and methods of an object**
    -   **Attributes**: Variables associated with an object, storing its data or state (e.g., `dog.name`).
    -   **Methods**: Functions associated with an object, defining its behaviors or actions (e.g., `dog.bark()`).

-   **(180) what can be an object in python**
    Virtually everything in Python is an object: numbers, strings, lists, functions, classes, modules, etc.

-   **(180) Give an example of an object having both attributes and methods. Can classes only have methods?**
    ```python
    class Circle:
        def __init__(self, radius):
            self.radius = radius # 'radius' is an attribute
        def area(self):
            return 3.14159 * self.radius ** 2 # 'area' is a method
    my_circle = Circle(5)
    print(my_circle.radius)
    print(my_circle.area())
    ```
    No, classes can also have **class attributes** (or class variables), which are shared by all instances of the class.

-   **(181) What would be the output?**
    `dir([])` would return a list of all valid attributes and methods for a list object, including common methods like `append`, `extend`, `insert`, `remove`, `pop`, `sort`, `reverse`, `count`, `index`, `clear`, `copy`, and special methods (e.g., `__len__`, `__iter__`).

-   **(182) I would like to see an example**
    The `divmod(a, b)` function returns a tuple containing the quotient and remainder of integer division, equivalent to `(a // b, a % b)`.
    Example:
    ```python
    print(divmod(10, 3)) # Output: (3, 1)
    print(divmod(15, 4)) # Output: (3, 3)
    ```

-   **(186) Why would it not be "executes" the expression? Isn't it the same thing?**
    -   **`eval()` (evaluates)**: Parses and evaluates a Python *expression* (something that produces a value, like `2 + 2`). It returns the result.
    -   **`exec()` (executes)**: Parses and executes Python *statements* (units of code that perform an action, like `print('hello')`). It returns `None`.
    The distinction is between evaluating a value and executing an action.

-   **(187) Is the eval interpreting a string?**
    Yes, `eval()` interprets a string as a Python expression. It parses, compiles, and executes the expression within the string, returning its result.

-   **(188) I need example**
    ```python
    code_string = """
    x = 10
    print(f"The value of x is {x}")
    """
    exec(code_string)
    # Output: The value of x is 10
    ```

-   **(189) What is the difference of doing `exec` and `print` in this case?**
    -   `exec('print(42)')`: `exec()` *executes* the string `'print(42)'` as Python code. The `print()` function *within that executed code* then outputs `42`. `exec()` itself returns `None`.
    -   `print(42)`: Directly calls the `print()` function with the integer `42`, which then outputs `42`.
    `exec()` is a mechanism to run arbitrary code from a string; `print()` is a specific function for output.

-   **(190) How is this different from enumerate or map**
    -   **`filter()`**: Selects elements from an iterable based on a condition (filters out elements).
    -   **`map()`**: Applies a function to *each* element of an iterable, transforming them.
    -   **`enumerate()`**: Adds a counter to an iterable, returning `(index, value)` pairs.
    They all work with iterables but serve different purposes: selection, transformation, and indexing.

-   **(190) Example please**
    ```python
    numbers = [-2, 0, 1, 3]
    positive = list(filter(lambda x: x > 0, numbers)) # Selection
    squared = list(map(lambda x: x**2, numbers))      # Transformation
    indexed = list(enumerate(numbers))                # Indexing
    print(f"Positive: {positive}") # Output: [1, 3]
    print(f"Squared: {squared}")   # Output: [4, 0, 1, 9]
    print(f"Indexed: {indexed}")   # Output: [(0, -2), (1, 0), (2, 1), (3, 3)]
    ```

-   **(191) does filter always need to take a lambda? Could you just do x > 0 to indicate the condition?**
    No, `filter()` does not always need a `lambda`. It needs a *function* that returns a boolean. You cannot just use `x > 0` directly because that's an expression, not a function. You could define a regular function instead of a `lambda`:
    ```python
    def is_positive(number):
        return number > 0
    numbers = [-1, 0, 1, 2]
    positive_numbers = list(filter(is_positive, numbers))
    print(positive_numbers) # Output: [1, 2]
    ```

-   **(192) why do we have an integer number but not an integer point number?**
    The term "integer point number" isn't standard. An **integer** is a whole number. A **floating-point number** is a number that can have a fractional part, with the "point" floating to represent different magnitudes. Integers, by definition, don't have a fractional part or a "point."

-   **(193) is it casting it from a string?**
    Yes, `float('3.14')` is explicitly converting (or "casting") the string `'3.14'` into a floating-point number `3.14`.

-   **(194) What type of value can it specify?**
    The `format()` built-in function formats a value into a string representation. It can specify formatting for numbers (decimal places, thousands separators, signs, bases, percentages) and strings (width, alignment, truncation).

-   **(195) is the output a string?**
    Yes, the output of `format(1234, ',')` is a string: `'1,234'`.

-   **(196) what is a frozenset object?**
    A `frozenset` object is an **immutable** version of a `set`. Like sets, they are unordered collections of unique elements, but once created, their elements cannot be changed. Because they are immutable, they are hashable and can be used as keys in dictionaries or elements in other sets.

-   **(197) What's the difference between a set and a frozenset?**
    The primary difference is **mutability**:
    -   **`set`**: Mutable. Elements can be added, removed, or updated.
    -   **`frozenset`**: Immutable. Elements cannot be changed after creation.
    This makes `frozenset` hashable, unlike `set`.

-   **(198) Does it just work for objects?**
    Yes, `getattr()` works for any Python object that has attributes.

-   **(198) Can you do this for classes to?**
    Yes, you can use `getattr()` on classes to retrieve class attributes or class methods.

-   **(199) Example needed**
    ```python
    class Person:
        def __init__(self, name):
            self.name = name
    person1 = Person("Alice")
    print(getattr(person1, 'name'))          # Output: Alice
    print(getattr(person1, 'age', 'Unknown')) # Output: Unknown (default value if 'age' doesn't exist)
    ```

-   **(200) I would like an example**
    **(200) what is a global symbol table?**
    The **global symbol table** is a dictionary storing all global variables, functions, and classes defined at the top level of a module. `globals()` returns this dictionary.
    Example:
    ```python
    global_var = 10
    def my_func(): pass
    global_scope = globals()
    print(f"Value of global_var: {global_scope['global_var']}") # Output: 10
    print(f"'my_func' in globals(): {'my_func' in global_scope}") # Output: True
    ```

-   **(201) How can it modify global variables**
    Since `globals()` returns the actual global symbol table dictionary, you can modify global variables by changing entries in this dictionary.
    Example:
    ```python
    my_global_variable = "old"
    globals()['my_global_variable'] = "new"
    print(my_global_variable) # Output: new
    ```

-   **(203) Can you use this for a class if it has a name?**
    Yes, you can use `hasattr()` on a class to check for class attributes or methods.
    Example:
    ```python
    class MyClass:
        class_attr = 10
    print(hasattr(MyClass, 'class_attr')) # True
    ```

-   **(203) What is the difference between a class being an object and then creating an object of a class (if that's a thing)**
    1.  **A class is an object**: In Python, classes themselves are objects of type `type`. When you define a class, you create a class object.
    2.  **Creating an object *of* a class (an instance)**: When you call a class (e.g., `my_instance = MyClass()`), you create a new *instance* of that class. This instance is a separate object whose type is the class it was created from.

-   **(204) Do all objects have hash values?**
    No, only **hashable** objects can be hashed. An object is hashable if its hash value never changes during its lifetime (i.e., it's immutable) and it can be compared to other objects. Mutable types like lists and dictionaries are not hashable.

-   **(205) Can these types only be hashed because they're immutable?**
    Yes, that's precisely the reason. Immutability ensures that an object's hash value remains constant throughout its lifetime, which is essential for hash-based data structures like dictionaries and sets.

-   **(205) Are these types considered objects or just types?**
    They are both. `int`, `float`, `str`, etc., are **types**. Any specific value (e.g., `5`, `"hello"`) is an **object** of that type. In Python, types themselves are also objects (of type `type`).

-   **(206) Does it provide the documentation of a built-in object or an object you have created yourself from a class you made**
    `help()` provides documentation for **any** Python object, whether built-in, from a standard library, or custom (functions, classes, modules, instances). It displays docstrings if present.

-   **(207) Does python know `str` or `string`**
    Python knows `str` as the built-in type for strings. `string` is the name of a standard library module that provides string constants and functions, not the type itself.

-   **(207) Do you need to import `string` to make it work?**
    No, you do not need to import the `string` module to use `help(str)`. `str` is a built-in type.

-   **(207) is `str` a type or object?**
    `str` is a **type**. Individual strings like `"hello"` are **objects** of type `str`. The `str` type itself is also an object (of type `type`).

-   **(208) Why can't `hex` work on strings or floats?**
    `hex()` is specifically for converting **integers** to their hexadecimal string representation. Strings are character sequences, and floats have a different internal representation, so `hex()` is not designed for them.

-   **(208) What does a hexadecimal string look like?**
    A hexadecimal string is a base-16 representation using 0-9 and A-F, prefixed with `0x` in Python.
    Example: `hex(255)` outputs `'0xff'`.

-   **(209) What does the output look like?**
    `hex(255)` will output `'0xff'`.

-   **(210) What is the unique identifier**
    The unique identifier returned by `id()` is an integer that represents the object's identity, guaranteed to be unique and constant during its lifetime. In CPython, this is typically the memory address.

-   **(210) How is this different from the hash value?**
    -   **`id()` (Identity)**: Unique for each distinct object, typically memory address. Used to check if two variables refer to the *exact same object*.
    -   **`hash()` (Hash Value)**: An integer value for hashable objects. Equal objects (`==`) must have the same hash value. Different objects *can* have the same hash value (collision). Used for efficient lookup in dictionaries/sets.

-   **(211) What does unique identifier look like?**
    The unique identifier is a large integer (e.g., `140737351939176`). Its exact value is implementation-dependent and not meant to be interpreted directly.

-   **(211) What is meant by lifetime? Will the unique identifier change across runs or function calls?**
    -   **Lifetime**: From object creation until garbage collection. `id()` is constant during this period.
    -   **Across runs**: Yes, `id()` will almost certainly change across different runs of the program.
    -   **Across function calls**: If a *new* object is created in a function, it gets a new `id()`. If the *same* object is passed, its `id()` remains constant.

-   **(211) Since python uses an interpreter, do you still call it a compilation when running it?**
    Yes. Python code is first **compiled** into platform-independent **bytecode** (`.pyc` files), and then this bytecode is **interpreted** and executed by the Python Virtual Machine (PVM). So, it's a "compiled-interpreted" language.

-   **(212) What does the output look like?**
    `'{:.2f}'.format(3.14159)` will output the string `'3.14'`.

-   **(213) Is it possible to ask and save variable in one line?**
    Yes, the `input()` function returns the user's input as a string, so you can directly assign its return value to a variable:
    ```python
    user_name = input('Enter your name: ')
    ```

-   **(216) What is meant by tuple of classes?**
    **(216) Example?**
    When using `isinstance()`, you can pass a tuple of classes as the second argument to check if an object is an instance of *any* of those classes (or their subclasses).
    Example:
    ```python
    class Dog: pass
    class Cat: pass
    my_pet = Dog()
    print(isinstance(my_pet, (Dog, Cat))) # True
    ```

-   **(217) Is `int` a built in term in python?**
    Yes, `int` is a built-in type in Python.

-   **(217) Would data type of `int` be `int`?**
    The data type of an integer object (e.g., `5`) is `int`. The type of the `int` *class itself* is `type`.

-   **(217) Output?**
    `isinstance(x, int)` will return `True` if `x` is an integer (or a subclass instance of `int`), and `False` otherwise.

-   **(218) What does this look like?**
    **(218) Are classes just functions?**
    -   `issubclass()` example:
        ```python
        class Parent: pass
        class Child(Parent): pass
        print(issubclass(Child, Parent)) # True
        ```
    -   **Are classes just functions?** No. Functions execute code; classes are blueprints for creating objects (instances) and define their attributes and methods. Both are callable objects, but their purpose differs.

-   **(219) Are `B` and `A` classes or functions?**
    For `issubclass(B, A)` to work, `B` and `A` must both be **classes**.

-   **(220) What is an iterator object?**
    An iterator is an object that represents a stream of data. It implements `__iter__()` (returns itself) and `__next__()` (returns the next item or raises `StopIteration`). Iterators are lazy and memory-efficient.

-   **(220) How do I check if an object is iterable?**
    An object is iterable if it can be looped over. You can check using `isinstance()` with `collections.abc.Iterable`.
    ```python
    from collections import abc
    print(isinstance([1,2,3], abc.Iterable)) # True
    ```

-   **(220) How would I return next item from iterator?**
    You use the `next()` built-in function: `next(my_iterator)`.

-   **(220) Is this related to generators at all?**
    Yes, absolutely. **Generators are a simple and elegant way to create iterators.** A function with `yield` returns a generator object, which is itself an iterator.

-   **(221) What does this look like?**
    `iter(lst)` returns an iterator object, which is a special object that keeps track of the iteration state.
    Example:
    ```python
    my_list = ['a', 'b']
    list_iterator = iter(my_list)
    print(list_iterator) # Output: <list_iterator object at 0x...>
    print(next(list_iterator)) # Output: 'a'
    ```

-   **(226) What does this look like? I would like to see an example**
    **(227) How? I would like to see an example of this.**
    The **local symbol table** is a dictionary storing local variables and parameters within a function's scope. `locals()` returns this dictionary.
    Example:
    ```python
    def my_function(param):
        local_var = 10
        local_scope = locals()
        print(f"Initial locals(): {local_scope}") # Shows param and local_var
        local_scope['local_var'] = 20 # Modifies local_var via dictionary
        print(f"Modified local_var: {local_var}") # Output: Modified local_var: 20
    my_function(1)
    ```
    While `locals()` can modify variables, it's generally safer to modify them directly by assignment.

-   **(232) What does this look like?**
    `memoryview()` returns a memoryview object, which provides a "view" into the memory of another object without copying it.
    Example:
    ```python
    data = b'abcdefg'
    mv = memoryview(data)
    print(mv)      # Output: <memory view of bytes object at 0x...>
    print(mv[0])   # Output: 97 (ASCII of 'a')
    ```

-   **(233) What is the buffer protocol?**
    The **buffer protocol** is a mechanism allowing objects to expose their internal data buffers directly to other objects without copying, crucial for efficient handling of large binary data (e.g., `bytes`, `bytearray`).

-   **(233) What is meant by internal data?**
    "Internal data" refers to the raw, underlying sequence of bytes that an object stores. `memoryview` allows direct access to these bytes.

-   **(233) I would like an example of this**
    ```python
    data_bytearray = bytearray(b'Hello')
    mv = memoryview(data_bytearray)
    mv[0] = ord('J') # Modify the underlying bytearray through the memoryview
    print(data_bytearray) # Output: bytearray(b'Jello')
    ```

-   **(236) Isn't it iterable? What is the difference between iterator and iterable?**
    -   An **iterable** is an object that *can be iterated over* (e.g., in a `for` loop). It has an `__iter__()` method that returns an iterator. (e.g., lists, tuples).
    -   An **iterator** is an object that *produces the next item* in a sequence. It has both `__iter__()` (returns `self`) and `__next__()` methods. (e.g., objects returned by `iter()`, generators).
    An iterator is also an iterable.

-   **(237) How can you get the next item if the iterator is exhausted?**
    You cannot get a "next item" if the iterator is exhausted. The `next(it, None)` syntax provides a **default value** (`None` in this case) to be returned *instead of raising a `StopIteration` exception* when the iterator is exhausted. It doesn't produce a new item.

-   **(238) What does this mean?**
    `object()` returns a new "featureless" object, meaning it has no custom attributes or methods beyond the very basic ones inherited from the base `object` type. It's the most fundamental, empty object in Python.

-   **(239) How is it the base for all classes?**
    `object` is the ultimate base class for all other classes in Python. Every class you define implicitly or explicitly inherits from `object`, meaning all objects share a common set of fundamental behaviors.

-   **(240) What does an octal string look like?**
    An octal string is a base-8 representation using digits 0-7, prefixed with `0o` in Python.
    Example: `oct(8)` outputs `'0o10'`.

-   **(240) What makes it useful?**
    Octal representation was historically used in computing, particularly for Unix-like file permissions (e.g., `chmod 755`).

-   **(241) How do you use the `oct()` function to convert the integer 8 to an octal string?**
    `oct(8)` will output `'0o10'`.

-   **(244) What does the Python built-in function `ord()` do?**
    The `ord()` function returns an integer representing the Unicode code point of a single character.

-   **(245) Which of the following will return the ASCII value of the character `A` using `ord()`?**
    `ord('A')` will return `65`.

-   **(250) What does this look like?**
    **(251) So if I create a class andI want it to contain properties, I use this? I would like to see an example**
    The `property()` function creates "managed attributes" (properties) in a class, allowing you to define methods for getting, setting, and deleting an attribute with custom logic.
    Example:
    ```python
    class Celsius:
        def __init__(self, temp=0): self._temp = temp
        def get_temp(self): return self._temp
        def set_temp(self, value):
            if value < -273.15: raise ValueError("Too cold!")
            self._temp = value
        temperature = property(get_temp, set_temp) # Creates the property
    c = Celsius(25)
    print(c.temperature) # Calls get_temp
    c.temperature = 30   # Calls set_temp
    ```
    The `@property` decorator is a more common and Pythonic way to achieve this.

-   **(253) Isn't `range(0,5)` also valid?**
    Yes, `range(0, 5)` is also valid. `range(5)` is a shorthand for `range(0, 5)`, where the start value defaults to `0`. Both generate numbers from 0 up to (but not including) 5.

-   **(254) I would like an example for this**
    **(254) What other debugging features does python have?**
    -   **`repr()` example**: `repr()` returns a "developer-friendly" string representation, aiming for `eval(repr(obj))` to recreate the object.
        ```python
        my_list = [1, 2, 'hello']
        print(repr(my_list)) # Output: [1, 2, 'hello']
        ```
    -   **Other debugging features**: `print()` statements, Python Debugger (`pdb`), logging module, assertions (`assert`), IDE debuggers, `traceback` module.

-   **(255) What is returned here?**
    `repr([1, 2, 3])` will return the string `'[1, 2, 3]'`.

-   **(256) What data structures in python are considered iterators?**
    Data structures like lists, tuples, dictionaries, and sets are **iterables**, not iterators. Objects that are directly iterators include: generator objects, file objects, and the results of functions like `map()`, `filter()`, `zip()`, `reversed()`, `enumerate()`.

-   **(258) How would this be done?**
    `round(number, ndigits)` rounds a number to a specified number of decimal places.
    Example:
    ```python
    print(round(3.14159, 2)) # Output: 3.14
    print(round(3.14559, 2)) # Output: 3.15
    ```

-   **(261) Why won't the following work? `set((1, 2, 3))`**
    This *will* work. `set((1, 2, 3))` is a valid way to create a set from a tuple, as `set()` accepts any iterable.

-   **(261) Why won't the following work? `set(1, 2, 3)`**
    This will **not** work. The `set()` constructor expects at most one argument (an iterable). Passing `1, 2, 3` as separate arguments results in a `TypeError: set expected at most 1 argument, got 3`.

-   **(262) What does an example look like?**
    **(263) I would like to see an example of this**
    `setattr(object, name, value)` sets the value of the named attribute of an object. It's the programmatic equivalent of `object.name = value`.
    Example:
    ```python
    class Person:
        def __init__(self, name):
            self.name = name
    my_person = Person("Alice")
    setattr(my_person, 'name', 'Bob') # Set existing attribute
    setattr(my_person, 'age', 30)     # Add new attribute
    print(my_person.name) # Output: Bob
    print(my_person.age)  # Output: 30
    ```
## More Questions
- (264) What does the Python built-in function `slice()` do?
	- Returns a slice object
		- #question I would like an example
- (265) Which of the following will correctly create a slice object that represents the indices 1 to 3 using `slice()`?
	- `slice(1,4)`
		- #question I would like an example of this
- (266) What does the Python built-in function `sorted()` do?
	- Returns a sorted list
		- #question Does it not sort the list in-place?
- (267) Which of the following will correctly return a sorted list of the elements $[3, 2, 1]$ using `sorte()`?
	- `sorted([3, 1, 2])`
- (268) What does the python built-in function `staticmethod()` do?
	- Creates a static method in a class
		- #question What does this mean?
- (269) Which of the following correctly defines a static method in a class using `staticmethod()`?
	- `staticmethod(func)`
		- #question Why is `staticmethod(method)`, `staticmethod(function)` or `staticmethod(method_name)` not an answer?
		- #question I would like to see an example of this
- (270) What does the Python built-in function `str()` do?
	- Converts an object to a string
- (271) Which of the following will correctly convert the integer `123` to a string using `str()`?
	- `str(123)`
- (272) What does the python built-in function `sum()` do?
	- Returns the sum of an [[iterable]]
- (273) Which of the following will correctly return the sum of the elements $[1, 2, 3]$ using `sum()`?
	- `sum([1, 2, 3])`
- (274) What does the python built-in function `super()` do?
	- Returns a proxy object that delegates method calls to a parent or sibling class
		- #question What does an example look like?
		- #question What is a proxy object?
		- #question What happens if there is no parent or sibling class?
			- #question How does it know to choose a parent or sibling class. Is this involved with inheritance?
- (275) Which of the following correctly uses `super()` to call a method from a parent class?
	- `super().method_name()`
		- #question What does an example look like?
- (276) What does the python built-in function `tuple()` do?
	- Creates a [[tuple]]
- (277) Which of the following will correctly create a tuple containing the elements 1, 2, and 3 using `tuple()`?
	- `tuple([1, 2, 3])`
		- #question Why won't `tuple(1, 2, 3)` work? Can't you just create a tuple by saying `x = (1, 2, 3)`?
- (278) What does the python built-in function `type()` do?
	- Returns the type of an object
- (279) Which of the following will correctly return the type of an integer 123 using `type()`?
	- `type(123)`
- (280) What does the python built-in function `vars()` do?
	- Returns the `_dict_` attribute of an object
		- #question What is the `__dict__` attribute of an object?
		- #question What does it look like?
- (281) Which of the following will correctly return the `__dict__` attribute of an object 'obj' using vars()?
	- `vars(obj)`
		- #question What is useful about this? 
- (282) What does the Python built-in function `zip()` do?
	- Aggregates elements from multiple iterables
		- #question What does this look like?
- (283) Which of the following will correctly aggregate elements from the lists `[1, 2, 3]` and `['a', 'b', 'c']` using `zip()`?
	- `zip([1, 2, 3], ['a', 'b', 'c'])`
		- #question What does the output look like? Can you still access the lists or elements?
- (284) What does the `__import__()` function do in Python?
	- It imports a module using its string name
		- #question What does this look like in action?
- (285) How do you use `__import__()` to import the math module?
	- `__import__('math')`
		- #question Why is `'math'` written as text inside `__import__()`
		- #question Where can you write this in your code?
- (286) Which of the following is true about `__import__()`?
	- It imports a module and returns the module object
		- #question What does an example look like?
- (287) What parameter can you pass to `__import__()` to specify a different level of import?
	- `level`
		- #question What does this mean and what does it look like?
- (288) What is the syntax o create an empty list in Python?
	- `list = []`
- (289) How do you add an element to the end of a list in Python?
	- `list.append(element)`
- (290) Which method would you use to remove the first occurrence of a specified value from a list?
	- `list.remove(value)`
- (291) What will be the output of the following code? `print([1, 2, 3] + [4, 5])`
	- `[1, 2, 3, 4, 5]`
- (292) How do you access the second element of a list named `my_list`
	- `my_list[1]`
- (293) What will be the output of `len([1, 2, 3, 4])`?
	- 4
- (294) How do you sort a list named `my_list` in ascending order?
	- `my_list.sort()`
- (295) Which method would you use to reverse the order of a list?
	- `list.reverse()`
- (296) What will be the output of the following code? `print([1, 2, 3]*2)`
	- `[1, 2, 3, 1, 2, 3]`
- (297) What is the result of `my_list[1:4]` if `my_list = [0, 1, 2, 3, 4, 5]`?
	- `[1, 2, 3]`
- (298) How do you check if an element exists in a list?
	- element in list
- (299) What does the `list.index(value)` method return?
	- The first index of the value
- (300) How do you create a list from a string `s = 'hello`?
	- `list(s)`
- (301) What is the output of `print(['a', 'b', 'c'][1])`?
	- `b`
- (302) What will `my_list.pop(0)` do if `my_list = [10, 20, 30]`?
	- Return 10 and remove it from the list
- (303) Which method can be used to insert an element at a specific index in a list?
	- `list.insert(index, element)`
- (304) What will the output of `print([[1,2], [3,4]][0][1])` be?
	- `2`
- (305) What does the `list.celar()` method do?
	- Removes all elements from the list
- (306) Which of the following will create a list containing the numbers from 0 to 9?
	- list(range(10))
- (307) What will be the output of `print(list(map(str,[1,2,3])))`?
	- `['1', '2','3']`
		- #question What does `map` do here?
- (308) What will `my_list = [1, 2, 3] * 3` result in?
	- `[1, 2, 3, 1, 2, 3, 1, 2, 3]`
- (309) How can you concatenate two lists `a` and `b`?
	- `a+b`
		- #question Is there such a thing as `a.concat(b)`?
- (310) Which of the following is a valid list comprehension syntax? 
	- `[x for x in range(10)]`
- (311) What will be the result of `list(range(1,10,2))`?
	- `[1, 3, 5, 7, 9]`
- (312) How do you copy a list named `my_list` to another list named `new_list`?
	- `new_list = my_list.copy()`
- (313) What does the `list.insert(index, element)` method do?
	- Inserts element at the specified index
- (314) How do you get the last element of a list named `my_list`?
	- `my_list[-1]`
- (315) What will be the output of `print([x for x in range(5) if x > 2])`?
	- `[3, 4]`
- (316) Which of the following methods does not modify the original list?
	- `sorted(list)`
- (317) What is the output of `print([i*2 for i in range(3)])`?
	- `[0, 2, 4]`
		- #comment Basically saying given range from 0 to 2 inclusive, return each value multiplied by 2 in the sequence 
- (318) How do you remove and return the last element from a list?
	- `list.pop()`
- (319) What will be the result of `sum([1, 2, 3])`?
	- `6`
- (320) How do you check the length of a list named `my_list`
	- `len(my_list)`
- (321) What will `my_list[1:4:2]` return if `my_list = [0, 1, 2, 3, 4, 5]`?
	- `[1, 3]`
- (322) What does `list.reverse()` return?
	- `None`
		- #question What does `list.reverse()` do?
- (323) Which of the following will create a list of integers from 0 to 4?
	- `list(range(5))`
- (324) What will be the result of `my_list = [i for i in 'abc']`?
	- `['a', 'b', 'c']`
- (325) What will be the output of `print(['a', 'b', 'c'][0:2])`?
	- `['a','b']`
- (326) How do you remove the element at index 3 in a list?
	- `list.pop(3)`
- (327) What does `my_list.count(value)` return?
	- The count of value in my_list
		- #question So if `value =5`, would it return the number of times that 5 appears in my list?
- (328) What will `my_list = [i for i in range(5) if i % 2 = 0]` result in?
	- `[0, 2, 4]`
- (329) What will be the result of `my_list = ['Python']*3`?
	- `['Python', 'Python', 'Python']`
- (330) What is a tuple in Python?
	- An immutable sequence of elements
		- #question is it ordered or unordered?
- (331) How do you create an empty tuple in Python?
	- `empty_tuple = ()`
		- #question Why would you use a tuple?
- (332) How do you create a tuple with one element?
	- `one_element_tuple = (1,)`
- (333) Which of the following methods can be used to count the occurrences of an element in a tuple?
	- `count()`
		- #question What would the syntax look like?
- (334) How do you access the second element of a tuple named `my_tuple`?
	- `my_tuple[1]`
- (335) Can you change the value of an element in a tuple after it has been created?
	- `No`
- (336) How do you concatenate two tuples, tuple1 and tuple2?
	- `tuple1 + tuple2`
		- #question Doesn't `tuple1.extend(tuple2)` work? Probably not because it's immutable unlike a list so the `extend` doesn't exist.
		- #question Is `extend` for lists a method or attribute?
- (337) What will be the output of the following code: `tuple1 = (1, 2, 3); print(len(tuple1))`
	- `3`
- (338) How do you convert a list named `my_list` to a tuple?
	- `tuple(my_list)`
- (339) What will be the output of the following code: `tuple1 = (1, 2, 3); print(tuple1[1:3])`?
	- `(2, 3)`
- (340) Which of the following operations is not allowed on a tuple? 
	- Item assignment
		- #question I thought concatenation is not allowed either?
- (341) How do you check if an element exists in a tuple?
	- element in tuple
- (342) What will be the output of the following code: `tuple1 = (1, 2, 3); print(tuple1*2)`
	- `(1, 2, 3, 1, 2, 3)`
- (343) How do you find the index of an element in a tuple?
	- `tuple.index(element)`
- (344) What will be the output of the following code: `tuple1 = (1, 2, 3); print(4 in tuple1)`?
	- `False`
- (345) how do you unpack a tuple into individual variables?
	- `a, b, c` = tuple1
		- #question What does this look like?
		- #question does this also work for lists?
		- Why doesn't the below work for this too?
			- `a = tuple1[0]; b = tuple1[1]; c = tuple1[2]`
- (346) What will be the output of the following code: `tuple1 = (1, 2, 3); tuple2 = (4, 5, 6); print(tuple1 + tuple2)`?
	- `(1, 2, 3, 4, 5, 6)`
- (347) How do you create a tuple from a string `hello`?
	- `tuple('hello')`
- (348) What will be the output of the following code: `tuple1 = (1, 2, 3); print(max(tuple1))?`
	- `3`
- (349) What will be the output of the following code: `tuple1 = (1, 2, 3); print(min(tuple1))?`
	- `1`
- (350) How do you convert a tuple to a list?
	- `list(tuple1)`
- (351) What will be the output of the following code: `tuple1 = (1, 2, 3); print(sum(tuple1))?`
	- `6`
- (352) How do you create a tuple with mixed data types?
	- `mixed_tuple = (1, 'a', 3.14)`
- (353) What will be the output of the following code: `tuple1 = (1, 2, 3); print(tuple1[-1])?`
	- `3`
- (354) How do you create a nested tuple?
	- `nested_tuple = ((1, 2), (3,4))`
- (355) What will be the output of the following code: `tuple1 = (1, 2, 3); print(tuple1.index(2))`
	- `1`
- (356) How do you create a tuple with repeated elements?
	- `repeated_tuple = (1, 2) * 3`
- (357) What will be the output of the following code: `tuple1 = (1, 2, 3); print(tuple1[1:])?`
	- `(2, 3)`
- (358) How do you delete a tuple?
	- `del tuple1`
- (359) What will be the output of the following code: `tuple1 = (1, 2, 3); tuple2 = (4, 5, 6); print(tuple1 + tuple2 *2)?`
	- `(1, 2, 3, 4, 5, 6, 4, 5, 6)`
- (360) How do you unpack a tuple into four variables?
	- `a, b, c, d = (1, 2, 3, 4)`
- (361) Can you create a tuple using comprehension syntax?
	- No, comprehensions are only for lists, sets, and dictionaries
		- #question Why can't you create a tuple using comprehension?
		- #question How would you create a list using comprehension?
- (362) How do you access the second element of the first tuple in the nested tuple `nested_tuple = ((1, 2), (3, 4))`?
	- `nested_tuple[0][1]`
- (363) Which of the following methods is not available for tuples?
	- `append()`
- (364) Why might you choose a tuple over a list in Python?
	- Tuples are more memory efficient
- (365) How do you create an empty set in Python?
	- `set()`
- (366) Which method is used to add an element to a set?
	- `add()`
- (367) What will be the output of the following code?
	- `{1, 2, 3}`
```python
s = {1, 2, 3}
s.add(2)
print(s)
```
- (368) How can you remove all elements from a set?
	- `clear()`
- (369) What will be the output of the following code?
	- `KeyError`
		- #question Why would you get a KeyError?
		- #question Why would this not be a ValueError?
```python
s = {1, 2, 3}
s.remove(4)
```
- (370) How do you find the intersection of two sets `s1` and `s2`?
	- `s1 & s2`
		- #question What does this look like?
- (371) What is the difference between `discard()` and `remove()` methods in sets?
	- `remove()` raises an error if the element is not found, `discard()` does not
- (372) How do you check if a set `s1` is a subset of another set `s2`?
	- `s1 <= s2`
- (373) What does the `pop()` method do in a set? 
	- Removes and returns an arbitrary element
		- #question Why would you do this?
- (374) What is the result of `len({1, 2, 2, 3})`?
	- `3`
- (375) Which method is used to find the difference between two sets?
	- `difference()`
		- #question Could you subtract two sets with `-` as well to find difference?
- (376) How do you check if two sets `s1` and `s2` have no elements in common?
	- `s1.isdisjoint(s2)`
- (377) What will be the output of the following code
	- `{1, 2, 3, 4, 5}`
```python
s1 = {1, 2, 3}
s2 = {3, 4, 5} 
s3 = s1 | s2
print(s3)
```
- #comment `s1 | s2` finds the union of two sets (which is different from intersection)
- (378) Which of the following methods can be used to iterate over the elements of a set?
	- Both for and while loop
- (379) What will be the output of the following code?
	- `{1, 2, 3, 4, 5}`
		- #question Is `s.update()` similar to `extend()` for lists?
```python
s = {1, 2, 3}
s.update([4,5])
print(s)
```
- (380) How do you create a set using a set comprehension
	- `set = {x for x in range(5)}`
- (381) Which of the following operations has the best average time complexity in Python sets?
	- Element lookup
		- Faster than, union, intersection, and difference
			- #question How to find difference in sets
- (382) What does the `issuperset()` method do?
	- Checks if a set contains all elements of another set.
		- #question What is a super set?
		- #question Can a set with all of the elements of another set plus more be a super set for that other set?
- (383) How do you check if an element exists in a set?
	- `in`
- (384) What will be the output of the following code?
	- `{1, 2, 3}`
		- #question Is this because `discard()` does not throw a KeyError? 
		- #question Would `remove()` through a KeyError?
```python
s = {1, 2, 3}
s.discard(4)
print(s)
```
- (385) Which of the following operations is not supported by sets?
	- `indexing`
- (386) What is the result of the symmetric difference between two sets `s1` ad `s2`?
	- Elements that are in either set but not both
		- #question What is symmetric difference?
- (387) How do you create a set with elements 1, 2, and 3?
	- `s = {1, 2, 3}`
- (388) What is the correct way to perform set union?
	- `s1 | s2`
		- #question Does this return something? Could you give an example?
- (389) What is the output of the following code?
	- `3`
		- #question So the below code transforms the set to `{'a', 'b', 'c'}`. However, I would I just get a set like this: s = {'abc'}?
```python
s = set('abc')
print(len(s))
```
- (390) Which of the following is not a method of a set?
	- `append()`
		- Valid Methods: `add()` , `update()`, `discard()`
			- #question What is the difference between `add()` and `update()`
			- #question What are all the different methods for a set? (or is it referred to as attribute?)
- (391) How do you convert a list to a set?
	- `set(list)`
- (392) What is the result of the following operation?
	- `{1, 2, 3}`
```python
s = {1, 2, 3}
s.add(3)
print(s)
```
- (393) How can you get the length of a set `s`?
	- `len(s)`
- (394) What will be the output of the following code?
	- `4`
```python
s1 = {1, 2}
s2 = {3, 4}
s3 = s1 | s2
print(len(s3))
```
- (395) What does the `issubset()` method do?
	- Checks if a set is a subset of another set
		- #question I would like to see an example of this 
- (396) How do you remove a random element from a set?
	- `pop()`
		- #question Why would this be needed?
		- #question Do the methods `discard()` and `remove()` work for sets?
- (397) What will be the output of the following code?
	- `set()`
```python
s = {1, 2, 3}
s.clear()
print(s)
```
- (398) How do you create a frozen set in Python?
	- `frozenset()`
		- #question What is a frozenset?
- (399) What is the result of the following code?
	- `error`
		- #question So the `frozenset` method makes it immutable?
```python
s = {1, 2, 3}
f = frozenset(3)
f.add(4)
```
- (400) How do you create an empty dictionary in Python?
	- `dict = {}`
- (401) How do you add a key-value pair to a dictionary?
	- `dict['key'] = 'value'`
- (402) How do you access the value associated with a key in a dictionary?
	- `dict['key']`
- (403) How do you remove key-value pair from a dictionary?
	- `del dict['key']`
		- #question Is there a method for a dictionary that lets you remove a key-value pair?
- (404) Which method returns a list of all the keys in a dictionary?
	- `dict.keys()`
		- #question I would like to see an example
- (405) Which method returns a list of all the values in a dictionary?
	- `dict.values()`
		- #question Does `dict.items()` exist? If so, what does it do?
- (406) Which method returns a list of all the key-value pairs in a dictionary?
	- `dict.items()`
- (407) How do you check if a key exists in a dictionary?
	- `key in dict`
- (408) How do you merge two dictionaries in Python 3.9+
	- `dict | dict2`
		- #question How would you pronounce `|` in this case?
		- #question Is `|` a union operation?
		- #question What would you do in an earlier python version?
	- #question What is the current python version?
- (409) What will be the output of the following code: `dict = {'a': 1, 'b': 2}; dict['c'] = 3; print(dict)`?
	- `{'a':1, 'b':2, 'c': 3}`
- (410) What will be the output of the following code:
	- `{'b':2}`
```python
dict = {'a': 1, 'b': 2};
del dict['a'];
print(dict)
```
- (411) How do you get the number of key-value pairs in a dictionary?
	- `len(dict)`
- (412) What will be the output of the following code
	- `3`
		- #question Why does it return 3 when this key-value pair does not exist in the dictionary?
```python
dict = {'a': 1, 'b':2}
print(dict.get('c',3))
```
- (413) How do you create a dictionary with default values?
	- `dict = dict.fromkeys(['a','b'],0)`
		- #question What does `fromkeys` mean?
- (414) What will be the output of the following code
	- `{}`
```python
dict = {'a': 1, 'b':2};
dict.clear();
print(dict)
```
- (415) How do you iterate over all key-value pairs in a dictionary?
	- `for key, value in dict.items():`
		- #question What is it called when you can iterate through two variables within an iterable? Does this only work for dictionaries?
		- #question Can you call the `key` and `value` variables whatever you want in this case?
- (416) What will be the output of the following code:
	- `True`
		- #question What is the time complexity of the `in` method?
		- #question Is `in` a function or method or something else?
```python
dict = {'a': 1, 'b': 2}
print('a' in dict)
```
- (417) How do you create a dictionary comprehension to square the values of a dictionary?
	- `{k: v**2 for k, v in dict.items()}`
		- #question Could you break this down for me?
		- #question How is a dictionary comprehension different?
		- #question What is a comprehension in python?
- (418) What will be the output of the following code
	- `{'a': 1, 'b':2, 'c':3`
		- #question Does `append()` exist in dict?
```python
dict = {'a': 1, 'b': 2};
dict.update({'c':3});
print(dict)
```
- (419) How do you create a dictionary from two lists, one of keys and one of values?
	- `dict = dict(zip(keys,values))`
		- #question  keys and values here each represents a list?
		- #question What does `zip` do?
- (420) What will be the output of the following code
	- `{'a':1, 'b':2, 'c': 3`
		- #question What does `setdefault` do?
```python
dict = {'a': 1, 'b': 2}
dict.setdefault('c',3)
print(dict)
```
- (421) How do you copy a dictionary?
	- `dict.copy()`
		- #question Does `dict.clone()` exist?
- (422) What will be the output of the following code:
	- `{'b': 2}`
```python
dict = {'a': 1, 'b': 2}
dict.pop('a')
print(dict)
```
- (423) How do you get the value of a key if it exists, or a default value if it doesn't?
	- `dict.get('key',default_value)`
		- #question How does the `get` method work?
- (424) What will be the output of the following code
	- `{'a':1}`
		- #question Are dictionaries ordered
		- #question When using pop for a dictionary, will it always delete the last item in the dictionary?
```python
dict = {'a': 1, 'b': 2}
dict.popitem()
print(dict)
```
- (425) How do you create a dictionary with keys from a list and all values set to a default value?
	- `dict = dict.fromkeys(['a','b'],0)`
		- #question What can you do with `fromkeys`?
- (426) What will be the output of the following code:
	- `{'a':3, 'b':2}`
		- #question So does `.update()` just update an existing key-value pair?
		- #question Could you add a `key-value` pair with `update()` or does this return an error?
```python
dict = {'a': 1, 'b': 2}
dict.update({'a': 3})
print(dict)
```
- (427) How do you iterate over all keys in a dictionary?
	- `for key in dict:`
		- #question Does this just return the keys or keys and values?
		- #question Could you show an example?
- (428) What will be the output of the following code:
	- `{'b': 2, 'c': 1}`
		- #question So `pop()` in dictionary removes key-value pair and returns value?
```python
dict = {'a': 1, 'b': 2}
dict['c'] = dict.pop('a')
print(dict)
```
- (429) How do you create a dictionary with a default value for missing keys?
	- `collections.defaultdict(int)`
		- #question Does it need to be `int`?
		- #question Why not `collections.defaultdict()`?
- (430) What function in the `re` module is used to compile a regular expression pattern into a regex object?
	- `re.compile()`
		- #question What does the `compile()` method do?
		- #question What does an example of this look like?
	- #question How does the `re` module work?
	- #question What is a regex object
	- #question What exactly is a regular expression?
- (431) Which method would you use to check if a string starts with a specific pattern?
	- 
- (432) What does the `re.search()` function return if no match is found?
- (433) Which method returns all non-overlapping matches of a pattern in a string as a list?
- (434) What does the `re.sub()` function do?
- (435) Which special character matches any single character except a newline?
- (436) What does the `^` character signify in a regular expression? 
- (437) What does the `$` character signify in a regular expression?
- (438) Which of the following matches zero or more repetitions of the preceding element?
- (439) Which of the following matches one or more repetitions of the preceding element?
- (440) Which of the following matches zero or one repetition of the preceding element?
- (441) What does the character class `[a-z]` match?
- (442) What does the character class `\d` match?
- (443) What does the character class `\s` match?
- (444) What does the character class `\w` match?
- (445) What does the character class `\W` match?
- (446) Which function would you use to split a string by the occurrences of a pattern?
- (447) What does the `re.IGNORECASE` flag do?
- (448) Which of the following is the correct way to use a raw string in a regular expression?
- (449) What does the `re.MULTILINE` flag do?
- (450) Which method would you use to find the first occurrence of a pattern in a string?
- (451) What does the `re.fullmatch()` function do?
- (452) Which of the following matches exactly `n` repetitions of the preceding element?
- (453) Which of the following matches at least `n` repetitions of the preceding element?
- (454) Which of the following matches between `n` and `m` repetitions of the preceding element?
- (455) What does the `re.VERBOSE` flag do?
- (456) Which method would you use to replace all occurrences of a pattern in a string with a replacement string?
- (457) What does the `re.escape()` function do?
- (458) Which of the following matches any character except newline?
- (459) What is the purpose of the `functools.wraps` decorator?
- (460) How do you apply multiple decorators to a single function?
- (461) What will be the output of the following code?
```python
def decorator_a(func):
	def wrapper():
		print('Decorator A')
		func()
	return wrapper

def decorator_b(func)
	def wrapper():
		print('Decorator B')
		func()
	return wrapper

@decorator_a
@decorator_b
def say_hello():
	print('Hello!')

say_hello()
```
- (462) Can decorators accept arguments?
- (463) What is the main advantage of using decorators?
- (464) What will be the output of the following code?
```python
def my_decorator(func):
	def wrapper(*args, **kwargs):
		print('Before function call')
		result = func(*args, **kwargs)
		print('After function call')
		return result
	return wrapper

@my_decorator
def add(a, b):
	return a + b

print(add(2, 3))
```
- (465) Which of the following is a correct way to define a decorator that takes arguments?
- (466) What is the purpose of the `@staticmethod` decorator?
- (467) What is the purpose of the `@classemethod` decorator?
- (468) What will be the output of the following code?
```python
def my_decorator(func):
	def wrapper():
		print('Wrapper executed')
		return func()
	return wrapper

@my_decorator
def return_five():
	return 5

print(return_five())
```
- (469) Can a decorator be used to modify the return value of a function?
- (470) What will be the output of the following code?
```python
def my_decorator(func):
	def wrapper():
		print('Wrapper executed')
		return func() + 1
	return wrapper

@my_decorator
def return_five():
	return 5

print(return_five())
```
- (471) What is the purpose of the `@property` decorator?
- (472) What will be the output of the following code?
```python
class MyClass:
	def init(self, value):
		self._value = value
	
	@property
	def value(self):
		return self._value

obj = MyClass(10)
print(obj.value)
```
- (473) What will be the output of the following code?
```python
class MyClass
	def init(self, value):
		self._value = value
	
	@property
	def value(self):
		return self._value
	
	@value.setter
	def value(self, new_value):
		self._value = new_value

obj = MyClass(10)
obj.value = 20
print(obj.value)
```
- (474) What is the purpose of the `@value.setter` decorator in the previous question?
- (475) What will be the output of the following code?
```python
def my_decorator(func):
	def wrapper(*args, **kwargs):
		print('Wrapper executed')
		return func(*args, **kwargs)
	return wrapper
@my_decorator
def add(a, b)
	return a + b

print(add(2, 3))
```
- (476) What will be the output of the following code?
```python
def my_decorator(func):
	def wrapper(*args, **kwargs):
		print('Wrapper executed')
		return func(*args, **kwargs)
	return wrapper

@my_decorator
def add(a, b):
	return a + b

print(add(2, 3, 4))
```
- (477) What will be the output of the following code?
```python
def my_decorator(func):
	def wrapper(*args, **kwargs):
		print('Wrapper executed')
		return func(*args, **kwargs)
	return wrapper

@my_decorator
def add(a, b, c=0)
	return a + b + c

print(add(2, 3))
```
- (478) What will be the output of the following code?
```python
def my_decorator(func):
	def wrapper(*args, **kwargs):
		print('Wrapper executed')
		return func(*args, **kwargs)
	return wrapper

@my_decorator
def add(a, b, c=0):
	return a + b + c

print(add(2, 3, 4))
```
- (479) What will be the output of the following code?
```python
def my_decorator(func):
	def wrapper(*args, **kwargs):
		print('Wrapper executed`)
		return func(*args, **kwargs)
	return wrapper

@my_decorator
def add(a, b, c=0):
	return a + b + c

print(add(a=2, b=3))
```
- (480) What will be the output of the following code?
```python
def my_decorator(func):
	def wrapper(*args, **kwargs):
		print('Wrapper executed')
		return func(*args, **kwargs)
	return wrapper
	
@my_decorator
def add(a, b, c=0):
	return a + b + c

print(add(a=2, b=3, c=4))
```
- (481) What will be the output of the following code?
```python
def my_decorator(func):
	def wrapper(*args, **kwargs):
		print('Wrapper executed')
		return func(*args, **kwargs)
	return wrapper

@my_decorator
def add(a, b, c=0):
	return a + b + c

print(add(2, b=3, c=4))
```
- (482) What will be the output of the following code?
```python
def my_decorator(func):
	def wrapper(*args, **kwargs):
		print('Wrapper executed')
		return func(*args, **kwargs)
	return wrapper

@my_decorator
def add(a, b, c=0):
	return a + b + c
print(add(2, 3, c=4))
```
- (483) What will be the output of the following code?
```python
def my_decorator(func):
	def wrapper(*args, **kwargs):
		print('Wrapper executed')
		return func(*args, **kwargs)
	return wrapper

@my_decorator
def add(a, b, c=0)
	return a + b + c

print(add(2, 3, 4, 5))
```
- (484) What will be the output of the following code?
```python
def my_decorator(func):
	def wrapper(*args, **kwargs):
		print('Wrapper executed')
		return func(*args, **kwargs)
	return wrapper

@my_decorator
def add(a, b, c=0):
	return a + b + c

print(add(2, 3, d=4))
```
- (485) What does the `re.finditer()` function return?
- (486) Can decorators be used with class methods?
- (487) What is a lambda function in Python?
- (488) How do you define a lambda function that adds two numbers?
- (489) Which of the following is a valid lambda function?
- (490) What is the output of the following code: `(lambda x: x + 1)(2)`?
- (491) Can lambda functions have multiple statements?
- (492) What is the output of the following code: `(lambda x, y: x * y)(3, 4)`?
- (493) Which of the following is NOT a valid use of a lambda function?
- (494) What is the output of the following code: `list(map(lambda x: x * 2, [1, 2, 3]))`?
- (495) How do you use a lambda function to filter out even numbers from a list?
- (496) What is the output of the following code: `(lambda x, y=2: x + y)(3)`?
- (497) Can lambda functions have default argument values?
- (498) What is the output of the following code: `(lambda x, y: x if x > y else y)(3, 5)`?
- (499) Which of the following is a correct way to use a lambda function with the reduce function?
- (500) What is the output of the following code: `sorted([1, 2, 3, 4], key=lambda x: -x)`?
- (501) Can lambda functions be used inside list comprehensions?
- (502) What is the output of the following code: `(lambda x: x*x)(5)`?
- (503) Which of the following is a valid lambda function that returns the square of a number?
- (504) What is the output of the following code: `(lambda x, y: x / y) (10,2)`?
- (505) Can lambda functions be assigned to variables
- (506) What is the output of the following code: `(lambda x, y: x % y)(10, 3)`?
- (507) Which of the following is a valid lambda function that returns the maximum of two numbers?
- (508) What is the output of the following code: `(lambda x: x and x * 2)(0)`?
- (509) Can lambda functions be used as return values of other functions?
- (510) What is the output of the following code: `(lambda x, y: x **y)(2, 3)`?
- (511) Which of the following is a valid lambda function that returns the length of a string?
- (512) What is the output of the following code: `(lambda x: x > 0)(-1)`?
- (513) Can lambda functions be used as arguments to other functions?
- (514) What is the output of the following code: `(lambda x, y: x // y)(10, 3)`?
- (515) Which of the following is a valid lambda function that returns the concatenation of two strings?
- (516) What is the output of the following code: `(lambda x: x * 2 if x > 0 else -x)(-3)`?
- (517) What is the main purpose of using classes in Python?
- (518) How do you define a class in Python?
- (519) What is the purpose of the `__init__` method in a Python class?
- (520) How do you create an instance of a class in Python?
- (521)
	- #comment This question does not seem to exist?
- (522) How do you define a subclass in Python?
- (523) What is polymorphism in Python?
- (524) What is encapsulation in Python?
- (525) How do you define a private attribute in a Python class?
- (526) What is the purpose of the `super()` function in Python?
- (527) What is the difference between a class method and a static method in Python?
- (528) How do you define a static method in Python?
- (529) What is the purpose of the `__str__` method in a Python class?
- (530) How do you define a property in a Python class?
- (531) What is the purpose of the `__rep__` method in a Python class?
- (532) How do you define an abstract class in Python?
- (533) What is the purpose of the `__del__` method in a Python class?
- (534) How do you define a class attribute in Python?
- (535) What is the purpose of the `__call__` method in a Python class?
- (536) How do you define a method that can be called on both the class and its instances?
- (537) What is the purpose of the `__getitem__` method in a Python class?
- (538) How do you define a method that should not be overridden by subclasses?
- (539) What is the purpose of the `__setitem__` method in a Python class?
- (540) How do you define a method that should be overridden by subclasses?
- (541) What is the purpose of the `__len__` method in a Python class?
- (542) How do you define a method that should be called when an instance is used in a context manager?
- (543) What is the purpose of the `__iter__` method in a Python class?
- (544) How do you define a method that should be called when an instance is used in a for loop?
- (545) What is the purpose of the `__next__` method in a Python class?
- (546) How do you define a method inside a Python class?
- (547) How do you access an instance variable inside a class method?
- (548) How do you define a class variable in Python?
- (549) How do you access a class variable inside a class method?
- (550) What is the purpose of the self parameter in class methods?
- (551) How do you define a class method in Python?
- (552) How do you call a class method from an instance of the class?
- (553) How do you call a static method from an instance of the class?
- (554) How do you call a class method from the class itself?
- (555) How do you call a static method from the class itself?
- (556) How do you inherit from a class in Python?
- (557) How do you call a method from the superclass in a subclass?
- (558) How do you override a method in a subclass?
- (559) What is the purpose of the `__str__` method in a class?
- (560) How do you check if an object is an instance of a class?
- (561) How do you define a private variable in a class?
- (562) How do you define a property in a class?
- (563) How do you define a setter for a property in a class?
- (564) How do you access a private variable in a class?
- (565)
	- #comment This question does not exist either? 
- (566)  How do you define an instance attribute in Python?
- (567) How do you delete an attribute from an instance of a class?
- (568) How do you check if an attribute exists in an instance of a class? 
- (569) How do you get the value of an attribute from an instance of a class?
- (570) What is inheritance in Python?
- (571) Which keyword is used to inherit a class in Python?
- (572) What is the base class in the following code?
```python
class Animal:
	pass
class Dog(Animal):
	pass
```
- (573) What is the derived class in the following code?
```python
class Animal:
	pass
class Dog(Animal):
	pass
```
- (574) Which method is used to call the constructor of the base class?
- (575) What will be the output of the following code?
```python
class Animal:
	def __init__(self):
		print('Animal created')
class Dog(Animal):
	def __init__(self):
		super().__init__()
		print('Dog created')
Dog()
```
- (576) Can a derived class override methods of the base class?
- (577) What is the output of the following code?
```python
class Animal:
	def sound(self):
		return 'Some sound'
class Dog(Animal):
	def sound(self):
		return 'Bark'
d = Dog()
print(d.sound())
```
- (578) What is multiple inheritance
- (579) Which of the following is an example of multiple inheritance?
- (580) What is the method resolution order (MRO) in Python?
- (581) How can you view the MRO of a class?
- (582) What is the output of the following code?
```python
class A:
	def method(self):
		print('A')
class B(A):
	def method(self):
		print('B')
class C(A):
	def method(self):
		print('C')
class D(B, C):
	pass
d = D()
d.method()
```
- (583) What is the diamond problem in multiple inheritance?
- (584) How does Python handle the diamond problem?
- (585) What is the output of the following code?
```python
class A:
	def __init__(self):
		print('A')
class B(A):
	def __init__(self):
		print('B')
class C(A):
	def __init__(self):
		super().__init__()
		print('C')
class D(B, C):
	def __init__(self):
		super().__init__()
d = D()
d.__init__()
```
- (586) Can a class inherit from multiple classes in Python?
- (587)
	- #comment This question DNE....
- (588) What is the output of the following code?
```python
class A:
	def __init__(self):
		print('A')
class B(A):
	def __init__(self):
		print('B')
class C(B):
	def __init__(self):
		super().__init__()
		print('C')
c = C()
```
- (589) What is the output of the following code?
```python
class A:
	def __init__(self):
		print('A')
class B(A):
	def __init__(self):
		print('B')
class C(B):
	def __init__(self):
		B.__init__(self)
		print('C')
c = C()
```
- (590) What is the output of the following code?
```python
class A:
	def __init__(self):
		print('A')
class B(A):
	def __init__(self):
		A.__init__(self)
		print('B')
class C(B):
	def __init__(self):
		B.__init__(self)
		print('C')
c = C()
```
- (591)
	- #comment This question DNE
- (592) What is the output of the following code?
```python
class A:
	def __init__(self):
		print('A')
class B(A):
	def __init__(self):
		super().__init__()
		print('B')
class C(B):
	def __init__(self):
		print('C')
c = C()
```
- (593 - 597)
	- #comment These questions DNE
- (598) What is the output of the following code?
```python
class A:
	def __init__(self):
		print('A')
class B(A):
	def __init__(self):
		super().__init__()
		print('B')
class C(B):
	def __init__(self):
		super().__init__()
		print('C')
c = C()
```
- (599)
	- #comment This question DNE
- (600) How do you get the current date and time in Python using the datetime module?
- (601) Which method from the datetime module returns the current local date? 
- (602) How do you convert a string `2023-07-19` to a datetime object in Python?
- (603) Which method would you use to format a datetime object into a string with the format `YYY-MM-DD`?
- (604) How do you create a date object representing July 19, 2024, using the datetime module?
- (605) Which method from the datetime module would you use to create a time object representing `14:30:00`?
- (606) How do you create a `timedelta` object representing a duration of 5 days?
- (607) What does the `file.read()` method do in Python?
- (608) How can you read a single line from a file in Python?
- (609) Which method reads all lines from a file and returns them as a list in Python?
- (610) What is the purpose of the `file.write()` method in Python?
- (611) How do you write a list of strings to a file in Python?
- (612) What does the `file.close()` method do in Python?
- (613) When should you. use the `file.flush()` method in Python?
- (614) What is the purpose of the `file.seek()` method in Python?
- (615) How can you get the current position of the file pointer in Python?
- (616) What does the `math.sqrt()` method do in Python?
- (617) What is the purpose of the `math.pow()` method in Python?
- (618) How do you calculate the natural logarithm of a number using Python?
- (619) What does the `math.sin()` method return in Python?
- (620) What is the output of `math.cos(math.pi)` in Python?
- (621) Which of the following best describes the `math.tan()` method in Python?
- (622) What does the `math.factorial()` method compute in Python?
- (623) What is the purpose of the `math.gcd()` method in Python?
- (624) How do you calculate the least common multiple of two numbers using Python?
- (625) What does the `set.symmetric_difference()` method do in Python?
- (626) What is the purpose of the `set.intersection()` method in Python?
- (627) How does the `set.isdisjoint()` method work in Python?
- (628) What does the `set.difference()` method do in Python?
- (629) What is the purpose of the `list.extend()` method in Python?
- (630) How does the `list.append()` method work in Python?
- (631) What does the `set.union()` method do in Python?
- (632) What is the purpose of the `tuple.index()` method in Python?
- (633) How does the `tuple.count()` method work in Python?
- (634) What is the purpose of the `__init__` method in Python?
- (635) Which dunder method is used to represent the string version of an object?
- (636) What is the purpose of the `__repr__` method in Python?
- (637) Which dunder method is called when an object is deleted?
- (638) Which dunder method is used to get the length of an object?
- (639) Which dunder method is used to compare two objects for equality?
- (640) Which dunder method is used to compare if one object is less than another?
- (641) Which dunder method is used to add two objects?
- (642) Which dunder method is used to get an item from an object?
- (643) Which dunder method is used to set an item in an object?
- (644) Which dunder method is used to delete an item from an object?
- (645) Which dunder method is used to check if an object contains a specific item?
- (646) Which dunder method is used to make an object callable?
- (647) Which dunder method is used to make an object iterable?
- (648) Which dunder method is used to get the next item from an iterator?
- (649) What is the purpose of the `__enter__` method in Python?
- (650) What is the purpose of the `__exit__` method in Python?
- (651) What is the purpose of the `__hash__` method in Python?
- (652) Which dunder method is used to get the boolean value of an object?
- (653) Which dunder method is used to define custom string formatting for an object?
- (654) Which dunder method is used to define behavior for accessing an undefined attribute?
- (655) What is the purpose of the `__setattr__` method in Python?
- (656) Which dunder method is used to define behavior for setting an attribute?
- (657) What is an iterator in Python?
- (658) Which method must be implemented by an object to be an iterator?
- (659) What does the `__iter__()` method do?
- (660) What does the `__next__()` method do?
- (661) What exception is raised to signal the end of iteration?
- (662) Which built-in function is used to get an iterator from an iterable?
- (663) Which built-in function is used to get the next item from an iterator?
- (664) What will be the output of the following code?
```python
iter_obj = iter([1, 2, 3])
print(next(iter_obj))
```
- (665) What will be the output of the following code?
```python
iter_obj = iter([1, 2, 3])
print(next(iter_obj))
print(next(iter_obj))
```
- (666) What will be the output of the following code?
- (667) How can you create an iterator from a list?
- (668) What is the purpose of the `StopIteration` exception?
- (669) Which of the following is an example of an iterable?
- (670) What is the difference between an iterable and an iterator?
- (671) Can you use a for loop to iterate over an iterator?
- (672) What will be the output of the following code?
```python
iter_obj = iter([1, 2, 3])
for item in iter_obj:
	print(item)
```
- (673) What will be the output of the following code?
```python
iter_obj = iter([1, 2, 3])
for item in iter_obj:
	print(next(iter_obj))
```
- (674) How can you manually iterate over an iterator?
- (675) What will be the output of the following code?
- (676) What is the purpose of the second argument in the `next()` function?
- (677) What will be the output of the following code?
```python
iter_obj = iter([1, 2, 3])
print(next(iter_obj, 'End'))
print(next(iter_obj, 'End'))
print(next(iter_obj, 'End'))
print(next(iter_obj, 'End'))
```
- (678) How can you create a custom iterator in Python?
- (679) What will be the output of the following code?
```python
class Counter:
	def __init__(self, low, high):
		self.current = low
		self.high = high
	
	def __iter__(self):
		return self
	
	def __next__(self):
		if self.current > self.high:
			raise StopIteration
		else:
			self.current += 1
			return self.current - 1
for c in Counter(3, 8):
	print(c)
```
- (680) What will be the output of the following code?
```python
class Counter:
	def __init__(self, low, high):
		self.current = low
		self.high = high
	
	def __iter__(self):
		return self
	
	def __next__(self):
		if self.current > self.high:
			raise StopIteration
		else:
			self.current += 1
			return self.current - 1
counter = Counter(3, 8)
print(next(counter))
print(next(counter))
print(next(counter))
```
- (681) What will be the output of the following code?
```python
class Counter:
	def __init__(self, low, high):
		self.current = low
		self.high = high
	
	def __inter__(self):
		return self
	
	def __next__(self):
		if self.current > self.high:
			raise StopIteration
		else:
			self.current += 1
			return self.current - 1
counter = Counter(3, 8)
for c in counter:
	print(c)
print(next(counter))
```
- (682) What is a linked list in Python?
- (683) Which of the following is NOT a type of linked list?
- (684) What is the main advantage of a linked list over an array?
- (685) In a singly linked list, what does each node contain?
- (686) What is the time complexity of inserting an element at the beginning of a linked list?
- (687) Which of the following operations is typically slower in a linked list compared to an array?
- (688) What is the purpose of a sentinel node in a linked list?
- (689) In Python, which built-in data structure can be used to implement a linked list?
- (690) What is the space complexity of a singly linked list with `n` elements?
- (691) Which of the following is true about a circular linked list?
- (692) What is the main difference between a singly linked list and a doubly linked list?
- (693) Which of the following is NOT a common operation performed on linked lists?
- (694) What is the time complexity of searching for an element in an unsorted linked list?
- (695) In Python, what is the correct way to define a node class for a singly linked list?
- (696) What is the purpose of the 'head' in a linked list?
- (697) Which of the following is true about the `tail` of a linked list?
- (698) What is the time complexity of deleting the last element in a singly linked list if we don't have a tail pointer?
- (699) In Python, how can you implement a linked list without using classes?
- (700) What is the main advantage of a doubly linked list over a singly linked list?
- (701) Which of the following operations becomes more efficient with a tail pointer in a singly linked list?
- (702) What is the correct way to traverse a linked list in Python?
- (703) How can you detect a cycle in a linked list?
- (704) What is the time complexity of reversing a singly linked list?
- (705) In Python, how can you implement a stack using a linked list?
- (706) What is the main disadvantage of using a linked list compared to an array?
- (707) Which of the following is true about memory allocation in linked lists?
- (708) What is the purpose of the `__iter__` method in a Python linked list implementation?
- (709) How can you find the middle element of a singly linked list in one pass?
- (710) What is the time complexity of merging two sorted linked lists?
- (711) In Python, how can you check if a linked list is a palindrome?
- (712) What is the purpose of a dummy node in a linked list?
- (713) How can you implement a queue using a linked list in Python?
- (714) What is the time complexity of splitting a linked list into two halves?
- (715) In Python, how can you implement a circular linked list?
- (716) What is the main advantage of using a skip list over a regular linked list?
## References


