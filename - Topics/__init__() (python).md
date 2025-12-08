---
aliases:
  - __init__()
---
## Synthesis
- #question How does `__new__()` or `__init__()` behave in inheritance?
- `__init__()` is used to initialize the object's attributes
	- #question What is the difference between initialize and instantiate? Why is it init?
- `__init__()` is automatically called when an object is instantiated?
	- #question Is instantiation, instantiated and instantiate all the same thing?
	- #question What does it mean for an object to be instantiated? How is this different from initialization?
- `__init__` is a special method (called a [[constructor]])
	- #question Why are there underscores before `init` and underscores after `init?`
	- #question What is a constructor? 
- `__init__`
	- #question Does `__init__()` always need to take in parameters? 
- `__init__` is defined inside a class and automatically takes `self` as its first argument, which refers to the instance being created
	- #question What does `__init__` stand for?
	- #question Why does `__init__()` need to take the self parameter? 
	- #question Is it possible to create a class without an `__init__()`?
	- #question What is the purpose of the `__init__()` parameter? 
- General Questions
	- #question How does `*args`, `**kwargs` and `dataclasses` work?
### Arguments
- Without default values for parameters, arguments required when instantiating a class
	- #question What does it mean to instantiate? Is that just creating an object? 
- With default values for parameters, you can omit arguments
	- #question If I want to use the default value for the first argument but a specific for the second argument, how would I do this?
- #question Is this true for all types of methods or just `__init__()`?
#### Arguments Required
- You are generally required to provide arguments when creating an instance of a Python class if the `__init__()` method defines multiple parameters without default values
- Example
```
class MyClass:
    def __init__(self, x, y):
        self.x = x
        self.y = y
```
- #question Why is `self` needed?
- When creating an instance
```python
obj = MyClass(1, 2)  # Works
obj = MyClass(1)     # TypeError: Missing 1 argument
obj = MyClass()      # TypeError: Missing 2 arguments
```
- #question Why would this be a TypeError?
#### Arguments Optional
- Set default values for parameters of `__init__()` to make arguments optional
```python
class MyClass:
    def __init__(self, x=0, y=0):
        self.x = x
        self.y = y

obj1 = MyClass()          # Uses defaults x=0, y=0
obj2 = MyClass(5)         # x=5, y=10
obj3 = MyClass(5, 10)     # x=5, y=10
```

### Example of init in Class
```python
class MyClass:
    def __init__(self, value):
        self.value = value
```
- `__init__` is a method of the class `MyClass`
- `value` is a [[parameter (python)|parameter]]
- When doing `obj = MyClass(10)`, `10` is an argument, and `__init__` is called as a method on the newly created object. 
	- #question is `__init__` implicitly called in this case? 
	- #question What happens if you just set `value = 5` without the `__init__` method? 

### Why it's called init
- The name `__init__` stands for initalize
	- #question When can I refer to it as `__init__` and when is it appropriate to refer to it as `__init__()`?
- Python uses "dunder" (double underscore) methods to define special behavior
	- #question What is meant by special behavior in python?
	- #question Is dunder unique to python or is it available in other languages?
- `__init__` is a special method automatically called to initalize the instance
- It's not a constructor in the traditional sense (that's actually `__new__`), but it's often called a constructor informally because it feels like one
	- #question What does the `__new__()` constructor look like?
	- #question Can constructors only be made in classes for python? 
- Summary
	- `__init__` is a special method used to initialize which is automatically run inside a class
## Source [^1]
- All classes have a function called `__init__()`, which is always executed when the class is being initiated.
	- #question Isn't the class instantiated, not initiated?
- Use `__init__()` function to assign values tdo object properties or other operations necessary to do when the object is being created
- Note: The `__init__()` function is called automatically every time the class is being used to create a new object
	- #question Do you have to always explicitly define an `__init__()` function for a class or does it always work? 
### Example of creating a Class
```python
class Person:
  def __init__(self, name, age):
    self.name = name
    self.age = age

p1 = Person("John", 36)

print(p1.name) #John
print(p1.age) #36
```
- The `__init__` function is used to assign values for `name` and `age`

#### #comment Example of Creating Class with Type Hints
```python
class Person:
    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age

p1 = Person("John", 36)
# p2 = Person("Jane", "thirty") # A type checker would flag this as an error
```
- #question How would the type checker flag it as an error, would I need to build it myself? 
- This specifies the expected type of data for parameters in a Python class's `__init__()` method using `type hints`
	- #question Why is `self` needed here? What happens if you don't use self? 
	- #question What kind of data type is `self`? 
- In this example
	- `name: str` indicates that the `name` parameter is expected to be a string
	- `age`: int indicates that the age parameter is expected to be an integer.
- Specifying type hints in Python does not make the program execute faster. Python is a [[dynamically typed]] language, meaning type checking primarily occurs at runtime. Type hints are purely **metadata** that are ignored by the Python interpreter during execution
	- #question Are "type hints" an official term?
- Primary purpose of type hints:
	1. Static Analysis: Tools like MyPy can use type hints to perform static type checking, helping to catch potential type-related errors before runtime.
		- #question Is `MyPy` a module and what does it do? 
		- #question What is static type checking? Are there different types of type checking? 
	2. Documentation: They improve code readability and serve as clear documentation for developers, indicating the expected types of arguments and return values.
	3. IDE Support: Integrated Development Environments (IDEs) can leverage type hints to provide better autocompletion, refactoring, and error detection.
		- #question How do IDEs do autocompletion? 

### init is not necessary in Python Classes
- `__init__` is not required to define a class in Python. It's optional
	- #question I don't think `__init__()` defines a class. It's just a method/function within a class? 
- If you don't define it, Python will create an object using the default constructor, which does nothing but create the instance
	- #question What is the default constructor?
```python
class Empty:
    pass

obj = Empty() # This works
```
- `__init__()` is only necessary when you want to initialize instance variables or perform setup when the object is created
	- #question what are instance variables? 

### Location of init definition
- `__init__()` can only be defined inside a class. It's a special method automatically called when a new instance of the class is created
	- #question What other special methods does `class` have?
	- #question is `class` an object as well. What exactly is a [[Class (Python)|class]] in python?
- Can't define a function named `__init__()` globally and expect it to do anything meaningful
- Python specifically looks for `__init__()` inside the class body when creating an instance
	- #question Is creating an instance considered initializing or instantiating? 
### Action of init
- This is not the function that creates the object. This is done by `__new__()` behind the scenes
	- #question How does `__new__()` work?
- `__init__()` is called right after the object is created, to initialize it.
	- #question What is meant by initializing it?
- It has access to the instance via `self`, so you can set up attributes or run startup logic
	- #question Do you need `self` to access the instance? Can't you just modify the instance without `self` through the name of the object?
- `init` is typically used to initialize object state (attributes)
	- #question Does this include methods? 
```python
class Person:
    def __init__(self, name):
        self.name = name  # Initialize instance variable

p = Person("Alice")
print(p.name)  # Alice
```
#question is self.name = name required to initialize the instance variable? Isn't `self.name = name` instantiating it? What is in an instance in python? What is an instance variable?
## References

[^1]: https://www.w3schools.com/python/gloss_python_class_init.asp
