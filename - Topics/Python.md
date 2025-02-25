## Synthesis
- #question What are generics? 
- #question what does the === sign do in python? 
## Source [^1]
- [[syntax (python)|syntax]]
- [[comments (python)|comments]]
- [[variables (python)|variables]]
- [[data types (python)|data types]]
- [[casting (python)]]
- [[string (python)|string]]
- [[bool (python)|booleans]]
- [[operators (python)|operators]]
- [[List (Python)|list]]
- [[Tuple (Python)|tuple]]
- [[Set (Python)|sets]]
- [[dictionary (Python)|dictionary]]
- [[conditionals (python)|conditional]]
- [[while loop (python)|while loop]]
- [[for loop (python)|for loop]]
- [[function (python)|function]]
- [[lambda (python)|lambda]]
- [[Class (Python)|classes]]
- [[inheritance (python)|inheritance]]
- [[Module (Python)|modules]]
### Get Started
- (1) What is the correct file extension for Python files?
	- .py
- (2) What is a correct command line syntax for checking if python is installed on your computer? (And also to check the Python version)
	- python --version
- (3) What is a correct syntax to exit the Python command line interface?
	- exit()
### Syntax
- (1) True or False: Indentation in Python is for readability only.
	- False
- (2) Insert the missing part of the code below to output "Hello World".
	- `print("Hello World")`
- (3) Complete the code block, print "YES" if 5 is larger than 2
```python
if 5 > 2:
	print("YES")
```
### Comments
- (1) Which character is used to define a Python comment:
	- `#`
- (2) Comments in Python are written with a special character, which one?
	- `# This is a comment`
- (3) Use a multiline string to make the a multiline comment:
```python
"""
This is a comment
written in 
more than just one line
"""
```
### Variables
- (1) What is a correct way to declare a Python variable?
	- `x = 5`
- (2) True or False: You can declare string variables with single or double quotes.
```python
x = "John"
# is the same as
x = 'John'
```
- True
- (3) True or False: Variable names are not case-sensitive.
```python
a = 5
# is the same as
A = 5
```
- False
- (4) Select the correct functions to print the data type of a variable
	- `print(type(myvar))`
### Variable Names
- (1) Which is NOT a legal variable name?
	- `my-var = 20`
- (2) Create a variable named `carname` and assign the value `Volvo` to it.
	- `carname = "Volvo"`
- (3) Create a variable named x and assign the value `50` to it.
	- `x = 50`
### Multiple Variable Values
- (1) What is a correct syntax to add the value 'Hello World', to 3 variables in one statement?
	- `x = y = z = "Hello World"`
- (2) Insert the correct syntax to assign values to multiple variables in one line:
	- `x, y, z = "Orange", "Banana", "Cherry"`
- (3) Consider the following code. What will be the result of `a`
```python
fruits = ['apple', 'banana', 'cherry']
a, b, c = fruits
print(a)
```
- `apple`
### Output Variable
- (1) Consider the following code `print('Hello', 'World')`. What will be the printed result?
	- `Hello World`
		- #comment To get `HelloWorld`, you do `print("Hello" + "World")`
- (2) Consider the following code. What will be the printed result?
```python
a = 'Hello'
b = 'World'
print(a + b)
```
- `HelloWorld`
- (3) Consider the following code. What will be the printed result?
```python
a = 4
b = 5
print(a + b)
```
- 9
### Global Variable
- (1) Consider the following code. What will be the printed result?
```python
x = 'awesome'
def myfunc():
  x = 'fantastic'
myfunc()
print('Python is ' + x)
```
- `Python is awesome`
- (2) Insert the correct keyword to make the variable x belong to the global scope.
```python
def myfunc():
	global x
	x = "fantastic"
```
- (3) Consider the following code. What will be the printed result?
```python
x = 'awesome'
def myfunc():
  global x
  x = 'fantastic'
myfunc()
print('Python is ' + x)
```
- Python is fantastic
### Data Types
- (1) If `x = 5`, what is a correct syntax for printing the data type of the variable `x`?
	- `print(type(x))`
- (2) The following code example would print the data type of x, what data type would that be?
```python
x = 5
print(type(x))

#int
```
- (3) The following code example would print the data type of x, what data type would that be?
```python
x = "Hello World"
print(type(x))

# str
```
- (4) The following code example would print the data type of x, what data type would that be?
```python
x = 20.5
print(type(x))

# float
```
- (5) The following code example would print the data type of x, what data type would that be?
```python
x = ["apple", "banana", "cherry"]
print(type(x))

# list
```
- (6) The following code example would print the data type of x, what data type would that be?
```python
x = ("apple", "banana", "cherry")
print(type(x))

# tuple
```
- (7) The following code example would print the data type of x, what data type would that be?
```python
x = {"name" : "John", "age" : 36}
print(type(x))

# dict
```
- (8) The following code example would print the data type of x, what data type would that be?
```python
x = True
print(type(x))

# bool
```
### Numbers
- (1) Which is NOT a legal numeric data type in Python:
	- `long` is not legal
		- `int` and `float` are legal
- (2) Insert the correct syntax to convert x into a floating point number.
```python
x = 5
x = float(x)
```
- (3) Insert the correct syntax to convert x into a integer.
```python
x = 5.5
x = int(x)
```
- (4) Insert the correct syntax to convert x into a complex number
```python
x = 5
x = complex(x)
```
### Casting
- (1) What will be the result of the following code: `print(int(35.88))`
	- `35`
- (2) What will be the result of the following code: `print(float(35))`
	- `35.0`
- (3) What will be the result of the following code: `print(str(35.82))`
	- `35.82`
### Strings
- (1) What will be the result of the following code
```python
x = 'Welcome'
print(x[3])
```
- The output would be `c`
- (2) Use the `len` function to print the length of the string
```python
x = "Hello World"
print(len(x))
```
- (3) Get the first character of the string `txt`
```python
txt = "Hello World"
x = txt[0]
```
- (4) Insert the correct keyword to check if the word 'free' is present in the text
```python
txt = 'The best things in life are free!'
if 'free' in txt:
	print('Yes, free is present in the text')
```
### Slicing Strings
- (1) What will be the result of the following code
```python
x = 'Welcome'
print(x[3:5])
```
- Output: `co`
- (2) Get the characters from index 2 to index 4 (`llo`)
```python
txt = "Hello World"
x = txt[2:5]
```
- (3) What will be the result of the following code
```python
x = 'Welcome'
print(x[3:])
```
- Output: `come`
### Modify Strings
- (1) What is a correct syntax to print a string in upper case letters?
	- `'Welcome'.upper()`
- (2) Return the string without any whitespace at the beginning or the end
```python
txt = " Hello World "
x = txt.strip()
```
- (3) Convert the value of `txt` to upper case
```python
txt = "Hello World"
txt = txt.upper()
```
- (4) Convert the value of `txt` to lower case
```python
txt = "Hello World"
txt = txt.lower()
```
- (5) Replace the character `H` with a `J`
```python
txt = "Hello World"
txt = txt.replace("H", "J")
```
### Concatenate Strings
- (1) What is a correct syntax to merge variable `x` and `y` into variable `Z`
	- `z = x + y`
- (2) What will be the result of the following code
```python
x = 'Welcome'
y = 'Coders'
print(x + y)
```
- Output: `WelcomeCoders`
- (3) Consider this code. What is a correct syntax to print 'Join the party'?
```python
a = 'Join'
b = 'the'
c = 'party'
```
- `print(a + ' ' + b + ' ' + c)`
### Format Strings
- (1) If `x = 9`, what is correct syntax to print 'The price is 9.00 dollars'?
	- `print(f'The price is {x:.2f} dollars)`
- (2) Insert the correct syntax to add a placeholder for the age parameter
```python
age = 36
txt = f"My name is John, and I am {age}"
print(txt)
```
- (3) What will be the result of the following code: `print(f'The price is {2 + 3} dollars')`
	- The price is 5 dollars
### Booleans
- (1) What will be the result of the following syntax: `print (5 > 3)`?
	- True
- (2) The statement below would print a Boolean value, which one?
```python
print (10 > 9)

# True
```
- (3) The statement below would print a Boolean value, which one?
```python
print(10 == 9)

# False
```
- (4) The statement below would print a Boolean value, which one?
```python
print(10 < 9)

# False
```
- (5) The statement below would print a Boolean value, which one?
```python
print(bool("abc"))

# True
```
- (6) The statement below would print a Boolean value, which one?
```python
print(bool(0))

# False
```
### Operators
- (1) What will be the result of the following syntax
```python
x = 5
x += 3
print(x)
```
- Output: 8
- (2) Multiply `10` with `5`, and print the result
	- `print(10 * 5)`
- (3) Divide `10` by `2`, and print the result
	- `print(10 / 2)`
- (4) Use the correct membership operator to check if "apple" is present in the `fruits` object
```python
fruits = ["apple", "banana"]
if "apple" in fruits:
	print("Yes, apple is a fruit!")
```
- (5) Use the correct comparison operator to check if `5` is not equal to `10`
```python
if 5 != 10
	print("5 and 10 is not equal")
```
- (6) Use the correct logical operator to check if at least one of two statements is `True`
```python
if 5 == 10 or 4 == 4:
	print("At least one of the statements is true")
```
### Lists
- (1) What will be the result of the following syntax
```python
mylist = ['apple', 'banana', 'cherry']
print(mylist[1])

# Output: banana
```
- (2) What will be the result of the following syntax
```python
mylist = ['apple', 'banana', 'banana', 'cherry']
print(mylist[2])

#Output: banana
```
- (3) True or False. List Items cannot be removed after the list has been created
	- False
- (4) Select the correct function for returning the number of items in a list
```python
thislist = ['apple', 'banana', 'cherry']
print(len(thislist))
```
### Access Lists
- (1) What will be the result of the following syntax
```python
mylist = ['apple', 'banana', 'cherry']
print(mylist[-1])

#Output: cherry
```
- (2) Print the second item in the `fruits` list
```python
fruits = ["apple", "banana", "cherry"]
print(fruits[1])
```
- (3) What will be the result of the following syntax
```python
mylist = ['apple', 'banana', 'cherry', 'orange', 'kiwi']
print(mylist[1:4])

#Output: ['banana', 'cherry', 'orange']
```
- (4) Use a range of indexes to print the third, fourth, and fifth item in the list.
```python
fruits = ["apple", "banana", "cherry", "orange", "kiwi", "melon", "mango"]
print(fruits[2:5])
```
### Change Lists
- (1) What will be the result of the following syntax
```python
mylist = ['apple', 'banana', 'cherry']
mylist[0] = 'kiwi'
print(mylist[1])
```
- Output: `banana`
- (2) Change the value from "apple" to "kiwi", in the `fruits` list
```python
fruits = ["apple", "banana", "cherry"]
fruits[0] = "kiwi"
```
- (3) What will be the result of the following syntax
```python
mylist = ['apple', 'banana', 'cherry']
mylist[1:2] = ['kiwi', 'mango']
print(mylist[2])
```
- Output: `mango`
	- This is the output of `mylist` itself: `['apple', 'kiwi', 'mango', 'cherry']`
### Add List Items
- (1) What will be the result of the following syntax
```python
mylist = ['apple', 'banana', 'cherry']
mylist.insert(0, 'orange')
print(mylist[1])
```
- `apple`
- (2) Use the `append` method to add "orange" to the `fruits` list
```python
fruits = ["apple", "banana", "cherry"]
fruits.append('orange')
```
- (3) Use the `insert` method to add "lemon" as the second item in the `fruits` list
```python
fruits = ["apple", "banana", "cherry"]
fruits.insert(1, "lemon")
```
- (4) Select the missing parts to add the elements of `tropical` to `fruits`:
```python
fruits = ['apple', 'banana', 'cherry']
tropical = ['mango', 'pineapple', 'papaya']
fruits.extend(tropical)
```
### Remove List Items
- (1) What is a List method for removing list items?
	- `pop()`
- (2) Use the `remove` method to remove "banana" from the `fruits` list
```python
fruits = ["apple", "banana", "cherry"]
fruits.remove('banana')
```
- (3) What will be the result of the following syntax
```python
mylist = ['apple', 'banana', 'cherry']
mylist.pop(1)
print(mylist)
```
- `['apple', 'cherry']`
- (4) Select the correct function to remove all items from a list
```python
fruits = ['apple', 'banana', 'cherry']
fruits.clear()
```
### Loop Lists
- (1) What is a correct syntax for lopping through the items of a list
```python
for x in ['apple', 'banana', 'cherry']:
	print(x)
```
- (2) Insert the missing part of the while loop below to loop through the items of a list
```python
mylist = ['apple', 'banana', 'cherry']
i = 0
while i < len(mylist):
	print(mylist[i])
	i = i + 1
```
- (3) What is a correct syntax for looping through the items of a list?
	- `[print(x) for x in ['apple', 'banana', 'cherry']]`
### List Comprehension
- (1) Consider the following code. What will be the value of `newlist`
```python
fruits = ['apple', 'banana', 'cherry']
newlist = [x for x in frutis if x == 'banana']
```
- `['banana']`
- (2) Fill in the missing parts to complete the list comprehension
```python
fruits = ["apple", "banana", "cherry"]
newlist = [x for x in fruits]
```
- (3) Consider the following code. What will be the value of `newlist`?
```python
fruits = ['apple', 'banana', 'cherry']
newlist = ['apple' for x in fruits]
```
- `['apple', 'apple', 'apple']`
### Sort Lists
- (1) What is a correct syntax for sorting a list
	- `mylist.sort()`
- (2) What is a correct syntax for reversing the current order of a list?
	- `mylist.reverse()`
- (3) What is a correct syntax for sorting a list descending?
	- `mylist.sort(reverse = True)`
### Copy Lists
- (1) What is a correct syntax for making a copy of a list
	- `list2 = list1.copy()`
- (2) What is a correct syntax for making a copy of a list?
	- `list2 = list(list1)`
- (3) What is a correct syntax for making a copy of a list?
	- `list2 = list1[:]`
### Join Lists
- (1) What is a correct syntax for joining `list1` and `list2` into `list3`?
	- `list3 = list1 + list2`
- (2) What is a correct syntax for adding elements from `list2` and `list1`?
	- `list1.extend(list2)`
- (3) Consider the following code. What will be the value of `list1`?
```python
list1 = ['a', 'b', 'c']
list2 = [1, 2, 3]
for x in list2:
	list1.append(x)
```
- `['a', 'b', 'c', 1, 2, 3]`
### Tuples
- (1) Which one of these is a tuple?
	- `thistuple = ('apple', 'banana', 'cherry')`
- (2) Use the correct syntax to print the number of items in the fruits tuple.
```python
fruits = ("apple", "banana", "cherry")
print(len(fruits))
```
- (3) True or False. Tuple items cannot be removed after the tuple has been created.
	- True
### Access Tuples
- (1) You can access tuple items by referring to the index number, but what is the index number of the first item?
	- 0
- (2) Use the correct syntax to print the first item in the `fruits` tuple.
```python
fruits = ("apple", "banana", "cherry")
print(fruits[0])
```
- (3) Use negative indexing to print the last item in the tuple.
```python
fruits = ("apple", "banana", "cherry")
print(fruits[-1])
```
- (4) Use a range of indexes to print the third, fourth, and fifth item in the tuple.
```python
fruits = ("apple", "banana", "cherry", "orange", "kiwi", "melon", "mango")
print(fruits[2:5])
```
### Update Tuples
- (1) You cannot change the items of a tuple, but there are workarounds. Which of the following suggestion will work?
	- Convert tuple into a list, change item, convert back into a tuple.
- (2) Which is a correct syntax to delete a tuple?
	- `del mytuple`
- (3) True or False. You are allowed to add a tuple to an existing tuple.
	- True
### Unpack Tuples
- (1) Consider the following code. What will be the value of `y`?
```python
fruits = ('apple', 'banana', 'cherry')
(x, y, z) = fruits
print(y)

# Output: banana
```
- (2) Consider the following code. What will be the value of `y`?
```python
fruits = ('apple', 'banana', 'cherry')
(x, *y) = fruits
print(y)

# Output: ['banana', 'cherry']
```
- (3) Consider the following code. What will be the value of `y`?
```python
fruits = ('apple', 'banana', 'cherry', 'mango')
(x, *y, z) = fruits
print(y)

# Output: ['banana', 'cherry']
```
### Loop Tuples
- (1) What is a correct syntax for looping through the items of a tuple?
```python
for x in ('apple', 'banana', 'cherry'):
	print(x)
```
- (2) Insert the missing part of the while loop below to loop through the items of a tuple.
```python
mytuple = ('apple', 'banana', 'cherry')
i = 0
while i < len(mytuple):
	print(mytuple[i])
	i = i + 1
```
- (3) Insert the missing part of the for loop below to loop through the items of a tuple by using the range function to loop through the tuple's index numbers.
```python
thistuple = ("apple", "banana", "cherry")
for i in range(len(thistuple)):
	print(thistuple[i])
```
### Join Tuples
- (1) What is a correct syntax for joining `tuple1` and `tuple2` into `tuple3`?
	- `tuple3 = tuple1 + tuple2`
- (2) What is a legal way to turn this tuple: `(1,2,3)` into this tuple:`(1,2,3,1,2,3)?`
```python
tuple1 = (1,2,3)
tuple1 = tuple1 * 2
```
- (3) Consider the following code. What will be the value of `tuple3`?
```python
tuple1 = ('a', 'b' , 'c')
tuple2 = (1, 2, 3)
tuple3 = tuple2 + tuple1

# tuple3 = (1, 2, 3, 'a', 'b', 'c')
```
### Sets
- (1) Which one of these is a set?
	- `myset = {'apple', 'banana', 'cherry'}`
- (2) True or False. Set items cannot be removed after the set has been created
	- False
- (3) True or False. A set cannot have two items with the same value.
	- True
- (4) Select the correct function for returning the number of items in a set:
```python
fruits = {'apple', 'banana', 'cherry'}
print(len(fruits))
```
### Access Sets
- (1) True or False. You can access set items by referring to the index.
	- False
- (2) Check if "apple" is present in the fruits set.
```python
fruits = {"apple", "banana", "cherry"}
if "apple" in fruits:
	print("Yes, apple is a fruit!")
```
- (3) Consider the following code. What will be the printed result?
```python
thisset = {'apple', 'banana', 'cherry'}
print('banana' not in thisset)

# Output: False
```
### Add Set Items
- (1) What is a correct syntax for adding items to a set?
	- `add()`
- (2) Use the `add` method to add "orange" to the `fruits` set.
```python
fruits = {"apple", "banana", "cherry"}
fruits.add("orange")
```
- (3) Use the correct method to add multiple items (`more_fruits`) to the `fruits` set.
```python
fruits = {"apple", "banana", "cherry"}
more_fruits = ["orange", "mango", "grapes"]
fruits.update(more_fruits)
```
### Remove Set Items
- (1) What is a correct syntax for removing an item from a set?
	- `remove()`
- (2) Use the `remove` method to remove "banana" from the `fruits` set.
```python
fruits = {"apple", "banana", "cherry"}
fruits.remove("banana")
```
- (3) Use the `discard` method to remove "banana" from the `fruits` set.
```python
fruits = {"apple", "banana", "cherry"}
fruits.discard("banana")
```
- (4) Select the correct function to remove all items from a set
```python
fruits = {'apple', 'banana', 'cherry'}
fruits.clear()
```
### Loop Sets
- (1) What is a correct syntax for looping through the items of a set?
```python
for x in {'apple', 'banana', 'cherry'}:
  print(x)
```
- (2) Insert the missing part of the for loop below to loop through the items of a set.
```python
myset = {'apple', 'banana', 'cherry'}
for x in myset:
	print(x)
```
- (3) True or False. Sets are unordered, so when you loop through the items, the order will be totally random.
	- True
### Join Sets
- (1) What is a correct syntax for joining set1 and set2 into set3?
	- `set3 = set1.union(set2)`
- (2) What is a correct syntax for joining multiple sets into one new set called set5?
	- `set5.union(set1, set2, set3, set4)`
- (3)
### Dictionaries
### Access Dictionaries
### Change Dictionaries
### Add Dictionary Items
### Remove Dictionary Items
### Loop Dictionaries
### Copy Dictionaries
### Nested Dictionaries
### If Else
### While Loops
### For Loops
###  Functions
### Lambda
### Arrays
### Classes
### Inheritance
### Iterators
### Polymorphism
### Scope
### Modules
### Dates
### Math
### JSON
### RegEx
### PIP
### Try Except
### User Input
### String Formatting
### File Handling
### Open File
### Write to File
### Remove File

## Source [^2]
- Initially designed by [[Guido van Rossum]] in 1991.

## Source [^3]
- It is a free, open-source programming language

## Source [^4]
- `range(1, 3)` function has 1 inclusive and 3 exclusive
```python
for i in range(1 , 3):
	print(i)

# OUTPUT
# 1
# 2
```

- Allocating array
```python
C = [0] * 5  # [0, 0, 0, 0, 0]
```

### Concepts
- [[Namespace (Python)|namespace]]
- [[Object-Oriented Programming (Python)|Object-Oriented Programming]]
- [[Composition (Python)|composition]]
- [[inheritance (python)|inheritance]]
- [[coroutines]]
- [[def (python)|def]]
- [[python program]]
- [[python script]]
- [[python module]]
- [[file object (python)|file object]]
- [[Threading (python)|threading]]
- [[recursion (python)|recursion]]
- [[initialization (python)|initialization]]

### Description
- Python doesn't have a strict concept of [[constants]]
	- Conventionally, constants represented using uppercase names to indicate their values should not change

### Initialization
- Refers to the process of assigning an initial value to a variable or setting up an object with default values.
#### Initializing Variables
```python
x = 10          # Integer initialization
y = 3.14        # Float initialization
name = "Alice"  # String initialization
numbers = [1, 2, 3]  # List initialization
settings = {"theme": "dark", "language": "English"}  # Dictionary initialization
```


## Source [^5]
- [[LEGB rule]]

## Source [^6]
- `import this` prints out the zen of python

## References
[^1]: https://www.w3schools.com/python/python_exercises.asp
[^2]: https://www.geeksforgeeks.org/history-of-python/
[^3]: https://support.datacamp.com/hc/en-us/articles/360038816113-Is-Python-free#:~:text=Yes.,for%20free%20at%20python.org.
[^4]: ChatGPT
[^5]: https://www.nielit.gov.in/gorakhpur/sites/default/files/Gorakhpur/ALevel_1_Python_26May_SS.pdf
[^6]: https://peps.python.org/pep-0020/