---
aliases:
  - variable
  - variables
---
## Synthesis
- Assign String: `carname = "volvo"`
- Assign Integer: `x = 50`
- Add Integer Variables: `z = x + y`
	- When `x = 5` and `y = 10`
- Assign Multiple Variables on same line:  `x,y,z = "Orange", "Banana", "Cherry"`
- Assign Same Value to Three Variables `x=y=z= "Orange"`
- Set variable to global scope: `global x`
## Source [^1]
### Examples
```python

#Creating a variable and assigning a string value
carname = "volvo"

#Creating a variable and assigning an int value
x = 50

# Displaying sum of two variables
x = 5
y = 10
print(x + y) #Output is 15

# Assigning variable to two other variables
x = 5
y = 10
z = x + y
print(z) #prints 15
x = 10
print(z) #prints 15 (not 20)

#Assigning multiple variables on a line
x,y,z = "Orange", "Banana", "Cherry"

#Assign same value to all 3 variables
x=y=z= "Orange" #If you assign y= "Duck" on a separate line, the other values will still be "Orange"
```

[[global (python)|global]]
```python
def myfunc():
	global x #This variable will now belong to the global scope
	x = "fantastic"
```

## References

[^1]: https://www.w3schools.com/python/exercise.asp?filename=exercise_variables1