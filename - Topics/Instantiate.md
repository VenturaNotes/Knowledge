---
aliases:
  - instantiation
  - instantiated
---
## Synthesis
- Instantiating is creating an instance of a class `obj = MyClass`
	- #question While it's possible to create an instance of a class, are there other ways to modify a class? Can you create something else other than an instance from a class? Is it possible to create multiple objects from a class so that if one object is changed, all the other objects are changed as well?
## Source [^1]
- Means to create an instance (an object) of a class
- Happens when you call the class like `obj = MyClass()`
- Behind the scenes: Python calls the `__new__()` method first to create the object in memory
	- #question What is meant by creating object in memory? Is the object on a stack or heap? Where in memory is it placed?
- Instantiation can be thought of as the moment the object comes into existence
- Summary
	- Instantiate creates an object from a class which happens in `obj = MyClass()` and done by `__new__()`

## Source[^2]
- (1) The creation of a particular instance of an object class, generic unit, or template.
- (2) The application of a parameterized abstract data type to a particular set of parameters.
## References

[^1]: ChatGPT
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]