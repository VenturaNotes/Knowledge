---
aliases:
  - constructor
  - constructors
---
## Synthesis
- 
## Source [^1]
### Description
- Special method called when an object of a class is created
- Used to initialize the object's attributes and perform any setup required for the object

### Example
```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def greet(self):
        print(f"Hello, my name is {self.name} and I am {self.age} years old.")

# Creating an instance of the Person class
person1 = Person("Alice", 30)

# Accessing the instance attributes and methods
print(person1.name)  # Output: Alice
print(person1.age)   # Output: 30
person1.greet()      # Output: Hello, my name is Alice and I am 30 years old.
```
- Class Definition: `class Person:` defines a [[Class (Python)|class]] named `Person`
## References

[^1]: ChatGPT