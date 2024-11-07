---
aliases:
  - class
  - classes
---
## Synthesis
- #question What kind of classes are there. Given `rng = range(50)`, it seems like `type(rng)` is a class. What other types of classes are there? 
## Source [^1]

### Definition
- A class is a blueprint or template for creating objects. It defines a set of [[attribute (Python)|attributes]] and [[method (Python)|methods]] that the objects (instances) created from the class will have.
- Body of class contains methods and attributes
- Purpose: Provides a means of bundling data and functionality together
- A class defines a type of [[object (Python)|object]], including attributes and methods

### Key Concepts

#### Definition
- Class defined using `class` keyword followed by class name and colon
- Class body contains method definitions and class attributes
#### Attributes
- Variables that belong to class or instances of class
- [[class attributes (Python)|class attributes]] defined directly within class are shared among all instances of class
- [[Instance Attribute (Python)|instance attribute]] are specific to each instance of the class

#### Methods

## Source [^2]
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
#question How does the [[__init__() python|__init__()]] function work in a class? What is its entire purpose?
#question What does the [[self (python)|self]] keyword mean? Why is it required for `__init__` for example? 
#question is there a "super" kind of keyword in python as well? Not 100% sure...
## References

[^1]: ChatGPT
[^2]: https://www.w3schools.com/python/exercise.asp?filename=exercise_classes1