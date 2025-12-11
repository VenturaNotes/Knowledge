---
aliases:
  - map()
---
## Synthesis
### Description 1
- A 'map' object is not subscriptable meaning the code below is NOT possible
```python
x = map(int, input().split())
print((x[0]+ x[1] + x[2])/3)
#Can't access elements using brackets like `x[0]`
```
### Description 2
- Applies a function to all items in an [[iterable (python)|iterable]] and returns a map object which is an [[iterator (python)|iterator]]. 
	- #question What is a map object?
- The map object can be converted to a list, tuple, or another type of iterable if needed
	- Lists are iterable. 
	- Dictionaries use hashmaps for fast key access
		- #question How do hashmaps provide fast key access?
	- #question I thought lists weren't iterable because of hashmaps or something like that?
#### Iterator vs Iterable
- Iterable: An object capable of returning its members one at a time. Example includes, lists, tuples, dictionaries, strings, and generators. Any object with an `__iter__()` method is iterable
	- #question Show how the `__iter__()` method works
	- #question What is meant by object?
	- #question How do you check if an iterable has an `__iter__()` method
- Iterator: An object that represents a stream of data; it implements the `__next__()` method and returns the next item. Iterators are what actually do the iteration
	- #question Is an iterator like a list or is it something different? 
	- #question What is meant by stream of data? Does it need to be a stream? 
- All iterators are iterables, but not all iterables are iterators
	- #question Can you give some examples for this 
#### Syntax
```python
map(function, iterable, ...)
```
- #question What does the ... mean? 
- function: A function that takes one or more arguments
	- #question Could we combine this with a lambda expression (which would then be a function object?)
		- #question can we have function objects?
- iterable: One or more iterables to which the function is applied
	- #question I want to see an example with multiple iterables applied
- It is possible to combine `map()` with a lambda expression.
#### Example

##### Using a Normal Function
```python
# Define a simple function that squares a number
def square(x):
    return x ** 2

# Create a list of numbers
numbers = [1, 2, 3, 4, 5]

# Use map() to apply the square function to each item in the numbers list
squared_numbers = map(square, numbers)

# Convert the map object to a list and print it
print(list(squared_numbers))  # Output: [1, 4, 9, 16, 25]

```

##### Using Lambda
#question Is it called a lambda function or lambda expression. Is there a difference?

##### Mapping Multiple Iterables
- If you provide multiple iterables to `map()`, the function must accept that many arguments
```python
# Define a function that adds two numbers
def add(x, y):
    return x + y

# Create two lists of numbers
numbers1 = [1, 2, 3]
numbers2 = [4, 5, 6]

# Use map() to add corresponding items from both lists
added_numbers = map(add, numbers1, numbers2)

# Convert the map object to a list and print it
print(list(added_numbers))  # Output: [5, 7, 9]

```

##### Built-in functions
- Convert all elements of a list into a string
```python
numbers = [1, 2, 3, 4, 5]

# Use map() with the str function to convert each number to a string
string_numbers = map(str, numbers)

# Convert the map object to a list and print it
print(list(string_numbers))  # Output: ['1', '2', '3', '4', '5']

#Doing str(numbers) will not work as the entire list itself will become a string

```
#question What happens if you a turn a list into a list
- There is a difference between [[type conversion (python)|type conversion]] and [[type casting (python)|type casting]]
	- In type conversion, the python interpreter automatically converts one data type to another
	- In type casting, the programmer converts the data type manually

#### What can you do with a map object?
- A map object is an iterator so it needs to be consumed (converted to a list or iterated through with a loop)
	- #question Is "consumed" the write question here? 
## Source[^1]
- There is a difference between [[type conversion (python)|type conversion]] and [[type casting (python)|type casting]]
	- In type conversion, the python interpreter automatically converts one data type to another
	- In type casting, the programmer converts the data type manually
## References

[^1]: https://www.naukri.com/code360/library/type-conversion-casting
