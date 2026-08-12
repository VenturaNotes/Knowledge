---
aliases:
  - self
tags:
  - in-progress
  - current
---
## Synthesis
- **Self** represents the specific **instance of a class**.
- By using self, you can access the attributes (variables) and methods (functions) of that specific object from within the class definition.
	- [ ] #question What is the class definition?
	- [ ] #question What are the variables and methods?
### Code Example
- Here is a simple example to show how self differentiates between different objects created from the same class: 
```python
class Car:
    # The __init__ method is the constructor.
    # 'self' refers to the specific car object being created.
    def __init__(self, color, brand):
        self.color = color    # Assigns color to this specific instance
        self.brand = brand    # Assigns brand to this specific instance

    def describe(self):
        # Accessing the instance variables using 'self'
        print(f"This is a {self.color} {self.brand}.")

# Creating two distinct instances (objects) of the Car class
car1 = Car("red", "Toyota")
car2 = Car("blue", "Ford")

# Calling the method on each object
car1.describe()  # Output: This is a red Toyota.
car2.describe()  # Output: This is a blue Ford.
```
- #question What would the code look like without `self`?
### Why do we have to write self explicitly?
- In languages like Java or C++, a similar concept called this is used, but it is often implicit (you don't have to pass it as a parameter in your method definitions).
- Python, however, follows the philosophy that "explicit is better than implicit."
- When calling a method:

```
car1.describe()
```

- Under the hood, Python automatically translates it to:

```
Car.describe(car1)
```

- Because the object itself (`car1`) is being passed as the very first argument, the method definition must have a parameter ready to receive it. That is why the first parameter of any instance method in Python is self:

```
def describe(self):
```
### Is self a Python keyword?
- `self` is not a reserved keyword in python. Could name it `this`, `me`, or `banana` and it would still work but not recommended
```
# This works, but is highly discouraged!
class Car:
    def __init__(banana, color):
        banana.color = color
```
- PEP 8 says to use `self`

### Does `self` need to be included in a Class?
- No
- `self` is not required when  it's a 
	- Static Method: Methods decorated with `@staticmethod` behave like regular functions.
		- [ ] #question Is the `@staticmethod` required or convention?
	- Class Methods: : Methods decorated with @classmethod receive the class itself as the first argument (conventionally named cls) instead of the instance (self).
		- [ ] #question Is `(self)` a keyword?
		- [ ] #question Is `@classmethod` required or convention?
```python
class DemoClass:
    # 1. No self needed for a static method
    @staticmethod
    def standard_function():
        return "Hello World"

    # 2. Uses cls instead of self for a class method
    @classmethod
    def class_function(cls):
        return f"Bound to class: {cls.__name__}"
```
[1]
### 1. Is @staticmethod required or convention?
- It is required if you want the method to be callable from both the class itself and any instances of that class.
- Here is what happens if you omit it:
	- **Calling via the class:** In Python 3, if you define a method with no arguments and omit @staticmethod, you can still call it directly via the class.
		- #question How do you call via class?
	- **Calling via an instance:** If you try to call that same method on an instance of the class, Python will automatically attempt to pass the instance as the first argument, resulting in a TypeError.

```
class DemoClass:
    # No decorator used
    def standard_function():
        return "Hello World"

# This works fine:
print(DemoClass.standard_function())  # Output: "Hello World"

# This fails:
obj = DemoClass()
print(obj.standard_function())
# TypeError: standard_function() takes 0 positional arguments but 1 was given
```

Using @staticmethod prevents Python from passing the instance, allowing the method to be called successfully from both DemoClass.standard_function() and obj.standard_function().

### 2. Is self a keyword?

No, self is **not a keyword** in Python. It is purely a strong community convention.

Python does not have self in its list of reserved keywords (unlike this in C++ or Java). You can name the first argument of an instance method whatever you like, and Python will still automatically pass the instance to it.

code Python

downloadcontent_copy

expand_less

```
class DemoClass:
    # Using 'this' instead of 'self'
    def __init__(this, name):
        this.name = name

obj = DemoClass("Python")
print(obj.name)  # Output: Python
```

Note: While Python allows this, it is highly recommended to stick to self to comply with PEP 8 style guidelines and keep your code readable for others.

---

### 3. Is @classmethod required or convention?

It is **required**.

Without the @classmethod decorator, Python has no way of knowing that the first argument should represent the class itself (cls). Instead, Python will treat the method as a standard instance method.

If you omit @classmethod:
- Calling DemoClass.class_function() will fail because Python expects you to manually pass an argument for cls.
- Calling obj.class_function() will succeed, but cls will bind to the instance (acting exactly like self), not the class.

code Python

downloadcontent_copy

expand_less

```
class DemoClass:
    # No decorator used, but named the argument 'cls'
    def class_function(cls):
        return cls

# This fails:
# DemoClass.class_function()
# TypeError: class_function() missing 1 required positional argument: 'cls'

# This works, but 'cls' is the instance, not the class:
obj = DemoClass()
print(obj.class_function())  # Output: <__main__.DemoClass object at 0x...>
```

Applying the @classmethod decorator explicitly instructs Python to bind the method to the class, ensuring that the class object is always passed as the first argument, regardless of whether you call it on the class or an instance.

## Source [^1]
- 
## References

[^1]: