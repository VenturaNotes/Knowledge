---
aliases:
  - OOP
  - Object-Oriented Programming
---
## Synthesis
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

### Types of Relationships Between Classes
#### Is-a (Inheritance)
- Definition: One class is a specialized version of another
- Relationship: Subclass inherits from a superclass
- Used for: Reuse and [[polymorphism]]
	- #question What is polymorphism
```python
class Animal:
    pass

class Dog(Animal):  # Dog *is-a* Animal
    pass
```
- Use when there's a logical hierarchy: a dog is an Animal
	- #question What is a logical hierarchy?
- "is-a" Uses inheritance (subclassing). `Dog is-a Animal`
	- #question is inheritance or subclassing the same thing?
#### Has-a (Composition / Aggregation)
- Definition: One class contains another as part of it.
- Relationship: "Whole-part" or "ownership"
- Used for: Assembling complex objects from simpler ones. 
```python
class Engine:
    pass

class Car:
    def __init__(self):
        self.engine = Engine()  # Car *has-a* Engine
```
- Use when one object uses or contains another.
- Subtypes of "has-a"
	- #question Why are there quotation marks around "has-a"?
	- Composition
		- Ownership is included and lifespan tied to owner is a strong relationship such as "A `car` has-a `Engine`"
	- Aggregation
		- Ownership not included and lifespan to owner does not exist or is a weak relationship such as "A `Team` has-a `Player`"
			- #question What is meant by lifespan to owner? 
- Has-a is composition or aggregation. `Car has-a Engine`

#### Uses-a (Dependency/ Association)
- Definition: One class temporarily uses another to perform a task.
- Relationship: Loosely coupled
- Used for: Delegating Behavior
```python
class Printer:
    def print_file(self, file):
        print(f"Printing {file}")

class Document:
    def send_to_printer(self, printer):
        printer.print_file("my_doc.txt")  # Document *uses-a* Printer
```
- Use when a class depends on another to fulfill its task without owning it.
- `Uses-a` is a temporary association (dependency). `Document uses-a Printer`
## Source [^1]
- 
## References

[^1]: 