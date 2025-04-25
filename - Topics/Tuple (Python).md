---
aliases:
  - tuple
  - tuples
---
## Synthesis
- Tuples are ordered, unchangeable, and allows duplicates
## Source [^1]
- Characteristics
	- Ordered
		- Items within have a defined order
	- Unchangeable
		- Cannot change, add, or remove items after tuple creation
	- Allow Duplicates
		- Since indexed where first item index is `[0]`, they can have items with same value
- One of 4 built-in data types in Python (other 3 are [[List (Python)|List]], [[Set (Python)|Set]], and [[dictionary (Python)|Dictionary]])
	- #question Are there only 4 built-in data types in Python?
	- #question are tuples data types or data structures or are these the same thing?
- Written with round brackets
### Multiple Item Tuple Creation
```python
thistuple = ("apple", "banana", "cherry", "apple", "cherry")
print(thistuple) # ('apple', 'banana', 'cherry', 'apple', 'cherry')

# Tuple items of any data type
tuple1 = ("apple", "banana", "cherry")  
tuple2 = (1, 5, 7, 9, 3)  
tuple3 = (True, False, False)

# Tuple can contain different data types
tuple4 = ("abc", 34, True, 40, "male")
```
- #question Are tuples the only data structure that allows any data type?
### Tuple Length
```python
thistuple = ("apple", "banana", "cherry")
print(len(thistuple))

#Output: 3 
```

### One Item Tuple Creation
```python
thistuple = ("apple",)
print(type(thistuple)) #<class 'tuple'>

#NOT a tuple
thistuple = ("apple")
print(type(thistuple)) #<class 'str'>

```

### Tuple Constructor
- [[Constructor (Python)|Constructor]] 

## Source [^2]
```python
#Print first item in tuple
fruits = ("apple", "banana", "cherry")
print(fruits[0])

#Print number of items in tuple
print(len(fruits))

#print last item in tuple
print(fruits[-1])

#print range of items in tule
print(fruits[0:2]) #Doing 0:1 would just print one item with a comma
```

## Source[^3]
### Tuples vs Multisets
- Order matters
	- $(1, 2) \ne (2, 1)$ 
- Immutable (unchangeable)
- Use case: Fixed-length, ordered data
	- #question What is meant by this?
- Duplicates are allowed and position-specific
- Can represent tuples in python as `tuple`
- Functionally
	- A tuple is like a precise recipe: the exact order and number of ingredients matter
## References
[^1]: https://www.w3schools.com/python/python_tuples.asp
[^2]: https://www.w3schools.com/python/exercise.asp?filename=exercise_tuples1
[^3]: ChatGPT