---
aliases:
  - OOP
  - Object-Oriented Programming
---
## Synthesis
- 
## Source [^1]
- A programming paradigm that uses objects and classes for organizing code
- You create classes to define objects with attributes (data) and methods (functions). Encourages concepts like [[encapsulation (python)|encapsulation]], [[inheritance (python)|inheritance]], and [[polymorphism (python)|polymorphism]]
- An "is-a" relationship between classes refers to inheritance, where one class (the [[subclass (python)|subclass]]) is derived from another class (the [[superclass (python)|superclass]])
	- The subclass is a type of the superclass. This is achieved using class inheritance
		- #question are there other types of inheritances aside from class inheritance? 
		- #question What other kinds of relationships are there aside from "is-a"?
		- #question what is composition in python? 
- "is-a" Relationship
	- Inheritance: Subclass inherits attributes and methods from superclass
	- Subclass: Class is derived from another class
	- Superclass: Class where subclass is derived.
### Example
```python
# Superclass
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self): # Meant to be overridden by subclasses
        pass

# Subclass
class Dog(Animal):
    def speak(self): #overrides the speak method in superclass
        return f"{self.name} says Woof!"

# Another Subclass
class Cat(Animal):
    def speak(self): #overrides the speak method in superclass
        return f"{self.name} says Meow!"

# Creating instances of subclasses
dog = Dog("Buddy")
cat = Cat("Whiskers")

print(dog.speak())  # Output: Buddy says Woof!
print(cat.speak())  # Output: Whiskers says Meow!
```

 #question How does overriding work in inheritance?
 #question can subclasses have an `__init__` method? 
 #question What is `f"{self.name}` syntax again? 
 #question is it possible to create an instance of a superclass (without use of subclasses?)
 - "Is-a" Relationship
	 - `Dog` instance is also considered an instance of `Animal`
### Benefits of "is-a" Relationship
- Code Reusability
	- Common functionality can be defined in superclass and inherited by all subclasses reducing code duplication
- [[polymorphism (python)|polymorphism]]
	- #question What exactly is polymorphism? 
	- Subclasses can override methods from superclass allowing for polymorphic behavior. `Dog` and `Cat` have their own implementations of the speak method
	- #question is it considered polymorphism if an attribute from a superclass is overridden in a subclass? 
- Maintainability
	- Changes made in superclass can automatically be propagated to subclasses

### Checking Relationship between classes
- The [[isinstance() (Python)|isinstance()]] function checks if an object is an instance of a particular class or subclass

```python
print(isinstance(dog, Animal)) #True
print(isinstance(dog, Dog)) #True
print(isinstance(dog, Cat)) #False
```
 

## References

[^1]: ChatGPT