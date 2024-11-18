---
aliases:
  - function
  - functions
---
## Synthesis
- 
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

# Returning something in functiov
def my_function (x):
	return x + 5

# Use `*` when you don't know the number of arguments passed into function
def my_function(*kids):
	print("The youngest child is " + kids[2])

# Use `**` if you don't know number of keyword arguments passed into function
def my_function(**kid):
	print("His last name is " + kid["lname"])
```
#question Is there a term for when we create multiple functions with the same name and then the program chooses which function you meant. I think there are multiple versions of this. One is it chooses which function you meant based on parameters. Another is that there might be a hierarchy to it such as overriding or overloading? 
#question Learn more about the [[return (python)|return]] keyword
#question Study more examples about the `*kids` for functions
#question Study more examples about the `**kids` for more functions
#question What is the difference between keyword arguments and argument? 
#question Why does `lname` work in this case? 
## References

[^1]: https://www.w3schools.com/python/exercise.asp?filename=exercise_functions1