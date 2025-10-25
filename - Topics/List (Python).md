---
aliases:
  - list
  - lists
---
## Synthesis
- Characteristics
	- Ordered, mutable, allows duplicate elements, can store items of different data types 
- Given the list `fruits = ["apple", "banana", "cherry"]`
	- Remove an element
		- `fruits.remove("banana")`
	- Add multiple elements to list 
		- `hello = []`
		- `hello.extend(fruits)`
		- `print(hello)` would give output `["apple", "banana", "cherry"]`
### Description
- [[Square brackets (python)|square brackets]] are used for indexing and slicing sequences like lists, strings, and tuples
	- #question What does the context for this look like? 
- Initialize an empty list
	- `my_list = []`
### Properties of Lists
- Ordered
	- Order of elements maintained as inserted and position preserved
- [[Mutable]]
	- Elements can be modified after creation (added, removed, or changed)
- Heterogeneous
	- Elements of different data types can be stored (integers, strings, lists, etc.)
- Dynamic
	- Grows and shrinks in size as needed
- Indexed
	- Elements can be accessed by index (0 for first element)
- Iterable
	- Can be iterated over using loops. Allows access to each element in sequence (given order)
- Duplicates Allowed
	- Each occurrence treated as separate element
- Square Bracket Representation
	- Defined using square brackets `[]`, with elements separated by commas
- Supports [[List comprehension (Python)|list comprehension]]
	- Python offers a concise way to create lists using list comprehensions, enabling efficient list generation based on existing iterables
### Methods
- Appending
- Inserting
- Removing
- Sorting
- Reversing elements

### Remove Element from List
#### Remove Method
```python
#Remove element from list
fruits = ["apple", "banana", "cherry"]
fruits.remove("banana")
```
#### Pop Method
- The pop method removes an element from the list
	- `my_list.pop(1)` would remove the element at index 1
	- `my_list.pop()` Just removes the last element
	- In both cases, `pop()` returns this element
```python

```

### .extend() Method
- `list.extend(iterable)` adds all elements from another iterable (like list, tuple, or string) to the end of the current list
	- Similar to doing multiple `.append()` calls at once
#### Example
```python
nums = [1, 2, 3]
nums.extend([4, 5, 6])
print(nums)

# Output; [1, 2, 3, 4, 5, 6]
```
### Append / Add Elements to list
```python
#Add element to end of list
fruits = ["apple", "banana", "cherry"]
fruits.append("orange")
```
### Differences between Extend and/vs Append
```python
nums = [1, 2, 3]
nums.append([4, 5, 6])

nums2 = [1, 2, 3]
nums2.extend([4, 5, 6])

'''Result
nums = [1, 2, 3, [4, 5, 6]]
# The entire list is added as one element

nums2 = [1, 2, 3, 4, 5, 6]
# Each item is added individually
'''
```
- Lists are not [[hashable (python)|hashable]] since lists are [[mutable (Python)|mutable]]
	- An object is hashable if it has a hash value which never changes during its lifetime
	- #question What makes an object in python?
	- #question Will an object have a hash value if it's immutable?
- Initializing list with default values
```python
numbers = [0] * 5  # [0, 0, 0, 0, 0]
```

### Extend List
```python
test = [0] * 3
hello = []

hello.extend(test)

print(hello)

#Output: [0, 0, 0]
```
- Allows you to append elements to a list
### Description of Lists
- Type flexibility: Can hold elements of different data types
	- #question Is "type flexibility" a common term?
- Built-in: Part of python's core syntax, created with square brackets `[]`
- Example: `my_list = [1, "hello", 3.14, True]`
- Common use: Preferred for general-purpose, dynamic collections
## Source [^1]
- An object is hashable if it has a hash value which never changes during its lifetime
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
- #comment If you do not specify the element in `pop()`, then 

## References

[^1]: https://docs.python.org/3/glossary.html
[^2]: https://www.w3schools.com/python/exercise.asp?filename=exercise_lists1
[^3]: https://www.w3schools.com/python/python_ref_list.asp
