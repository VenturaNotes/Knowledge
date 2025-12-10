---
aliases:
  - initialization
---
## Synthesis
- #question What is a [[generator (python)|generator]]?
### Initializing Variables
- Variables assigned value directly
```python
x = 10          # Integer initialization
y = 3.14        # Float initialization
name = "Alice"  # String initialization

# Collections
numbers = [1, 2, 3]  # List initialization
settings = {"theme": "dark", "language": "English"}  # Dictionary initialization
numbers = [0] * 5 # [0, 0, 0, 0, 0]
```

- #question Is a string considered a collection in python?
	- [Useful link](https://launchschool.com/books/python/read/intro_collections)
### Initializing Objects
#### No Default Values
- In [[Object-Oriented Programming (Python)|Object-Oriented Programming]], you initialize objects using [[Constructor (Python)|constructors]]. The [[__init__() (python)|__init__()]] method is called the constructor and is used to initialize an object's attributes
	- Pedantically, `__init__()` can't be a constructor because the `__init__` method is passed `self` which is a reference to the already existing instance. So strictly it initializes the already constructed instance. [^1]
```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

# Creating an instance of the Person class
person = Person("Alice", 30)

print(person.name)  # Output: Alice
print(person.age)   # Output: 30
```
#question Is it possible to initialize objects without constructers when creating an instance class? 

#### With Default Values
- Able to provide default values for parameters in functions and methods, including the constructor below
```python
class Person:
    def __init__(self, name="Unknown", age=0):
        self.name = name
        self.age = age

# Creating instances with and without providing initial values
person1 = Person()
person2 = Person("Alice", 30)

print(person1.name)  # Output: Unknown
print(person1.age)   # Output: 0
print(person2.name)  # Output: Alice
print(person2.age)   # Output: 30
```

### List Comprehension
- You can use [[List comprehension (Python)|list comprehension]] for complex initialization
```python
# Initializing a list with squares of numbers from 0 to 4
squares = [x ** 2 for x in range(5)]  # [0, 1, 4, 9, 16]
```
#question How does list comprehension work?
#question How does the [[range() (Python)|range()]] work in this case? 

### Factory functions
```python
# Using dict.fromkeys() to initialize a dictionary with default values
default_dict = dict.fromkeys(["key1", "key2", "key3"], "default_value")
```
#question What is a factory function?
## Source[^2]
- 
## References

[^1]: https://www.reddit.com/r/learnpython/comments/z4tjwn/is_init_a_constructor_or_initialization_i_keep/
[^2]: 
