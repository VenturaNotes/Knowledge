---
aliases:
  - inheritance
---
## Synthesis
- 
## Source [^1]
- Involves creating new classes based on existing ones
- Promotes code reuse and establishes an "is-a" relationship between classes
	- #question Explain to me what "is-a"
- Downsides
	- Tight coupling and rigid class structures
	- #question what does tight coupling even mean? 

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