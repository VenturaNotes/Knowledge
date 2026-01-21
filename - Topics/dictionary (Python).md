---
aliases:
  - dictionary
  - dict
  - dictionaries
  - dict()
  - dict (python)
---
## Synthesis
- Dictionaries use hashmaps for fast key access
- In computer science, a "map" (also known as an associative array, hash map, hash table, or dictionary in other languages) is a general abstract data type that stores collections of key-value pairs, where each key is unique and maps to a specific value.
	- In Python, the `dict` type is python's implementation of a map. This should not be confused with Python's [[map() (Python)|map()]] function.
### Example
- Input
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
	- #comment I think it's just for a formatted string literal. 
- The [[del (Python)|del]] keyword is used to delete objects. In Python, everything is an object, so the del keyword can also be used to delete variables, lists, or parts of a list etc. [^1]
- The "f" while iterating through the dictionary stands for [[formatted string literal (Python)|formatted string literal]]
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
- In java [^2]
	- A [[Hashtable (Java)|Hashtable]] does not allow keys or values to be null
	- A [[Hashmap (Java)|Hashmap]] allows any of its values to be null, as well as one of its keys
- In normal programming jargon, a hash map and a hash table are the same thing [^3]
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
	- #question For a subclass with## Synthesis
- In `dict`, why do you need to go to collections?
	- #question Is collections considered a module? A library? 
- `collections.OrderedDict`: Keeps items in insertion order (before Python 3.7 made this default for `dict`)
	- #question Is this subclass still used?
- `collections.Counter`: Subclass for counting hashable objects
	- #question How does it work? 
- `collections.ChainMap`: Groups multiple dictionaries together
- `types.MappingProxyType`: A read-only view of a dictionary
### Incrementing Dictionary
```python
my_dict = {}
key = "my_item"

# Check and initialize if key doesn't exist, then increment  
if key not in my_dict:  
	my_dict[key] = 0  
my_dict[key] += 1

# Or, more concisely using .get()  
my_dict[key] = my_dict.get(key, 0) + 1
```
- For the second example above, we have the syntax `dictionary.get(key, default_value)`
	- This retrieves the value the key holds and we have an optional `default_value` if the key is not in the dictionary. Otherwise, `None` is returned my default
### Retrieving key with maximum value in Dictionary
```python
my_dict = {'apple': 5, 'banana': 12, 'cherry': 8, 'date': 12}  
max_key = max(my_dict, key=my_dict.get)  
print(max_key)

# Output: banana
```
- #question How does the `my_dict.get` attribute work? 
- This retrieves the key with the maximum value.
### Initialization
- A constant time operation
```python
# Option 1
diner = {}

# Option 2
diner = dict()
```
### Characteristics / Description
- Dictionaries are collections of key-value pairs
- Ordered from Python 3.7 onwards
	- #question If a dictionary is ordered, does that mean I can retrieve the first or second key of a dictionary?
### Methods
```python
# Given
car =	{
  "brand": "Ford",
  "model": "Mustang",
  "year": 1964
}

# Returns value of key "model" which is "Mustang"
car.get("model")

# Removes the ""model" : "mustang" key-value pair
car.pop("model")

# Adding key-value pair to existing dictionary
car["test"] = "new value"

```
- A `KeyError` will occur if the key doesn't exist
	- #question Give me some details about KeyError
	- #question Does `car.pop("model")` return the value after removal?
#### Adding
- Allows me to add a key-value pair to existing dictionary
```python
car =	{
  "brand": "Ford",
  "model": "Mustang",
  "year": 1964
}

# Adding key-value pair to existing dictionary
car["test"] = "new value"
```
##### Adding Without Existing Key
```python
car =	{
  "brand": "Ford",
  "model": "Mustang",
  "year": 1964
}

# Ensures 1 is added to value in case `test` does not exist
car["test"] = car.get("test", 0) + 1
```
#### Looping Through Values
- This lets you loop through the values of the dictionary
```python
my_dict = {'a': 10, 'b': 20, 'c': 30}

for value in my_dict.values():
    print(value)

'''Output
10
20
30
'''
```
#### Length
- This shows you the length of the dictionary
```python
my_dict = {'a': 1, 'b': 2, 'c': 3}
length = len(my_dict)
print(length) # Output: 3 (which probably means the # of key-value pairs)
```

## Source [^4]
### Ordered or Unordered
- Python 3.7+, dictionaries are ordered
- Python 3.6 and earlier, dictionaries ore unordered
## Source [^5]
### Dictionary Creation/Initialization
- `diner = {}`
	- Initializing an empty dictionary is a constant-time operation
- `diner = dict()`
## Source [^6]
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
```python
# Given
car =	{
  "brand": "Ford",
  "model": "Mustang",
  "year": 1964
}

car.pop("model") # Removes "model" key/value pair
```
### Dictionary values()
### Dictionary update()

## Source [^7]
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
## Source[^8]
### Comparing Dictionaries
- If two dictionaries have the same number of items, it takes O(n) equality checks with `n`, the number of items
## References

[^1]: https://www.w3schools.com/python/ref_keyword_del.asp#:~:text=Definition%20and%20Usage,parts%20of%20a%20list%20etc.
[^2]: https://sentry.io/answers/hashtable-vs-hashmap/#:~:text=Another%20difference%20between%20a%20HashMap,only%20one%20can%20be%20null%20.
[^3]: https://stackoverflow.com/questions/63910315/whats-the-difference-between-a-hashmap-and-a-hashtable-in-python
[^4]: https://www.w3schools.com/python/python_dictionaries.asp
[^5]: https://www.codecademy.com/resources/docs/python/dictionaries
[^6]: https://www.programiz.com/python-programming/methods/dictionary/items
[^7]: https://www.w3schools.com/python/exercise.asp?filename=exercise_dictionaries1
[^8]: https://stackoverflow.com/questions/57346276/what-is-the-time-complexity-of-comparing-2-dictionaries-in-python#:~:text=Short%20answer%3A%20If%20the%20two,checks%20can%20be%20computationally%20expensive.
