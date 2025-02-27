---
Source:
  - https://www.w3schools.com/python/python_exercises.asp
Length: "72"
tags:
  - status/complete
  - type/website
Reviewed: false
---
## Get Started
- (1) What is the correct file extension for Python files?
	- .py
- (2) What is a correct command line syntax for checking if python is installed on your computer? (And also to check the Python version)
	- python --version
- (3) What is a correct syntax to exit the Python command line interface?
	- exit()
## Syntax
- (1) True or False: Indentation in Python is for readability only.
	- False
- (2) Insert the missing part of the code below to output "Hello World".
	- `print("Hello World")`
- (3) Complete the code block, print "YES" if 5 is larger than 2
```python
if 5 > 2:
	print("YES")
```
## Comments
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
## Variables
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
## Variable Names
- (1) Which is NOT a legal variable name?
	- `my-var = 20`
- (2) Create a variable named `carname` and assign the value `Volvo` to it.
	- `carname = "Volvo"`
- (3) Create a variable named x and assign the value `50` to it.
	- `x = 50`
## Multiple Variable Values
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
## Output Variable
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
## Global Variable
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
## Data Types
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
## Numbers
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
## Casting
- (1) What will be the result of the following code: `print(int(35.88))`
	- `35`
- (2) What will be the result of the following code: `print(float(35))`
	- `35.0`
- (3) What will be the result of the following code: `print(str(35.82))`
	- `35.82`
## Strings
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
## Slicing Strings
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
## Modify Strings
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
## Concatenate Strings
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
## Format Strings
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
## Booleans
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
## Operators
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
## Lists
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
## Access Lists
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
## Change Lists
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
## Add List Items
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
## Remove List Items
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
## Loop Lists
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
## List Comprehension
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
## Sort Lists
- (1) What is a correct syntax for sorting a list
	- `mylist.sort()`
- (2) What is a correct syntax for reversing the current order of a list?
	- `mylist.reverse()`
- (3) What is a correct syntax for sorting a list descending?
	- `mylist.sort(reverse = True)`
## Copy Lists
- (1) What is a correct syntax for making a copy of a list
	- `list2 = list1.copy()`
- (2) What is a correct syntax for making a copy of a list?
	- `list2 = list(list1)`
- (3) What is a correct syntax for making a copy of a list?
	- `list2 = list1[:]`
## Join Lists
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
## Tuples
- (1) Which one of these is a tuple?
	- `thistuple = ('apple', 'banana', 'cherry')`
- (2) Use the correct syntax to print the number of items in the fruits tuple.
```python
fruits = ("apple", "banana", "cherry")
print(len(fruits))
```
- (3) True or False. Tuple items cannot be removed after the tuple has been created.
	- True
## Access Tuples
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
## Update Tuples
- (1) You cannot change the items of a tuple, but there are workarounds. Which of the following suggestion will work?
	- Convert tuple into a list, change item, convert back into a tuple.
- (2) Which is a correct syntax to delete a tuple?
	- `del mytuple`
- (3) True or False. You are allowed to add a tuple to an existing tuple.
	- True
## Unpack Tuples
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
## Loop Tuples
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
## Join Tuples
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
## Sets
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
## Access Sets
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
## Add Set Items
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
## Remove Set Items
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
## Loop Sets
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
## Join Sets
- (1) What is a correct syntax for joining set1 and set2 into set3?
	- `set3 = set1.union(set2)`
- (2) What is a correct syntax for joining multiple sets into one new set called set5?
	- set5 = set1 | set2 | set3 | set4
- (3) There are many ways to join sets in Python. Which one of the following methods keeps ONLY the duplicates?
	- intersection()
## Dictionaries
- (1) Which one of these is a dictionary?
	- x = {'type' : 'fruit', 'name' : 'banana'}
- (2) True or False. Dictionary items cannot be removed after the dictionary has been created.
	- False
- (3) True or False.  A dictionary cannot have two keys with the same name.
	- True
- (4) Select the correct function to print the number of key/value pairs in the dictionary:
```python
x = {'type' : 'fruit', 'name' : 'banana'}
printt(len(x))
```
## Access Dictionaries
- (1) True or False. You can access item values by referring to the key name.
	- True
- (2) Use the get method to print the value of the "model" key of the car dictionary.
```python
car =	{
  "brand": "Ford",
  "model": "Mustang",
  "year": 1964
}
print(car.get("model"))
```
- (3) Consider the following code. What will be the printed result?
```python
x = {'type' : 'fruit', 'name' : 'banana'}
print(x['type'])

# Output: fruit
``` 
## Change Dictionaries
- (1) Consider the following code. What is a correct syntax for changing the `type` from `fruit` to `berry`
```python
x = {'type' : 'fruit', 'name' : 'banana'}
# Solution: `x['type'] = 'berry'`
```
- (2) Change the "year" value from 1964 to 2020.
```python
car =	{
  "brand": "Ford",
  "model": "Mustang",
  "year": 1964
}
car["year"] = 2020
```
- (3) Consider the following code. What is a correct syntax for changing the `name` from `banana` to `apple`?
```python
x = {'type' : 'fruit', 'name' : 'banana'}
# Solution: x.update({'name': 'apple'})
```
## Add Dictionary Items
- (1) Which one of these dictionary methods can be used to add items to a dictionary?
	- `update()`
- (2) Add the key/value pair "color" : "red" to the `car` dictionary
```python
car = {
	"brand":"Ford",
	"model":"Mustang",
	"year": 1964
}
car["color"] = "red"
```
- (3) Insert the missing part to add an item to the dictionary
```python
x = {'type' : 'fruit', 'name':'apple'}
x.update({'color':'green'})
```
## Remove Dictionary Items
- (1) What is a dictionary method for removing an item from a dictionary?
	- `pop()`
- (2) Use the `pop` method to remove "model" from the `car` dictionary
```python
car = {
	"brand":"Ford",
	"model":"Mustang",
	"year": 1964
}
car.pop("model")
```
- (3) Use the `clear` method to empty the `car` dictionary
```python
car = {
	"brand": "Ford",
	"model": "Mustang",
	"year": 1964
}
car.clear()
```
- (4) Insert a correct syntax for removing the `color` item of the dictionary:
```
myvar = {'type' : 'fruit', 'name' : 'apple', 'color': 'red'}
del myvar['color']
```
## Loop Dictionaries
- (1) What is a correct syntax for looping through the values of this dictionary
```python
x = {'type' : 'fruit', 'name' : 'apple'}

# Solution
for y in x.values():
  print(y)
```
- (2) What is a correct syntax for looping through the keys AND values of this dictionary:
```python
x = {'type' : 'fruit', 'name' : 'apple'}

# Solution
for y, z in x.items():
  print(y, z)
```
- (3) Insert the missing part of the for loop below to loop through the items of a set.
```python
myset = {'apple', 'banana', 'cherry'}
for x in myset:
	print(x)
```
- (4) What is a correct syntax for looping through the keys of this dictionary:
```python
x = {'type' : 'fruit', 'name' : 'apple'}

# Solution
for y in x.keys():
  print(y)
```
## Copy Dictionaries
- (1) What is a correct syntax for making a copy of this dictionary:
```python
x = {'type' : 'fruit', 'name' : 'apple'}

# Solution
y = x.copy()
```
- (2) One of these codes is NOT a correct way of making a copy of a dictionary named `x`, which one
	- `y = x.duplicate()`
- (3) True or False. Copied dictionaries will not be able to change its item values.
	- False
## Nested Dictionaries
- (1) Consider this syntax. What will be a correct syntax for printing the name 'May'?
```python
a = {'name' : 'John', 'age' : '20'}
b = {'name' : 'May', 'age' : '23'}
customers = {'c1' : a, 'c2' : b}

# Solution
print(customers['c2']['name'])
```
- (2) Insert the missing part to loop through the keys and values of all nested dictionaries:
```python
a = {'name' : 'John', 'age' : 20}
b = {'name' : 'May', 'age' : 23}
customers = {'c1' : a, 'c2' : b}

for x, obj in customers.items()
	print(x)
	for y in obj:
		print(y + ':', obj[y])
```
- (3) True or False. A dictionary can only have one level of nested dictionaries.
	- False
## If Else
- (1) What will be the result of the following code:
```python
x = 5
y = 8
if x > y:
  print('Hello')
else:
  print('Welcome')

# Result
# Welcome
```
- (2) Print "Hello World" if a is greater than b.
```python
a = 50
b = 10
if a > b:
	print("Hello World")
```
- (3) Print "Hello World" if a is not equal to b.
```python
a = 50
b = 10
if a != b:
	print("Hello World")
```
- (4) Print "Yes" if a is equal to b, otherwise print "No".
```python
a = 50
b = 10
if a == b:
	print("Yes")
else:
	print("No")
```
- (5) Print "1" if `a` is equal to `b`, print "2" if `a` is greater than `b`, otherwise print "3".
```python
a = 50
b = 10
if a > b:
	print("1")
elif a > b:
	print("2")
else:
	print("3")
```
- (6) Print "Hello" if `a` is equal to `b`, and `c` is equal to `d`.
```python
if a == b and c == d:
	print("Hello")
```
- (7) Print "Hello" if `a` is equal to `b`, or if `c` is equal to `d`.
```python
if a == b or c == d:
	print("Hello")
```
- (8) Complete the code block, print "YES" if 5 is larger than 2.
```python
if 5 > 2:
	print("YES")
```
- (9) Use the correct one line short hand syntax to print "YES" if `a` is equal to `b`, otherwise print("NO").
```python
a = 2
b = 5
print("YES") if a == b else print("NO")
```
## While Loops
- (1) Which statement is a correct syntax to break out of a loop?
	- `break`
- (2) Print `i` as long as `i` is less than 6.
```python
i = 1
while i < 6:
	print(i)
	i += 1
```
- (3) Stop the loop if `i` is 3
```python
i = 1
while i < 6:
	if i == 3:
		break
	i += 1
```
- (4) In the loop, when i is 3, jump directly to the next iteration.
```python
i = 0
while i < 6:
  i += 1
  if i == 3:
	  continue
  print(i)
```
- (5) Print a message once the condition is false
```python
i = 1
while i < 6:
  print(i)
  i += 1
else:
	print("i is no longer less than 6")
```
## For Loops
- (1) What will be the result of the following code:
```python
for x in range(3):
  print(x)

# Output
# 0  
# 1  
# 2
```
- (2) Loop through the items in the `fruits` list.
```python
fruits = ["apple", "banana", "cherry"]
for x in fruits:
	print(x)
```
- (3) In the loop, when the item value is "banana", jump directly to the next item.
```python
fruits = ["apple", "banana", "cherry"]
for x in fruits:
  if x == "banana":
	  continue
  print(x)
```
- (4) Use the `range` function to loop through a code set 6 times.
```python
for x in 
range(6):
	print(x)
```
- (5) Exit the loop when x is "banana".
```python
fruits = ["apple", "banana", "cherry"]
for x in fruits:
	if x == "banana":
		break
	print(x)
```
##  Functions
- (1) What is the correct keyword for defining functions in Python?
	- `def`
- (2) Create a function named my_function
```python
def my_function():
	print("Hello from a function")
```
- (3) Execute a function named my_function.
```python
def my_function():
  print("Hello from a function")
my_function()
```
- (4) Inside a function with two parameters, print the first parameter.
```python
def my_function(fname, lname):
	print(fname)
```
- (5) Let the function return the `x` parameter + 5
```python
def my_function(x):
	return x + 5
```
- (6) If you do not know the number of arguments that will be passed into your function, there is a prefix you can add in the function definition, which prefix?
```python
def my_function(*kids):
	print("The youngest child is " + kids[2])
```
- (7) If you do not know the number of keyword arguments that will be passed into your function, there is a prefix you can add in the function definition, which prefix?
```python
def my_function(**kid):
  print("His last name is " + kid["lname"])
```
#question How do stars work?
## Lambda
- (1) What will be the result of the following code
```python
x = lambda a, b : a - b
print(x(5, 3))

# Output: 2
```
- (2) True or False: Lambda functions can take multiple arguments.
	- True
- (3) True or False: Lambda functions can have multiple expressions.
	- False
- (4) Create a lambda function that takes one parameter (a) and returns it.
	- `x = lambda a : a`
## Arrays
- (1) Python Lists can be used as arrays. What will be the result of the following code:
```python
fruits = ['apple', 'banana', 'cherry']
print(fruits[0]) # apple
```
- (2) What is a correct Python List method used to return the number of elements in a list?
	- `len()`
- (3) What will be the result of the following code
```python
fruits = ['apple', 'bananan', 'cherry']
print(len(fruits)) # 3
```
## Classes
- (1) When the class object is represented as a string, there is a function that controls what should be returned, which one?
	- `__str__()`
- (2) What is a correct syntax for deleting an object named person in Python?
	- `del person`
- (3) Create a class named MyClass:
```python
class MyClass
	x = 5
```
- (4) Create an object of MyClass called p1
```python
class MyClass:
	x = 5
p1 = MyClass()
```
- (5) Use the p1 object to print the value of x
```python
class MyClass:
	x = 5

p1 = MyClass()

print(p1.x)
```
- (6) What is the correct syntax to assign a "init" function to a class?
```python
class Person:
  def __init__(self, name, age):
    self.name = name
    self.age = age
```
- (7) Insert the missing parts to make the code return: John(36):
```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __str__(self):
        return f'{self.name}({self.age})'

p1 = Person('John', 36)
print(p1)
```
## Inheritance
- (1) What is the correct keyword to use inside an empty class, to avoid getting an error?
	- `pass`
- (2) What is the correct syntax to create a class named `Student` that will inherit properties and methods from a class named `Person`?
	- `class Student(Person):`
- (3) We have used the `Student` class to create an object named `x`. What is the correct syntax to execute the `printname` method of the object `x`?
```python
class Person:
	def __init__(self, fname):
		self.firstname = fname

	def printname(self):
		print(self.firstname)

class Student(Person):
	pass

x = Student("Mike")
x.printname()
```
## Iterators
- (1) There are two methods that you have to implement when you create an iterator, which two?
	- `__iter__()` and `__next__()`
- (2) Which statement can be used to stop the iteration?
	- `stopIteration`
- (3) True or False. Lists, tuples, dictionaries, and sets are all iterable objects.
	- True
## Polymorphism
- (1) True or False. One object cannot have a method with the same name as another object's method.
	- False
- (2) True or False. Methods with the same name, but for different objects, can have different content, but the return value has to be of same data type.
	- False
- (3) Which statement is true?
	- [[Polymorphism]] refers to methods/functions/operators with the same name that can be executed on many objects or classes.
## Scope
- (1) Consider the following code. What will be the printed result?
```python
x = 300
def myfunc():
  x = 200
myfunc()
print(x) # 300
```
- (2) Consider the following code. What will be the printed result?
	- #errata This [problem](https://www.w3schools.com/python/exercise.asp?x=xrcise_scope2) forgot to ask a question
```python
x = 300
def myfunc():
  global x
  x = 200
myfunc()
print(x) #200
```
- (3) Which statement keyword can be used for variables inside nested function?
	- `nonlocal`
## Modules
- (1) True or False. A module can only contain one function or object.
	- False
- (2) What is the correct syntax to import a module named "`mymodule`"?
	- `import mymodule`
- (3) If you want to refer to a module by using a different name, you can create an alias. What is the correct syntax for creating an alias for a module?
	- `import mymodule as mx`
- (4) What is the correct syntax of printing all variables and function names of the "`mymodule`" module?
```python
import mymodule

print(dir(mymodule))
```
- (5) What is the correct syntax of importing only the person1 dictionary of the "`mymodule`" module?
	- `from mymodule import person1`
## Dates
- (1) Consider the following code. Which syntax will print the current date?
```python
import datetime
x = datetime.datetime

# Solution
print(x.now())
```
- (2) Consider the following code. Which syntax will print the name of the weekday?
```python
import datetime
x = datetime.datetime.now()

# Solution
print(x.strftime('%A'))
```
- (3) When formatting date objects into readable strings, which syntax is used to return the month name, full version?
	- `print(x.strftime('%B'))`
- (4) Consider the following code. What will be the printed result?
```python
import datetime
x = datetime.datetime(2024, 8, 20)
print(x.strftime('%d')) # 20
```
## Math
- (1) Consider the following code. What will be the printed result?
```python
print(max(5, 10, 25)) # 25
```
- (2) Consider the following code. What will be the printed result?
```python
print(pow(2, 3)) # 8
```
- (3) When using the built-in math module, what will be the printed result of the following code
```python
import math
print(math.sqrt(9)) #3
```
- (4) When using the built-in math module, how can you return the number of PI?
	- `math.pi`
## JSON
- (1) When you parse code with the json.loads() method, the result is returned as a specific Python data type, which one?
	- `dictionary`
- (2) Which method from the json library can be used to convert a Python object into a JSON string?
	- `json.dumps()`
- (3) The json.dumps() method has a keyword parameter used to sort the result, what is it called?
	- `sort_keys`
## RegEx
- (1) Consider the following code. What will be the printed result?
```python
import re
txt = 'The rain in Spain'
x = re.findall('[a-c]', txt)
print(x) # ['a', 'a']
```
- (2) Consider the following code. What will be the printed result?
```python
import re
txt = 'The rain in Spain'
x = re.search('a', txt)
print(x.start()) # 5
```
- (3) Consider the following code. What will be the printed result?
	- #question How is the solution 3?
```python
import re
txt = 'The rain in Spain'
x = re.search('\s', txt)
print(x.start()) # 3
```
- (4) When using the `re` module to find a match, a match will return a Match object, but what is the return value when there is no match?
	- None
## PIP
- (1) In the world of Python, what describes PIP best?
	- PIP is a package manager for Python modules
- (2) What is a correct way of importing the array module?
	- `import array`
- (3) In Command Line view, what is a correct statement for listing all the packages installed on your system?
	- `pip list`
## Try Except
- (1) In a try...except block, there is a certain block that if specified, will be executed regardless if the try block raises an error or not. What is the name of this block?
	- `finally`
- (2) Fill in the missing code in this try...except example
```python
try:
	print(x)
except:
	print("An exception occurred")
```
- (3) Fill in the missing code in this try...except example, the last code block should be executed if there are no errors
```python
try:
	print("Hello")
except:
	print("Something went wrong")
else:
	print("Nothing went wrong")
```
## User Input
- (1) in Python 3.6 and newer, what is the name of the method used to ask for user input?
	- `input()`
- (2) True or False. The input method is only available when working with HTML forms.
	- False
- (3) True or False. Python stops executing when it comes to the input function, and continues when the user has given some input.
	- True
## String Formatting
- (1) What placeholders are used when dealing with f-strings?
	- {}
- (2) Use the price variable and f-string syntax to display the price with two decimals
```python
price = 59
txt = f"The price is {price:.2f} dollars"
print(txt)
```
- (3) Use an if statement inside the f-string placeholders to return 'perfect' if the price is 100, and 'ok' if the price is not 100
```python
price = 100
txt = f"It is {'perfect' if price == 100 else 'ok'}"
print(txt)
```
- (4) Consider the following code. What will be the printed result?
```python
price = 1000
txt = f'The price is {price:,} dollars'
print(txt) # The price is 1,000 dollars
```
## File Handling
- (1) What is a function used for opening files?
	- `open()`
- (2) By default the file is opened in text mode, but you can also open the file in binary mode. Which one of the following syntaxes opens the file in binary mode?
	- `x = open('demofile.txt', 'b')`
- (3) True or False. The default opening mode when opening a file with the open() function is 'r' for 'reading'.
	- True
## Open File
- (1) After opening a file with the open() function, which method can be used to read the content?
	- `read()`
- (2) To read only one line, we can use another method, which one?
	- `readline()`
- (3) True or False. If you call the `readline()` method two times, it will return the two first lines.
	- True
## Write to File
- (1) What happens to the original file content if you open a file like this:
```python
f = open('demofile3.txt', 'w')
# The original content will be overwritten
```
- (2) If you open a file like this. What happens if the file does not exist?
```python
f = open('demofile3.txt', 'w')

# A file will be created
```
- (3) Consider this code. What could you replace the 'w' with to instead return an error if the file already exists?
```python
f = open('demofile3.txt', 'w')

# Return 'x'
```
## Remove File
- (1) To remove a file you can import the os module, but which function removes the file?
	- `os.remove()`
- (2) Which `os` function can be used to delete an entire folder?
	- `os.rmdir()`
- (3) True or False. To remove a folder with the `os` module, it cannot contain any files
	- True

