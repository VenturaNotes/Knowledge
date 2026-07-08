---
aliases:
  - self
tags:
  - in-progress
---
## Synthesis
- **Self** represents the specific **instance of a class**.
- By using self, you can access the attributes (variables) and methods (functions) of that specific object from within the class definition.
	- #question What is the class definition?
	- #question What are the variables and methods?
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

In languages like Java or C++, a similar concept called this is used, but it is often implicit (you don't have to pass it as a parameter in your method definitions).

Python, however, follows the philosophy that **"explicit is better than implicit."**

When you call a method like this:

code Python

downloadcontent_copy

expand_less

```
car1.describe()
```

Under the hood, Python automatically translates it to:

code Python

downloadcontent_copy

expand_less

```
Car.describe(car1)
```

Because the object itself (car1) is being passed as the very first argument, the method definition must have a parameter ready to receive it. That is why the first parameter of any instance method in Python is self:


```
def describe(self):
```

### Is self a Python keyword?

Technically, **no**. self is not a reserved keyword in Python. You could actually name it this, me, or banana if you wanted to, and the code would still work:


```
# This works, but is highly discouraged!
class Car:
    def __init__(banana, color):
        banana.color = color
```

However, using anything other than self is **highly discouraged**. Using self is a universally accepted convention defined in Python's official style guide (PEP 8). Using standard naming keeps your code readable and maintainable for others.
[/1]

## Source [^1]
- 
## References

[^1]: