---
aliases:
  - method
  - methods
---
## Synthesis
- Functions associated with an object that can operate on its data or perform other tasks
- Methods are inside a class with the first parameter `self` such as `def __init__(self):`
	- #question Do all methods inside a class need the `self` parameter. Is `self` considered a parameter here?
- In a class, [[__init__() (python)|__init__()]] is considered a method, specifically an instance method
	- #question What is an instance method
- Static methods and class methods are defined within a class but differ in their binding and access to class or instance state

### Static Method
- A static method is defined using the @staticmethod decorator
	- #question What is a decorator?
	- #question What is meant by @staticmethod? How does the `@` symbol affect python programs?
- It does not receive an implicit first argument (neither `self` for an instance nor `cls` for the class)
	- #question Could you show an example of a method using `self` as well as `cls`?
- Static methods behave like regular functions that happen to be defined within a classes's namespace. They cannot access or modify instance-specific data or class-specific data.
	- #question What is a namespace in python?
	- #question Could you give me an example of instance-specific data and class-specific data?
- Typically used for utility functions that logically belong to the class but do not operate on the classes's state or any instance's state
	- #question What is meant by classes's state vs instance state?
	- #question What is a utility function in this case?
```python
class MyClass:
    @staticmethod
    def my_static_method(x, y):
        return x + y
```
- #question So what is different if I were to add a `@staticmethod` and then not add a `@staticmethod`?
### Class Method
- A class method is defined using the `@classmethod` [[decorator]]
	- #question What is a decorator in this case?
	- #question What can you do with the `@classmethod`?
- It receives the class itself as its first implicit argument, conventionally named `cls`
	- #question Why would the class receive itself? Do you need to add the `@classmethod` for this to work?
- Class methods can access and modify class-level attributes but cannot access instance-specific attributes directly (without an instance)
	- #question I need an example of this. What would be an example of a class-level attribute. How could any class access an instance-specific attribute without an instance?
- They are often used for alternative constructors, factory methods, or methods that operate on class-level data
	- #question I would like to see an example of each
```python
class MyClass:
    class_attribute = 0

    @classmethod
    def my_class_method(cls, value):
        cls.class_attribute += value
        return cls.class_attribute
```
- #question Please show what this does

### Difference between Class Method and Static Method

| Feature         | Static Method                                | Class Method                                                              |
| --------------- | -------------------------------------------- | ------------------------------------------------------------------------- |
| Decorator       | @staticmethod                                | @classmethod                                                              |
| First Argument  | None (behaves like a regular function)       | `cls` (the class itself)                                                  |
| Access to State | No access to instance or class state         | Access to class state; no direct access to instance state                 |
| Primary Use     | Utility functions within the class namespace | Alternative constructors, factory methods, operations on class-level data |
- #question Do dynamic methods exist in python? 
- #question What other decorators can you use? Are there specific decorator names or can you name a decorator method what you want and it's more a conventional thing? 
 
## Source [^1]
- 
## References

[^1]: 