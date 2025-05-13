---
aliases:
  - dictionary
  - dict
  - dictionaries
  - dict()
  - dict (python)
---
## Synthesis
- Initializing (constant time operation)
	- `diner = {}`
	- `diner = dict()`
- Ordered after Python 3.7
	- #question If a dictionary is ordered, does that mean I can retrieve the first or second key of a dictionary?
- To remove a key
	- `car.pop("model")`
	- A `KeyError` will occur if the key doesn't exist
		- #question Give me some details about `KeyError`
- To get value of key
	- `car.get("model")`
## Source [^1]
### Ordered or Unordered
- Python 3.7+, dictionaries are ordered
- Python 3.6 and earlier, dictionaries ore unordered
## Source [^2]
### Dictionary Creation/Initialization
- `diner = {}`
	- Initializing an empty dictionary is a constant-time operation [^3]
- `diner = dict()`

## Source [^3]
- Dictionaries use hashmaps for fast key access
### Example
Input
```python
# Creating a dictionary
student_info = {
    "name": "Alice",
    "age": 23,
    "major": "Computer Science",
    "courses": ["Data Structures", "Algorithms", "Machine Learning"]
}

# Accessing values
print(student_info["name"])  # Output: Alice
print(student_info["age"])   # Output: 23

# Adding a new key-value pair
student_info["graduation_year"] = 2024

# Updating an existing value
student_info["age"] = 24

# Removing a key-value pair
del student_info["major"]

# Iterating through the dictionary
for key, value in student_info.items():
    print(f"{key}: {value}")

```
- #question Is `f` needed in the example above for the print line? 
- The [[del (Python)|del]] keyword is used to delete objects. In Python, everything is an object, so the del keyword can also be used to delete variables, lists, or parts of a list etc. [^4]
- The "f" while iterating through the dictionary stands for [[formatted string literal]]
	- It is a way to embed expressions inside string literals using curly braces. 
- The `student_info.items()` returns a viewable object that displays a list of dictionary's (key, value) [[Tuple (Python)|tuple]] pairs

Output
```python
name: Alice
age: 24
courses: ['Data Structures', 'Algorithms', 'Machine Learning']
graduation_year: 2024

```

### Is it a hashmap?
- In python, a [[HashMap (python)|hashmap]] is considered to be a dictionary. Python's built-in `dict` type is essentially an implementation of a hashmap. Stores key-value pairs and provides efficient lookups, insertions, and deletions based on keys. This provides average-case O(1) time complexity
- Hashmap properties
	- Keys: Must be unique
	- Value: Each key is associated with a value
	- Lookup Time: Close to O(1) to access values based on keys
		- This is because dictionaries use hash tables internally to store key-value pairs
		- So `my_dict(key)` and `key in my_dict` are both O(1) average time complexity
### Description
- Dictionary keys in python must be [[hashable (python)|hashable]], which means they should be [[immutable]]
- [[List (Python)|lists]] are [[mutable (Python)|mutable]] so they cannot be used directly as keys in dictionaries
	- [[Tuple (Python)|tuples]] are immutable and can be used as keys

### Difference between hash table and hash table
- In java [^5]
	- A [[Hashtable (Java)|Hashtable]] does not allow keys or values to be null
	- A [[Hashmap (Java)|Hashmap]] allows any of its values to be null, as well as one of its keys
- In normal programming jargon, a hash map and a hash table are the same thing [^6]
	- Python's `dict` type is more analogous to Hashmap (doesn't inherently provide synchronization guarantees)

#### Synchronization
- Can get synchronization with hashmaps through` threading.Lock` and a `with` statement
	- #question What is synchronization in python
	- #question how is dict related to synchronization in python
	- #question what is the with statement in python
	- #question How to use `threading.lock`
	- #question What is threading in python
	- #question what is the [[with (python)]] statement in python

### Get Method
- Used to retrieve value associated with a given key. If the key does not exist, it returns a specified default value instead of raising a [[KeyError (Python)|KeyError]]. 
- In `dictionary.get(key, default_value)`
	- `key`: Retrieve value the key holds
	- `default_value`: Optional value to return if key not in dictionary. Otherwise, returns `None` by default

### Common Subclasses
- `collections.defaultdict`: Adds automatic default codes
	- #question For a subclass within `dict`, why do you need to go to collections?
	- #question Is collections considered a module? A library? 
- `collections.OrderedDict`: Keeps items in insertion order (before Python 3.7 made this default for `dict`)
	- #question Is this subclass still used?
- `collections.Counter`: Subclass for counting hashable objects
	- #
- `collections.ChainMap`: Groups multiple dictionaries together
- `types.MappingProxyType`: A read-only view of a dictionary

## Source [^7]
### Dictionary Clear()
```python
# dictionary
numbers = {1: "one", 2: "two"}

# removes all the items from the dictionary
numbers.clear()

print(numbers)

# Output: {}
```
- Removes all items from the dictionary
### Dictionary Copy()
```python
original_marks = {'Physics':67, 'Maths':87}

copied_marks = original_marks.copy()


print('Original Marks:', original_marks)
print('Copied Marks:', copied_marks)

# Output: Original Marks: {'Physics': 67, 'Maths': 87}
#         Copied Marks: {'Physics': 67, 'Maths': 87}
```
- Returns a shallow copy of the dictionary
### Dictionary fromkeys()
#question What is the below?
### Dictionary get()
### Dictionary items()
### Dictionary keys()
### Dictionary popitem()
### Dictionary setdefault()
### Dictionary pop()
### Dictionary values()
### Dictionary update()

## Source [^8]
### Methods
```python
# Given
car =	{
  "brand": "Ford",
  "model": "Mustang",
  "year": 1964
}

print(car.get("model")) # Prints value of "model"
car["year"] = 2020 # Changes "year" to 2020
car["color"] = "red" # Changes color to "red"
car.pop("model") # Removes "model" key/value pair
car.clear() # Empties dictionary
```
## Source[^9]
### Comparing Dictionaries
- If two dictionaries have the same number of items, it takes O(n) equality checks with `n`, the number of items
## References

[^1]: https://www.w3schools.com/python/python_dictionaries.asp
[^2]: https://www.codecademy.com/resources/docs/python/dictionaries
[^3]: ChatGPT
[^4]: https://www.w3schools.com/python/ref_keyword_del.asp#:~:text=Definition%20and%20Usage,parts%20of%20a%20list%20etc.
[^5]: https://sentry.io/answers/hashtable-vs-hashmap/#:~:text=Another%20difference%20between%20a%20HashMap,only%20one%20can%20be%20null%20.
[^6]: https://stackoverflow.com/questions/63910315/whats-the-difference-between-a-hashmap-and-a-hashtable-in-python
[^7]: https://www.programiz.com/python-programming/methods/dictionary/items
[^8]: https://www.w3schools.com/python/exercise.asp?filename=exercise_dictionaries1
[^9]: https://stackoverflow.com/questions/57346276/what-is-the-time-complexity-of-comparing-2-dictionaries-in-python#:~:text=Short%20answer%3A%20If%20the%20two,checks%20can%20be%20computationally%20expensive.
