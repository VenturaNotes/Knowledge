---
aliases:
  - function
  - functions
---
## Synthesis
- The location of a function is outside a class where the first parameter is not `self` and an example is `def greet(name):`
	- #question Is this true that the difference between methods and functions in python is whether or not they're inside a class?

### Basic Function Creation and Execution
```python
def my_function():
	print("Hello from a function")
my_function()
```
### Function with parameters
```python
def my_function(fname, lname):
	print(fname)
# This one returns your first name
```
### Function Returning Value
```python
def my_function (x):
	return x + 5
# Returns number + 5 that user inserted
```
## Source [^1]
```python
# Creating a function
def my_function():
	print("Hello from a function")

# Execute above function
my_function()

# Function with parameters
def my_function(fname, lname):
	print(fname)

# Returning something in function
def my_function (x):
	return x + 5

# Use `*` when you don't know the number of arguments passed into function
def my_function(*kids):
	print("The youngest child is " + kids[2])

# Use `**` if you don't know number of keyword arguments passed into function
def my_function(**kid):
	print("His last name is " + kid["lname"])
```
- #comment[[Function overloading]]
- #question I don't think the `*` part of the function was used correctly. If I just pass 2 arguments into the function, it seems to crash. 
- #question Learn more about the [[return (python)|return]] keyword
- #question Study more examples about the `*kids` for functions
- #question Study more examples about the `**kids` for more functions
- #question What is the difference between keyword arguments and argument? 
- #question Why does `lname` work in this case? 
## References

[^1]: https://www.w3schools.com/python/exercise.asp?filename=exercise_functions1