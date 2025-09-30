---
aliases:
  - module
  - modules
---
## Synthesis
- 
## Source [^1]
- The distinction between modules and [[package (Python)|packages]] is based on how they're structured
- A module is a single file of Python code that can be imported and used in other Python code. It typically contains [[function (python)|functions]], [[Class (Python)|classes]], and [[variables (python)|variables]].
- The `form ... import ...` statement allows you to import specific functions, classes, or variables from a module in your current namespace

```python
# Importing specific function, class, and Variable
from math import sqrt #function
from datetime import datetime #class
from math import pi #Variable

#Importing multiple items from a module
from math import sqrt, pi

#Using alias on imported items
from math import sqrt as sq

#Importing a specific function from a package submodule
#Here we're importing the choice function from the random module which is part of the random package 
from random import choice
```
#question What does it mean to have modular code? 
#question How to know difference between package submodule and package module. I don't exactly understand this
### Examples
- [[os (python)|os]]
- [[datetime (python)|datetime]]

### Terminology
- The items inside a module can collectively be referred to as attributes (most precise and commonly used term), members, or contents

## Source [^2]
```python
# Importing a module
import mymodule

# Creating an alias for a module
import mymodule as mx

# Print all variables and function names of the module
import mymodule
print(dir(mymodule))

#Importing something specific from a module
from mymodule import person1

```
#question When importing something from a module, when using the "from" keyword, what is it exactly that we're importing. Is it another module. Is it a class. What is the vocabulary for this?

## Source [^3]
```python
from math import pi
print(pi) #Output: 3.141592653589793

# You don't want to clutter namespace too much though
pi = "Hello world" #Now the value of "pi" will no longer be the constant above


```
- The `from` keyword indicates you're importing something from a module
- The `math` is a python module we're importing from. It contains various mathematical functions and constants
- `import pi` lets us directly use `pi` without having to prefix it with `math.`
- In summary, `from module import name` imports a specific element (function, class, variable) from a module and assigns it a name in current [[Namespace (Python)|namespace]]
#question What are all the built-in python modules? 
#question How do [[constant (python)|constants]] in python work? 
#question What are constants typically supposed to do in computer programming? We usually don't want to overwrite a variable but we need to watch out...

## Source[^4]
- We can create our own modules as well
- By creating a module in the same directory as `main.py`, we can access the 

```python
#constant.py file
PI = 3.14
GRAVITY = 9.8

#main.py file
import constant as const
print(const.PI)      #Output: 3.14
print(const.GRAVITY) #Output: 9.8
```

## References

[^1]: ChatGPT
[^2]: https://www.w3schools.com/python/exercise.asp?filename=exercise_modules1
[^3]: Gemini
[^4]: https://www.toppr.com/guides/python/python-introduction/variables-constants-literals/python-variables-constants-and-literals/#:~:text=Note%20%E2%80%93%20Unlike%20other%20programming%20languages,as%20a%20Constant%20in%20Python.