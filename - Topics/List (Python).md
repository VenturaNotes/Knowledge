---
aliases:
  - list
  - lists
---
## Synthesis
- 
## Source [^1]
- Lists are not hashable since lists are [[mutable (Python)|mutable]]
- Initializing list with default values
```python
numbers = [0] * 5  # [0, 0, 0, 0, 0]
```
## Source [^2]
```python
#Retrieve second item in list
fruits = ["apple", "banana", "cherry"]
print(fruits[1])

#Change value in list
fruits = ["apple", "banana", "cherry"]
fruits[0]= "kiwi"

#Add element to end of list
fruits = ["apple", "banana", "cherry"]
fruits.append("orange")

#Add element as second item in list
fruits = ["apple", "banana", "cherry"]
fruits.insert(1,"lemon")

#Remove element from list
fruits = ["apple", "banana", "cherry"]
fruits.remove("banana")

#Print last item of list
fruits = ["apple", "banana", "cherry"]
print(fruits[-1])

#Print 3rd, 4th, and 5th item in list
fruits = ["apple", "banana", "cherry", "orange", "kiwi", "melon", "mango"]
print(fruits[2:5])

#Print number of items in list
fruits = ["apple", "banana", "cherry"]
print(len(fruits))
```

## Source[^3]
- [[Square brackets (python)|square brackets]] are used for indexing and slicing sequences like lists, strings, and tuples
- Initialize an empty list
	- `my_list = []`
### Properties of Lists
- Ordered
	- Lists maintain order of elements as they are inserted. Position of each element is preserved
- Mutable
	- Lists are [[mutable]]. Contents can be modified after creation. Elements can be added, removed, or changed
- Heterogeneous
	- Lists can store elements of different data types, including integers, strings, and other lists
- Dynamic
	- List can grow or shrink in size as needed. 
- Indexed
	- Elements in list can be accessed by index, starting from 0 for first element
- Iterable
	- Can be iterated over using loops. Allows access to each element in sequence.
- Allows Duplicates
	- Duplicate values allowed. Each occurrence treated as a separate element
- Represented by square brackets
	- Defined using square brackets `[]`, with elements separated by commas
- Supports [[List comprehension (Python)|list comprehension]]
	- Python offers a concise way to create lists using list comprehensions, enabling efficient list generation based on existing iterables
- Methods
	- Lists come with built-in methods for common operations
		- Appending
		- Inserting
		- Removing
		- Sorting
		- Reversing elements
## Source[^4]

| Method    | Description                                                                  |
| --------- | ---------------------------------------------------------------------------- |
| append()  | Adds an element at the end of the list                                       |
| clear()   | Removes all the elements from the list                                       |
| copy()    | Returns a copy of the list                                                   |
| count()   | Returns the number of elements with the specified value                      |
| extend()  | Add the elements of a list (or any iterable), to the end of the current list |
| index()   | Returns the index of the first element with the specified value              |
| insert()  | Adds an element at the specified position                                    |
| pop()     | Removes the element at the specified position                                |
| remove()  | Removes the first item with the specified value                              |
| reverse() | Reverses the order of the list                                               |
| sort()    | Sorts the list                                                               |
- Python does not have built-in support for Arrays, but Python Lists can be used instead.

## References

[^1]: ChatGPT
[^2]: https://www.w3schools.com/python/exercise.asp?filename=exercise_lists1
[^3]: Google's Search Labs | AI Overview
[^4]: https://www.w3schools.com/python/python_ref_list.asp