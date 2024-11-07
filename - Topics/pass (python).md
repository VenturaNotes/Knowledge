---
aliases:
  - pass
---
## Synthesis
- 
## Source [^1]
- Null operation
- Placeholder which is syntactically required but does nothing when executed

### Uses of Pass in Python
- In functions and class definitions (without providing an implementation immediately)
- Loops: If you need a loop to perform no action for certain iterations
- Conditional statements: A condition is met but you don't want to take any action

### Examples of Pass in Python
Functions
```python
def my_function():
    pass #intend to implement later

# This function does nothing when called
my_function()

```

Classes
```python
class MyClass:
    pass #intend to implement later

# This class does nothing but is syntactically valid
my_object = MyClass()

```

Loops
```python
for i in range(5):
    if i < 3:
        pass  # Do nothing for i < 3
    else:
        print(i)
```

Conditional Statements
```python
x = 10

if x < 0:
    pass  # Do nothing if x is negative
else:
    print("x is non-negative")
```
### Practical Use Cases of Pass
- When designing structure of your program, might create function or class definitions to implement later. 
- When debugging or refactoring code, might temporarily replace a block of code with `pass` to isolate issues
## References

[^1]: ChatGPT