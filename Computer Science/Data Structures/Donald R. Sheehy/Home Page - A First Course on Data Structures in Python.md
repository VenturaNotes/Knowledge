---
Source:
  - https://donsheehy.github.io/datastructures/
  - zotero://open-pdf/library/items/HQW8R6QS?page=1&annotation=YSUJDBY2
Length: "222"
Progress: "44"
tags:
  - status/incomplete
  - type/textbook
  - temp
---
## (1) Overview
- Topics
	- Problem Solving
	- Data structures
	- Algorithms
- Book is not a reference
- Meant to worked through from beginning to end
## (2) Basic Python
- Mental model for programming
	- Sequence
	- Selection
	- Iteration
### (2.1) Sequence, Selection, and Iteration
- Model for imperative programming
	- [[Sequence]] ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=11&annotation=CDEZH5Q5))
		- “Performing operations one at a time in a specified order” 
	- [[Selection]] ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=11&annotation=DFAK86VG))
		- “Using conditional statements such as if to select which operations to execute.” 
	- [[Iteration]] ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=11&annotation=LTFTTJ7X))
		- “Repeating some operations using loops or recursion.” 
### (2.2) Expressions and Evaluation
- Arithmetic
	- 2 + 2 is a simple arithmetic <mark style="background: #FFF3A3A6;">expression</mark>
		- Expressions get <mark style="background: #FFF3A3A6;">evaluated</mark> and produce a <mark style="background: #FFF3A3A6;">value</mark>
	- 5 > 7
		- expression evaluates to the <mark style="background: #FFF3A3A6;">boolean</mark> value <mark style="background: #FFF3A3A6;">False</mark>
- Operator precedence
	- Order of operations in programming
	- Example
		- $5 * (3+ abs(-12) / 3)$ 
		- Order executed
			- `abs, /, +, *`
### (2.3) Variables, Types, and State
- [[State]]
	- Stored information
- [[variables (python)|variables]]
	- Information is stored
- [[Assignment]]
	- Variable is created by an assignment statement
		- `variable_name = some_value`
		- Equal sign is "doing" not describing
		- Right side gets evaluated first, then assignment
- Shorthand for evaluations
	- x+= 1, 
		- `-=, *=, /=`
- Assigning 2 variables 
	- `x = y = 1`
- Check if 2 objects are the same using the <mark style="background: #FFF3A3A6;">is</mark> keyword
```python
x = [1, 2, 3]
y = x
z = [1, 2, 3]

print(x is y)
print(x is z)
print(x == z)

True
False
True
```
- Strings are immutable
- Atomic types in python are 
- Represent infinity
	- `float('inf')`
- Atomic types in Python are integers, floats, and booleans
### (2.4) Collections
- Important types in python
	- Strings, lists, tuples, dictionaries, and sets
- There are other examples of [[collections]]
#### (2.4.1) Strings (str)
- “Strings are sequences of characters and can be used to store text of all kinds.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=15&annotation=58XESX7Z))
- “you can concatenate strings to create a new string using the plus sign.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=15&annotation=VF5KTNC7))
- “You can also access individual characters using square brackets and an index.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=15&annotation=CKSY8TJZ))
- Immutable
```python
s = "oooooooo"
s[4] = "x"

# Does not support item assignment
```
#### (2.4.2) Lists (list)
- Mutable
- Ordered sequence of objects
- Objects do not need to have the same type. 
- “They are indicated by square brackets and the elements of the list are separated by commas.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=16&annotation=LPFUK4JL))
- Can append item to end of list
	- `L.append(newitem)`
- `ds2.figs` is a potential way for creating graphics?
```python
from ds2.figs import drawlist
L = [1, 2, "skip", "a", "few", 99, 100]
drawlist(L, 'list03')
```
- ![[Pasted image 20230117162017.png]]

#### (2.4.3) Tuples (tuple)
- Immutable
- Ordered sequences of objects
- Example
	- `t = (1, 2, "skip a few" 99, 100`)
- No attribute "append" nor supports item assignment
#### (2.4.4) Dictionaries (dict)
- Stores key-value pairs
- Example
- ![[Pasted image 20230117162442.png]]
- “Keys can be different types, but they must be immutable types such as atomic types, tuples, or strings.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=19&annotation=7D3WIUI2))
- “Dictionaries are also known as [[maps]], <mark style="background: #FFF3A3A6;">mappings</mark>, or [[Hash Table|hash tables]].” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=19&annotation=VYPDESP2))
- “A dictionary doesn’t have a fixed order.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=19&annotation=QNMTQWBJ))
- “If you assign to a key that’s not in the dictionary, it simply creates a new item. If you try to access a key that’s not in the dictionary, you will get a KeyError.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=19&annotation=ZYINV2HJ))
- nonsequential collection
#### (2.4.5) Sets (set)
- “They are collections of objects without duplicates.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=19&annotation=TRA7U43L))
- “curly braces to denote them and commas to separate elements.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=19&annotation=B9CFD93I))
- No fixed ordering
- Nonsequential Collection
- “empty braces indicates an empty dictionary and not an empty set.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=19&annotation=RQDPVRRR))
- “If you want an empty set, you would write set().” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=20&annotation=VS7DWEKA))
- Example
	- ![[Pasted image 20230117163450.png]]

### (2.5) Some common things to do with collections
- `len`
	- Finds the number of elements in a collection
- List of most popular collections
	- ![[Pasted image 20230117164605.png]]
		- First is string
		- Second is list
		- Third is tuple
		- Fourth is dictionary
		- Fifth is set
- “you can slice a subsequence of indices using square brackets and a colon as in the following examples.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=20&annotation=EN9U8YXI))
- “you can slice a subsequence of indices using square brackets and a colon as in the following examples.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=20&annotation=EN9U8YXI))
- ![[Pasted image 20230117165147.png]]
	- `a[3:7]`
		- takes the 3rd index and the 6th index
	- `a[1:-2]`
		- Takes the first index and the 3rd to last index
	- `b[1:]`
		- First index until the end
	- `c[:2]`
		- 0th index to the 1st index
	- 
### (2.6) Iterating over a collection
- loop a list
```python
for item in mylist:
	print(item)
```
- loop a tuple
```python
for item in mytuple:
	print(item)
```
- loop a set
```python
for item in myset
	print(element)
```
- loop a string
```python
for character in mystring:
	print(character)
```
- loop a dictionary
```python
for key in mydict:
	print(key)

#OR

for key, value in mydict.items():
	print(key, value)

#OR

for value in mydict.value():
	print(value)
```
- Range is used to represent a sequence of numbers
```python
for i in range(10):
	j = 10 * i + 1
	print(j, end='')

#Output
# 1 111 21 31 41 51 61 71 81 91
```
### (2.7) Other Forms of Control Flow
- “Control flow refers to the commands in a language that affect the order in which operations are executed.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=22&annotation=R72UBJ8W))
- “The other basic forms of control flow are if statements, while loops, try blocks, and function calls.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=22&annotation=UG8S33BH))
- “This expression is referred to as a predicate.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=22&annotation=US92UQWX))
- “Notice that there is no requirement that we specify the types of objects a function expects for its arguments.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=24&annotation=8S28KPXA))
- “If we define a function twice, even if we change the parameters, the first will be overwritten by the second.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=24&annotation=8PIFTFWK))
	- Exactly the same as as assigning to a variable twice
- “The name of a function is just a name; it refers to an object (the function).” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=24&annotation=P2BUVZWG))
- “Functions can be treated like any other object.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=24&annotation=Y72IPV27))
	- ![[Pasted image 20230117170710.png|400]]
	- Here, foo is treated like any other object.
### (2.8) Modules and Imports
- “A single .py file is called a [[module]].” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=25&annotation=RX2GZBHU))
- “You can import one module into another using the [[import]] keyword.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=25&annotation=PR6BBTT2))
- “When we import a module, the code in that module is executed. Usually, this should be limited to defining some functions and classes, but can technically include anything.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=25&annotation=HYR52ZPI))
- “The module also has a namespace in which these functions and classes are defined.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=25&annotation=92THK6GI))
- Exponents in python
	- `4**2`
		- This equals 16
- If you have a module such as `test.py`, coding `print(__name__)` then this attribute is set automatically to `__main__`. However, if I imported `test.py` in `test2.py` without writing any extra code for `test2.py`, it will return the module name `test` rather than `__main__`
- Message is printed only when the module is executed as a script
```python
def somefunction():
	print("Real important stuff here.")
if __name__ == "__main__":
	somefunction()

'''
Output:

Real important stuff here
'''
```
- “One caveat is that modules are only executed the first time they are imported” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=26&annotation=AJ3RTGAD))
- Variations of import statement
	- `from modulename import thethingIwanted`
		- Brings the name `thethingIwanted` into the name space without needing to precede it by `modulename` and a dot
	- `from modulename import *`
		- Imports all the names from the module into the current namespace
		- Frowned upon though
	- `import numpy as np`
		- allows you 
		- “One caveat is that modules are only executed the first time they are imported” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=26&annotation=AJ3RTGAD))
## (3) Object-Oriented Programming
- “A primary goal of object-oriented programming is to make it possible to write code that is close to the way you think about the things your code represents.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=29&annotation=AERTMM4M))
- Allows you to check the type of object you made.
	- ![[Pasted image 20230117173408.png]]
		- `isinstance`
- A [[class (Computer Science)|class]] is a data type
- An [[object]] is an [[instance]] of a class
- [[Generator]] example
	- “In Python you can yield instead of return.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=30&annotation=MKXMYY5W))
	- “the result will be something called a [[Generator]] and not a function” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=30&annotation=8IZR2DAH))
- Class `function` exists in python
- Preview:
```python
def mygenerator(n):
    for i in range(n):
        yield i
print(type(mygenerator))
print(type(mygenerator(5)))

'''
Output:

<class 'function'>
<class 'generator'>
'''

```
- Printing `mygenerator(5)` will return the object `mygenerator` and give the address
### (3.1) A simple example
- Creating a vector in python
```python
class Vector:
    def __init__(self,x,y):
        try:
            self.x = float(x)
            self.y = float(y)
        except ValueError:
            self.x = 0.0
            self.y = 0.0
    
    def norm(self):
        return (self.x ** 2 + self.y ** 2) ** 0.5
    
    def __add__(self, other):
        newx = self.x + other.x
        newy = self.y + other.y
        return Vector(newx, newy)
    
    def __str__(self):
        return "(%f, %f)" %(self.x, self.y)

u = Vector(3,4)
v = Vector(3,6)

print(u + v)

'''
Output:

(6.000000, 10.000000)
'''
```
- A function defined in a class is called a [[method]]
	- "norm" is a method for the class "Vector"
- It is standard convention to use "self" as the name of the first parameter to a method
	- The parameter "self" is an object which will be operated on by the method
	- This means `u.norm()` = `vector.norm(u)`
	- The self refers to the object you created of the Class "Vector"
		- So u and v are both objects of class "Vector"
- “Methods like this one that start and end with two underscores are sometimes called the magic methods or also dunder methods.”
	- `__init__`
- “calling the name of the class as a function invokes the initializer.”
	- Example is `float("3.14159")`
		- Initializer probably turns it into a float
- The `__add__` method ensures you're able to add 2 objects together implicitly
- The `__str__` method will make sure it's printed as a string. This function will be invoked when doing `print()` or `str()` [^1]
### (3.2) Encapsulation and the Public Interface of a Class
- Encapsulation (Two separate definitions)
	- The idea of encapsulating or combining into a single thing, data and the methods that operate on that data. In Python, this is accomplished via classes
	- Emphasizes the boundary between the inside and the outside of the class, specifying what is visible to the users of a class.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=34&annotation=7WXZMCGT))

- “Any attribute that starts with an underscore is considered private.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=34&annotation=DXZHLQQA))
- “The collection of all public attributes (in this case, addentry and title) constitute the [[public interface]] of the class.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=34&annotation=MUD7B4WQ))
```python
class Diary: 
    def __init__(self, title):
        self.title = title
        self._entries = [] 

    def addentry(self, entry): 
        self._entries.append(entry) 

    def _lastentry(self): 
        return self._entries[-1]

diary = Diary("Mytitle")
diary.addentry("This is so funny")
print(diary.title)
```
- You can still use the method `_lastentry` without error when running the module, but you are note supposed to by convention. This is to ensure other parts of the program don't break if you were to change the `_entries` name.
- “The reason to respect the private attributes and stick to the public interface is really to help us write working code that continues to work in the future.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=35&annotation=EXDFGAL6))
### (3.3) Inheritance and is a relationships
- “These are obviously, very closely related classes. One can make another class for which these two classes are [[subclasses]]. Then, anything common between the two classes can be put into the larger class or [[superclass]].” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=36&annotation=WEYXQCEE))
```python
class Polygon: 
    def __init__(self, sides, points): 
        self._sides = sides 
        self._points = list(points) 
        if len(self._points) != self._sides: 
            raise ValueError("Wrong number of points.") 
    def sides(self): 
        return self._sides 

class Triangle(Polygon): 
    def __init__(self, points): 
        Polygon.__init__(self, 3, points) 
    def __str__(self): 
	    return "I'm a triangle." 

class Square(Polygon): 
    def __init__(self, points): 
        Polygon.__init__(self, 4, points) 
    def __str__(self): 
	    return "I'm so square."
```
- "Polygon" is the [[superclass]] while "Triangle" and "Square" are [[subclass|subclasses]]
- “Notice that the class definitions of Triangle and Square now indicate the Polygon class in parentheses.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=36&annotation=TZRL93AC))
	- “This is called [[inheritance]].” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=36&annotation=W6PP5EAV))
	- “The Triangle class<mark style="background: #FFF3A3A6;"> inherits from</mark> (or [[extends]]) the Polygon class.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=36&annotation=LSIQ9S6W))
- “This search for the correct function to call is called the [[method resolution order]].” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=37&annotation=RNNQBGC4))
	- "When we call a method on an object, if that method is not defined in the class of that object, Python will look for the method in the superclass
	- “If a method from the superclass is redefined in the subclass, then calling the method on an instance of the subclass calls the subclass method instead.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=37&annotation=PD2AXLEE))
- “The initializer of the superclass is not called automatically when we create a new instance (unless we didn’t define init in the subclass). In this case, we manually call the Polygon. init function.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=37&annotation=9ERW697M))
- “Inheritance means <mark style="background: #FFF3A3A6;">is a</mark>.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=37&annotation=LUFMSN6F))
- “Duplication is very bad.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=37&annotation=BAW457BD)
- “Software engineers use the acronym [[DRY]], to mean Don’t Repeat Yourself.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=37&annotation=BASE9Y36))
- “The process of removing duplication by putting common code into a superclass is called [[factoring out a superclass]]” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=37&annotation=8KSSQTM3))
### (3.4) Duck Typing
```python
class PolygonCollection:
    def __init__(self):
        self._triangles = []
        self._squares = []
    def add(self, polygon):
        if polygon.sides() == 3:
            self._triangles.append(polygon)
        if polygon.sides() == 4:
            self._squares.append(polygon)
    def __str__(self):
        return "Squares: " + str(len(self._triangles)) + " Triangles: " + str(len(self._squares))

class Triangle:
    def __init__(self, ponits):
        self._sides = 3
        self._points = list(ponits)
        if len(self._points) != 3:
            raise ValueError("Wrong number of points.")
    def sides(self):
        return 3
    def __str__(self):
        return "I'm a triangle."

class Square:
    def __init__(self, points):
        self._sides = 4
        self._points = list(points)
        if len(self._points) != 4:
            raise ValueError("Wrong number of points.")
    def sides(self):
        return 4    
    def __str__(self):
        return "I'm so square"
    

mytriangle = Triangle((0,1,2))
mysquare = Square((1,2,3,4))

hello = PolygonCollection()
hello.add(mytriangle)
hello.add(mysquare)

print(hello)


''' Output
Squares: 1 Triangles: 1
'''
```
- Description of code above
	- We use polymorphism here to add any kind of shape to the polygon collection. It will work as long as the <mark style="background: #FFF3A3A6;">argument</mark> has a "sides" <mark style="background: #FFF3A3A6;">method</mark> which returns an integer.
	- [[(Video) Python - Object Oriented Programming - Polymorphism|Polymorphism can also be used alongside inheritance]]
	- Also, you can't write `hello = PolygonCollection().add(mytriangle)` in one line because you are assigning the return value of the add() method to `hello` rather than assigning it to an object of the `PolygonCollection()` class
- “The reason is that Python has built-in (parametric) polymorphism.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=37&annotation=K34E6ZFX))
	- “we can pass any type of object we want to a function.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=37&annotation=RIUJ9AHW))
- Add method of class "PolygonCollection" works well with any object with method "sides"
- “Python’s polymorphism is based on the idea of duck typing.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=38&annotation=NVIT7AML))
	- “Having the right methods is equivalent to ”walking and talking like a duck”.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=38&annotation=95U7Q28B))
- “As long as we implemented the str method on our class, then we can call str on an instance of that class.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=38&annotation=AGZUASEV))
	- “That function calls the corresponding method, i.e., str(t) for a Triangle t calls t. str () which is equivalent to Triangle. str (t).” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=38&annotation=88TTHWNZ))
### (3.5) Composition and "has a" relationships
```python
class MyLimitedList:
    def __init__(self):
        self._L = []
    def append(self, item):
        self._L.append(item)
    def __getitem__(self, index):
        return self._L[index]

L = MyLimitedList()
L.append(1)
L.append(10)
L.append(100)
print(L[2])

""" Output
100
"""
```
- Composition
	- One class stores an instance of another class
	- Objects of different types share some functionality
	- Rule
		- [[Composition]] <mark style="background: #FFF3A3A6;">means "has a "</mark>
	- "In composition, a class known as composite contains an object of another class known to as component. In other words, a composite class has a component of another class." [^2]
- Creating a class that behaves like a list
	- “we’d like to be able to append to the list and access items by their index,” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=39&annotation=VLA87EMP)) That's it.
	- Make class store a list internally.
	- “making calls to the stored list instance to avoid duplicating the list implementation.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=39&annotation=DEBMH92Q))
	- The public interface ("Public interface of linked list class" means only public methods of the LinkedList class. [^3]) 
- “Here, the magic method getitem will allow us to use the square bracket notation with our class. As with other magic methods, we don’t call it directly.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=39&annotation=KZJYEQR9))
## (4) Testing
- “Python is an interpreted language.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=41&annotation=NYKXIP9R))
- Objectives for tests
	- “<mark style="background: #FFF3A3A6;">Does it work? </mark>That is, does the code do what it’s supposed to do?” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=41&annotation=YGLNPMY7))
	- “<mark style="background: #FFF3A3A6;">Does it still work?</mark> Can you be confident that the changes you made haven’t caused other part of the code to break?” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=41&annotation=ZGA3BDBB))
### (4.1) Writing Tests
- “Testing your code means writing more code that checks that the behavior matches your expectations.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=41&annotation=GFF67397))
	- “Test behavior, not implementation.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=41&annotation=DNS5CVZE))
```python
class Doubler:
    def __init__(self, n):
        self._n = 2*n
    def n(self):
        return self._n

if __name__ == '__main__':
    x = Doubler(5)
    assert(x.n() == 10)
    y = Doubler(-4)
    assert(y.n() == -8)

"""
If the assertion is false, you will get an assertion error in terminal
"""
```
- “The [[assert statement]] will raise an error if the predicate that follows it is False.”
	- Better than writing print statements
- “Deleting tests after they pass is a very bad idea.”
-  “The line if name == ’ main ’: makes sure that the tests will not run when the module is imported from somewhere else.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=42&annotation=UH39H3D7))
- “If you feel the slightest hesitation to testing your own code, you should practice the [[OGAE]] protocol. It stands for, <mark style="background: #FFF3A3A6;">Oh Good, An Error!</mark>.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=42&annotation=M92GWK57))
### (4.2) Unit Testing with unittest
- “The word unit in unit testing is meant to imply a single indivisible case.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=42&annotation=JAXGCSD8))
	- “Thus, unit tests are supposed to test a specific behavior of a specific function” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=42&annotation=JTYMG2FP))
- “To make the process go smoothly, there is a standard package called [[unittest]] for writing unit tests in Python.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=42&annotation=X4YVURSD))
	- Provides standard way to write tests
	- Ability to run tests together
	- Ability to see results of tests in a clear format
- In modern software engineering, tests are also run automatically as part of build and deployment systems.
```python
import unittest
from dayoftheweek import DayOfTheWeek

class TestDayOfTheWeek(unittest.TestCase):
    def testinitwithabbreviation(self):
        d = DayOfTheWeek('F')
        self.assertEquals(d.name(), 'Friday')

        d = DayOfTheWeek("Th")
        self.assertEquals(d.name(), "Thursday")

unittest.main()
# The dayoftheweek is a hypothetical module where DayOfTheWeek is a hypothetical class
```
- “To use the unittest package” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=43&annotation=J26ZGXNV))
	- “import the package in your test file.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=43&annotation=GEXFGDUX))
	- “Then, import the code you want to test.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=43&annotation=ERPGEN37))
	- “The actual tests will be methods in a class that extends the unittest.TestCase class.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=43&annotation=LAHBCGEM))
		- The TestCase class is used to test any kind of cases you need (not just checking if a letter is uppercase or lowercase)
	- “Every <mark style="background: #FFF3A3A6;">test method </mark>must start with the word ’<mark style="background: #FFF3A3A6;">test</mark>’.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=43&annotation=ZX829FPG))
	- “Tests are run by calling the unittest.main function.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=43&annotation=FIPFUJMJ))
- We can get a good sense of the class's expected behavior from reading the tests
- “With documentation, one sometimes finds that changes in the code are not reflected in the documentation, but passing tests don’t have this problem.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=43&annotation=EM2F2R48))
### (4.3) Test-Driven Development
#### Explanation
- [[Test-Driven Development]]
	- “write the tests before you write the code.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=43&annotation=A6SYDBLN))
	- Benefits
		- How to use function, what parameters should be, what should be returned
		- Write only code you need
			- If there is code that doesn't support some desired behavior with tests, don't write it
- TDD mantra is [[Red-Green-Refactor]]. “refers to three phases of the testing process.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=44&annotation=KWLSJS7I))
	- “Red: The tests fail. They better! You haven’t written the code yet!” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=44&annotation=QIGD7PFN))
	- “Green: You get the tests to pass by changing the code.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=44&annotation=ILP3QTXU))
	- “[[Refactor]]: You clean up the code, removing duplication.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=44&annotation=9CSZVKHJ))
- “Red and Green refer to many testing frameworks that show failed tests in red and passing tests in green.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=44&annotation=PHGXGPXS))
- “Refactoring is the process of cleaning up code, most often referring to the process of removing duplication” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=44&annotation=F8V3STR8))

#### Example
##### Before Refactoring
```python
if len(L1) == 0:
	avg1 = 0
else:
	avg1 = sum(L1) / len(L1)

if len(L2) == 0:
	avg2 = 0
else:
	avg2 = sum(L2) / len(L2)
```
- If we want to handle another exception, we would need to modify both if statements
##### After Refactoring
```python
def avg(L):
	if len(L) == 0:
		return 0
	else:
		return sum(L) / len(L)

avg1 = avg(L1)
avg2 = avg(L2)
```
- Refactored code makes it easier to read
### (4.4) What to Test
- Think
	- What should happen when code is run
	- How I want to.use code
- Specifics
	- Write tests that use code the way it should be used
	- Write tests that use code incorrectly to test code fails gracefully (gives clear error messages)
	- “Test the [[edge case|edge cases]], those tricky cases that may rarely come up. Try to break your own code.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=45&annotation=2JZQQVWM))
	- “Turn bugs into tests.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=45&annotation=BK5ATMFQ))
		- “Write a specific test to reveal the bug, then fix it.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=45&annotation=8VTE3TEV))
	- “Test the [[public interface]].” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=45&annotation=2NF959KW))
		- “don’t need to or want to test the private methods of a class.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=45&annotation=R3TLHT25))
		- “should treat the test code as a user of the class and it should make no assumptions about private attributes.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=45&annotation=ILYPRVR9))
			- “if a private gets renamed or refactored, you don’t have to change the tests.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=45&annotation=R5VEFD34))
### (4.5) Testing and Object-Oriented Design
- “In [[object-oriented design]], we divide the code into classes”
	- “These classes have certain relationships sometimes induced by [[inheritance]] or [[composition]].” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=46&annotation=Y7VC6H7K))
	- “The [[class (Computer Science)|classes]] have [[public method|public methods]].” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=46&annotation=TVQIYSD2))
		- “We call these public methods the [[interface]] to the class.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=46&annotation=U9G7WHNW))
- “To start a design, we look at the problem and identify nouns ([[class (Computer Science)|classes]]) and verbs ([[method|methods]]).” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=46&annotation=PLLI4J6T))
	- “In our description, we express what should happen.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=46&annotation=VW6PJZPI))
		- “expectations are expressed in if...then language,” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=46&annotation=P7RRIFMN))
		- “If I call this method with these parameters, then this will happen.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=46&annotation=GZTXYJL8))
			- “[[unit test]] will encode this expectation.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=46&annotation=XJRL2KHX))
				- “check that the actual behavior of the code matches the expected behavior.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=46&annotation=T5REJ54X))
- Test each class individually. Then when we compose classes into more complex classes, we have more confidence that any errors found are in the new class
	- “any small savings in time you might reap early on by skipping tests will very quickly be spent in the headaches of countless hours debugging untested code.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=46&annotation=N96TIJHJ))
		- “Being careful and systematic will take you substantially less time overall. It is faster to go slow.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=46&annotation=3BEB8HVV))
## (5) Running Time Analysis
- Goal of programming
	- Write code that is correct, efficient and readable
- “We want to give a nuanced description of the efficiency of a program that adapts to different inputs and to different computers.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=47&annotation=2TJ6M9A9))
	- “We will achieve both goals with [[asymptotic analysis.]]” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=47&annotation=8P9248EU))
		- “we will start by measuring the time taken to run some programs.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=47&annotation=CH5A2RHP))
		- “Next, we will give an accounting scheme for counting up the [[cost]] of a program.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=47&annotation=5C6N2J38))
			- “The cost of the whole program will be the sum of the costs of all the operations executed by the program.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=47&annotation=3FRRTEMN))
		- “cost will be a function of the input size, rather than a fixed number.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=47&annotation=D5EGTQPS))
- “we will introduce some vocabulary for classifying functions. This is the asymptotic part of asymptotic analysis.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=48&annotation=IAPSK9BM))
	- “[[big-O notation]] gives a very convenient way of grouping this (running time) functions into classes that can easily be compared.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=48&annotation=LET2RPGJ))
		- “we’ll be able to talk about and compare the efficiency of different algorithms or programs” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=48&annotation=UDXJYCL3))
### (5.1) Timing Programs
- “let’s observe some differences in [[running time]] for different functions that do the same thing.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=48&annotation=QEHA44L3))
	- #question what is running time again?
	- “We might say these functions have the same behavior or the same [[semantics]].” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=48&annotation=2BZCZNXL))
- Program that checks for duplicates in list
```python
def duplicates1(L):
	n = len(L)
	for i in range(n):
		for j in range(n):
			if i != j and L[i] == L[j]:
				return True
	return False
assert(duplicates1([1, 2, 6, 3, 4, 5, 6, 7, 8]))
assert(not duplicates1([1, 2, 3, 4]))
```
- #comment No output.  If there was an error, you'd get "[[AssertionError (python)|AssertionError]]"
- #comment 
	- It basically iterates through the list twice and checks if there is a duplicate or not.

- Testing time
```python
import time
for i in range(5):
	n = 1000
	start = time.time()
	
	#This creates a list of length 1000 from 0 to 999
	duplicates1(list(range(n)))
	
	timetaken = time.time() - start
	print("Time tanken for n = ", n, ": ", timetaken)
```
- My Output:
```
Time tanken for n =  1000 :  0.03532910346984863
Time tanken for n =  1000 :  0.027051925659179688
Time tanken for n =  1000 :  0.024773120880126953
Time tanken for n =  1000 :  0.024374961853027344
Time tanken for n =  1000 :  0.024152040481567383
```
- Causes for time variation
	- Computer performs many other tasks at the same time
		- Running an [[operating system]]
		- Several other programs
	- Different computers 
		- Difference caused by [[processor]] speed
- Finding averages
```python
import time
def timetrials(func, n, trials = 10):
	totaltime = 0
	for i in range(trials):
		start = time.time() #it should be here
		func(list(range(n)))
		totaltime += time.time() - start
	print("average =%10.7f for n = %d" % (totaltime/trials, n))

for n in [50, 100, 200, 400, 800, 1600, 3200]:
	timetrials(duplicates1, n)
```
- #comment
	- For "%10.7f" 
		- This formats a floating-point number specifying that the number should take up at least 10 characters in total including 7 digits after the decimal point. If the number is shorter than 10 characters, spaces are added to the left. This means, the output would look less neat like
			- `average =50.0000000 for n = 50` if we had a number in the tens place
	- For "%d"
		- This formats an integer `n`
- Output
```
average = 0.0000819 for n = 50
average = 0.0003012 for n = 100
average = 0.0010852 for n = 200
average = 0.0039598 for n = 400
average = 0.0151039 for n = 800
average = 0.0613956 for n = 1600
average = 0.2495723 for n = 3200
```
- Clearly we see the time getting longer as length `n` increases
- “In the duplicates1 function, we are comparing each pair of elements twice because both i and j range over all n indices.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=50&annotation=9FNNQ3BI))
	- “We can eliminate this using a standard trick of only letting j range up to i.” ([pdf](zotero://open-pdf/library/items/HQW8R6QS?page=50&annotation=BE4HHZD9))
- Improved code
```python
def duplicates2(L):
	n = len(L)
	for i in range(1, n):
		for j in range(i):
			if L[i] == L[j]:
				return True
	return False
for n in [50, 100, 200, 400, 800, 1600, 3200]:
	timetrials(duplicates2, n)
```
- Output
```
average = 0.0000282 for n = 50
average = 0.0001032 for n = 100
average = 0.0003733 for n = 200
average = 0.0015321 for n = 400
average = 0.0061327 for n = 800
average = 0.0254295 for n = 1600
average = 0.1050217 for n = 3200
```

### (5.2) Example: Adding the first k numbers
###  (5.3) Modeling the Running Time of a Program
#### (5.3.1) List Operations
#### (5.3.2) Dictionary Operations
#### (5.3.3) Set Operations
### (5.4) Asymptotic Analysis and the Order of Growth
### (5.5) Focus on the Worst Case
### (5.6) Big-O
### (5.7) The most important features of big-O usage
### (5.8) Practical Use of the Big-O and Common Functions
### (5.9) Base for Logarithms
### (5.10) Practice examples
## (6) Stacks and Queues
### (6.1) Abstract Data Types
### (6.2) The Stack ADT
### (6.3) The Queue ADT
### (6.4) Dealing with errors

## (7) Deques and Linked Lists
### (7.1) The Deque ADT
### (7.2) Linked Lists
### (7.3) Implementing a Queue with a LinkedList
### (7.4) Storing the length
### (7.5) Testing Against the ADT
### (7.6) The Main Lessons
### (7.7) Design Patterns: The Wrapper Pattern
## (8) Doubly-Linked Lists
### (8.1) Concatenating Doubly Linked Lists
## (9) Recursion
### (9.1) Recursion and Induction
### (9.2) Some Basics
### (9.3) The Function Call Stack
### (9.4) The Fibonacci Sequence
### (9.5) Euclid's Algorithm
## (10) Dynamic Programming
### (10.1) A Greedy Algorithm
### (10.2) A Recursive Algorithm
### (10.3) A Memoized Version
### (10.4) A Dynamic Programming Algorithm
### (10.5) Another example
## (11) Binary Search
### (11.1) The Ordered List ADT
## (12) Sorting
### (12.1) The Quadratic-Time Sorting Algorithms
### (12.2) Sorting in Python
## (13) Sorting with Divide and Conquer
### (13.1) Mergesort
#### (13.1.1) An analysis
#### (13.1.2) Merging Iterators
### (13.2) Quicksort
## (14) Selection
### (14.1) The quickselect algorithm
### (14.2) Analysis
### (14.3) One last time without recursion
### (14.4) Divide-and-Conquer Recap
### (14.5) A Note on Derandomization
## (15) Mappings and Hash Tables
### (15.1) The Mapping ADT
### (15.2) A minimal implementation
### (15.3) The extended Mapping ADT
### (15.4) It's Too Slow!
#### (15.4.1) How many buckets should we use?
#### (15.4.2) Rehashing
### (15.5) Factoring Out A Superclass
## (16) Trees
### (16.1) Some more definitions
### (16.2) A recursive view of trees
### (16.3) A tree ADT
### (16.4) An implementation
### (16.5) Tree Traversal
### (16.6) If you want to get fancy
#### (16.6.1) There's a catch!
#### (16.6.2) Layer by Layer
## (17) Binary Search Trees
### (17.1) The Ordered Mapping ADT
### (17.2) Binary Search Tree Properties and Definitions
### (17.3) A Minimal implementation
#### (17.3.1) The floor function
#### (17.3.2) Iteration
### (17.4) Removal
## (18) Balanced Binary Search Trees
### (18.1) A BSTMapping implementation
#### (18.1.1) Forward Compatibility Factories
### (18.2) Weight Balanced Trees
### (18.3) Height-Balanced Trees (AVL Trees)
### (18.4) Splay Trees
## (19) Priority Queues
### (19.1) The Priority Queue ADT
### (19.2) Using a list
### (19.3) Heaps
### (19.4) Storting a tree in a list
### (19.5) Building a Heap from scratch, \_heapify
### (19.6) Implicit and Changing Priorities
### (19.7) Random Access
### (19.8) Iterating over a Priority Queue
### (19.9) Heapsort
## (20) Graphs
### (20.1) A Graph ADT

### (20.2) The EdgeSetGraph Implementation

### (20.3) The AdjacencySetGraph Implementation

### (20.4) Paths and Connectivity
## (21) Graph Search
### (21.1) Depth-First Search
### (21.2) Removing the Recursion
### (21.3) Breadth-First Search
### (21.4) Weighted Graphs and Shortest Paths
### (21.5) Prim's Algorithm for Minimum Spanning Trees
### (21.6) An optimization for Priority-First search

## (22) (Disjoint) Sets
### (22.1) The Disjoint Sets ADT
### (22.2) A Simple Implementation
### (22.3) Path Compression
### (22.4) Merge by Height
### (22.5) Merge by Weight
### (22.6) Combining Heuristics
### (22.7) Kruskal's Algorithm
## References
[^1]: https://www.digitalocean.com/community/tutorials/python-str-repr-functions
[^2]: https://realpython.com/inheritance-composition-python/#composition-in-python
[^3]: https://stackoverflow.com/questions/6076890/what-is-a-public-interface#:~:text=%22Public%20interface%20of%20linked%20list,and%20let%20your%20IDE%20suggest.