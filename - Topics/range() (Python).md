---
aliases:
  - range()
---
## Synthesis
- Provides flexibility for generating sequences of numbers
### Basic Features
```python
# Single Argument: Generates numbers from 0 to 4
for i in range(5): # 0 is inclusive and 5 is exclusive
	print(i) #Output: 0, 1, 2, 3, 4

# Two Arguments: Generates numbers from specified start and end value
for i in range(2, 5): # Starts at 2 inclusively and ends at 5 exclusively
	print(i) #Output: 2, 3, 4

# Three Arguments: Specifies start, end, and step values 
for i in range (1, 10, 2): #start(inclusive) , end (exclusive), step
	print(i) #Output: 1, 3, 5, 7, 9
```
### Flexible Features
```python

# Negative step values possible
for i in range(5, 0, -1):
	print(i) #Output: 5, 4, 3, 2, 1

# range() can handle large ranges efficiently because it generates numbers on demand. It's an iterator
for i in range(1_000_000):
	if i == 999_999:
		print(i)

# Zero step value will raise a ValueError as it would create an infiinte loop
for i in range(0, 10, 0):
	print(i) #Output: raneg() arg 3 must not be zero

# Can create a list, tuple or set of numbers
number_list = list(range(5))
print(number_list) #Output: [0, 1, 2, 3, 4]

# Commonly used in list comprehensions and generator expressions
squares = [x**2 for x in range(5)]
print(squares) #Output: [0, 1, 4, 9, 16]

squares_gen = (x**2 for x in range(5))
print(list(squares_gen)) #Output: [0, 1, 4, 9, 16]

# Combine functions with range() for quick calculations
## Sum of first 10 numbers
print(sum(range(10))) #Output: 45

## Length of range
print(len(range(10))) #Output: 10



```
- #question What is an [[iterator (python)|iterator]]
- #question Why is the underscore in `1_000_000` being used. Is this just in place of a comma for better readability? 
- #question I need to understand comprehensions and generator expressions in more detail to understand the above code better
### Definition
- range() is a python function
- It is of the class `range`
### Example
```python

```
- #question What does an example look like?
### Questions
- #question We can loop through a list such as `for x in range(6):` where x will go from 0 to 6. How can we go from -5 to 30 or some other specified range? 
- #question How does the range() function work and what kind of flexibility can we get from it
- #question Is it possible to have 4 arguments for the range function? 
- #question How is [[underscore (python)|underscore]] used?
- #question What is the maximum that range can handle in python
### Looping through a List
```python
x = [0, 1, 2, 3]

for i in range(4, len(x)):
    print(i)
```
- Even though `4` is outside the starting range of `x`, there will be no out of bounds error and nothing will be printed
## Source[^1]
### Exercises
```python
# Creates a list of range 0 to 49
rng = list(range(50))

```
## Source [^2]
- The range function can be used to populate lists
## References

[^1]: https://holypython.com/beginner-python-exercises/exercise-14-range-function-2/
[^2]: https://www.pythonbytesize.com/33-exercise-pythons-range-function.html
