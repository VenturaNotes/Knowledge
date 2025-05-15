---
aliases:
  - inheritance
---
## Synthesis
- Creates new classes based on existing ones
## Source [^1]
- #question What does the method `super()` do?
### Definition
- Involves creating new classes based on existing ones
- Promotes code reuse and establishes an "is-a" relationship between classes
	- #question What other kinds of relationships are there between classes such as "is-a" vs "has-a"?
- Downsides
	- Tight coupling and rigid class structures
	- #question what does tight coupling even mean? 

### "is-a" Relationship
- An `is-a` relationship means a subclass represents a more specific version of its superclass
	- #question Is it always true that a subclass will be a "more specific version" of the superclass?
- `is-a` is an inheritance relationship type such as A `Car` is a `Vehicle`
- This means one class is a specific kind of another class. It's a hierarchical relationship where the child class inherits the behavior and attributes of the parent class. 
```python
class Animal:
    def eat(self):
        print("This animal eats food.")

class Dog(Animal):  # Dog inherits from Animal
    def bark(self):
        print("Woof!")
```
- Here, a `Dog` is an `Animal`. The `Dog` inherits everything from `Animal`, and can do anything an `Animal` can do such as `eat()` and more such as `bark()`
- This is an `is-a` relationship because the dog is a kind of animal
- Importance of "is-a" relationship
	- Reuse code: Subclasses inherit behavior form superclasses
		- #question What is a subclass in python
		- #question what is a superclass in python?
	- Organize locally: You can model real-world hierarchies (e.g., Bird $\to$ Penguin)
	- [[Polymorphism]]: You can treat all subtypes the same way (e.g., all `Animal` can `eat()`)
		- #question What is polymorphism?

### "has-a" Relationship
- #question Is "has-a" relationship related to inheritance?
- The relationship type of `has-a` is composition / attributes such as A `Car` has an `Engine`
	- #question What is meant by composition / attributes? What is the difference?
	- #question How would you create a "has-a" relationship?

## Source [^2]
```python
# Executing the printname method of object x
class Person:
	def __init__(self, fname):
		self.firstname = fname

	def printname(self):
		print(self.firstname)

# Creates a class named student which will inherit properties and methods from a class named Person
class Student(Person):
	pass
x = Student("Mike")
x.printname() #Runs the printname() method in class Person
```
#question If an assignment says that a student will inherit "properties", is this just a synonym for "attributes"?
#question If we created the `printname` method in the Student(Person) class, would this override the `printname` in the Person class? 
#question is there a way to ensure that a new method is written for a class so that it can inherit from a parent class?
#question I need a few more details to understand what inheritance exactly is
#question Is it possible to do inheritance without forcing a parameter? 

## References

[^1]: ChatGPT
[^2]: https://www.w3schools.com/python/exercise.asp?filename=exercise_inheritance1