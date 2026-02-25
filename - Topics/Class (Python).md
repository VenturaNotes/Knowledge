---
aliases:
  - class
  - classes
---
## Synthesis
### Description 1
#### Creation
```python
# Creating a class
class MyClass:
	x = 5

# Create object of class
p1 = MyClass()

# Use p1 object to print value of x
print(p1.x)
```
- #comment The p1 object is of type `<class '__main__.MyClass'>` 
	- #question How to interpret this type? 
#### Definition
- A class is a template for creating objects. Defines a set of attributes and methods 
- #question What kind of classes are there. Given `rng = range(50)`, it seems like `type(rng)` is a class. What other types of classes are there? 
### Description 2
- In a class, [[__init__() (python)|__init__()]] is considered a method, specifically an instance method
	- #question What is an instance method? 
#### Definition
- A class is a blueprint or template for creating objects. It defines a set of [[attribute (Python)|attributes]] and [[method (Python)|methods]] that the objects (instances) created from the class will have.
	- #question Are objects and instances synonymous or are they different? 
- Body of class contains methods and attributes
- Purpose: Provides a means of bundling data and functionality together
	- #question Is C an OOP language? And if not, how does C handle objects in which Python could do?
- A class defines a type of [[object (Python)|object]], including attributes and methods
	- #question What is meant by 'a type of object'
#### Key Concepts

##### Definition
- Class defined using `class` keyword followed by class name and colon
- Class body contains method definitions and class attributes
##### Attributes
- Variables that belong to class or instances of class
- [[class attributes (Python)|class attributes]] defined directly within class are shared among all instances of class
- [[Instance Attribute (Python)|instance attribute]] are specific to each instance of the class
##### Methods
- #question What are some details about methods?

#### Instantiating and Initializing
```python
class Dog:
    def __init__(self, name):
        self.name = name

# Step 1: Instantiate -> __new__ creates the Dog object
# Step 2: Initialize -> __init__ sets dog.name
d = Dog("Fido")
```
- #question What does the `__new__()` method look like? 
## Source [^1]
```python
# Creating a class
class MyClass:
	x = 5

# Create object of above class
p1 = MyClass()

# Use p1 object to print value of x
print(p1.x)

# Assigning an "init" function to a class
class Person:
	def __init__(self, name, age):
		self.name = name
		self.age = age

```
#question What are some things that I should know about classes and should always consider / never forget about
#question How does the [[__init__() (python)|__init__()]] function work in a class? What is its entire purpose?
#question What does the [[self (python)|self]] keyword mean? Why is it required for `__init__` for example? 
#question is there a "super" kind of keyword in python as well? I think Java may have this
## Source[^2]
```python
class Truth:
	pass
x = Truth()
print(bool(x))
```
- If a class does not implement a `__bool__()` or `__len__()` method, then all its instances are considered true by default, so `bool(x)` returns True.
	- #question What if you return `True`? Will that make a class `True`?
## References

[^1]: https://www.w3schools.com/python/exercise.asp?filename=exercise_classes1
[^2]: [[(Home Page) Python MCQ by Sanfoundry]]