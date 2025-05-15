---
aliases:
  - super()
---
## Synthesis
- 
## Source [^1]
- Without `super().__init__()`, the base attributes may never get initialized leading to missing data or errors. 
- `super()` delegates method call to superclass
- A common use case is inside the `__init__` to set up base (or parent) class attributes
- A key benefit is that it supports inheritance cleanly via MRO
	- #question how does MRO work? 
- Used to call methods from a parent (or superclass) especially in the context of inheritance
	- #question What is a superclass?
### What does super() do
- `super()` returns a proxy object that lets you delegate method calls to the superclass. Most commonly used inside the `__init__()` method or when overriding a method in a subclass 
	- #question what is a proxy object?
	- #question How would you override a method in a subclass if `super()` is not used inside the `__init__()` method?
```python
class Animal:
    def __init__(self, name):
        self.name = name # <- Base class attribute
        print(f"Animal created: {self.name}")

class Dog(Animal):
    def __init__(self, name, breed):
		#Calls Animal.__init__()
		# Initializes base class attribute
        super().__init__(name)

		#Subclass attribute
        self.breed = breed
        print(f"Dog created: {self.name}, Breed: {self.breed}")

dog = Dog("Fido", "Labrador")

# Output
"""
Animal created: Fido
Dog created: Fido, Breed: Labrador
"""
```
- #question Why do we need to do `self.name = name` for classes when the argument was already passed in?
- #question Why would we use `super()` to call `name` into the parent class?
- #question How does the class `Dog` know to use `self.name`? 
- Without `super()`, you'd write `Animal.__init__(self,name)` but this can break in [[multiple inheritance]] which `super()` handles better
	- #question Give me an example where this breaks
	- #question Why would you want to do this?
### Why use super() vs calling parent directly
- Cleaner and less error-prone
- Supports multiple inheritance suing the method resolution order (MRO)
	- #question what is the method resolution order?
- Makes code easier to maintain and extend

### Multiple Inheritance Example
```python
class A:
    def do(self):
        print("A")

class B(A):
    def do(self):
        super().do()
        print("B")

class C(A):
    def do(self):
        super().do()
        print("C")

class D(B, C):  # Inherits from B, C
    def do(self):
        super().do()
        print("D")

d = D()
d.do()

# Output
"""
A
C
B
D
"""
```
- super() respects the MRO, which in this case is `D -> B -> C -> A`
- #question What determines the order of the output? This seems to work similarly to recursion
## References

[^1]: ChatGPT