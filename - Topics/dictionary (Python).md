---
aliases:
  - dictionary
  - dict
  - dictionaries
  - dict()
  - dict (python)
---
## Synthesis
## Source [^1]
### Description
- As of Python version 3.7, dictionaries are ordered. In Python 3.6 and earlier, dictionaries are unordered. 
 
## Source [^2]
### Description
- Creating a dictionary
	- `diner = {}`
	- `diner = dict()`

## Source [^3]

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
### Description
- Dictionary keys in python must be [[hashable (python)|hashable]], which means they should be [[immutable]]
- [[List (Python)|lists]] are [[mutable (Python)|mutable]] so they cannot be used directly as keys in dictionaries
	- [[Tuple (Python)|tuples]] are immutable and can be used as keys

### Difference between hash table and hash table
- In java [^7]
	- A [[Hashtable (Java)|Hashtable]] does not allow keys or values to be null
	- A [[Hashmap (Java)|Hashmap]] allows any of its values to be null, as well as one of its keys
- In normal programming jargon, a hash map and a hash table are the same thing [^8]
	- Python's `dict` type is more analogous to Hashmap (doesn't inherently provide synchronization guarantees)

#### Synchronization
- Can get synchronization with hashmaps through` threading.Lock` and a `with` statement
	- #question What is synchronization in python
	- #question how is dict related to synchronization in python
	- #question what is the with statement in python
	- #question How to use `threading.lock`
	- #question What is threading in python
	- #question what is the [[with (python)]] statement in python
## Source [^5]

### Methods
- [[Built-in Functions (Python)|Built-in Functions]]

## Source [^6]
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
## References

[^1]: https://www.w3schools.com/python/python_dictionaries.asp
[^2]: https://www.codecademy.com/resources/docs/python/dictionaries
[^3]: ChatGPT
[^4]: https://www.w3schools.com/python/ref_keyword_del.asp#:~:text=Definition%20and%20Usage,parts%20of%20a%20list%20etc.
[^5]: https://www.programiz.com/python-programming/methods/dictionary/items
[^6]: https://www.w3schools.com/python/exercise.asp?filename=exercise_dictionaries1
[^7]: https://sentry.io/answers/hashtable-vs-hashmap/#:~:text=Another%20difference%20between%20a%20HashMap,only%20one%20can%20be%20null%20.
[^8]: https://stackoverflow.com/questions/63910315/whats-the-difference-between-a-hashmap-and-a-hashtable-in-python