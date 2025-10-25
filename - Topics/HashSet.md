---
aliases:
  - hash set
---
## Synthesis
### Characteristics / Description
- A hash set is typically represented using the built-in `set` data structure
	- #question What does hash even mean? 
	- #question What other ways are there in python to represent a hash set? 
		- One way is to build the set data structure yourself 

---
- For python, a hash set is typically represented using the built-in `set` data structure
	- You can build the [[HashSet#^zjv7qu|set data structure]] yourself.
	- HashSet and hash set refer to the same concept
		- HashSet is a term commonly used in Java
		- hash set is a more generic phrase
		- It's called a `set` in python but behaves like a hash set internally 
- A HashSet is an unordered collection of unique elements. It uses a [[hash table]] internally, which allows for
	- Fast lookups (O(1) on average)
	- Efficient insertion and deletion
		- On average, insertion and deletion is also $O(1)$ thanks to [[hashing]]
			- Worst case is $O(n)$ if all elements hash to the same bucket
				- #question What is meant by bucket?
			- However, python's `set` and `dict` are highly optimized to make this rare
				- #question How is `set` and `dict` highly optimized in this case?
	- No duplicate elements
- Since it's based on [[hashing]], the elements in a set must be hashable 
	- This means [[immutable]] types like numbers, strings, and tuples
	- Mutable types can't be hashable because if their value changes, their hash will change making it
		- Impossible to find them again in the hash table
		- Could break the internal structure
			- #question What is meant by breaking the internal structure and why is it risky? How is this different from the first point?
		- Therefore, `list` and `dict` are unhashable
- Key Properties
	- Unordered: No guarantee of order
	- Unique elements: No duplicates allowed
	- Mutable: You can add and remove items
- #question What are some edge cases for sets?

### Example
Code
```python
# Creating a set
fruits = {"apple", "banana", "cherry"}

# Adding an element
fruits.add("orange")

# Trying to add a duplicate (won't be added)
fruits.add("banana")

# Checking if an element is in the set
print("apple" in fruits)  # True

# Removing an element
fruits.remove("cherry")

# Iterating over a set
for fruit in fruits:
    print(fruit)
```

- `add` and `append` are based on collection types
	- #question What is a collection type?
	- Use  `.add()` for sets as it means "add this unique item"
	- Use `.append()` for lists as it means "put this at the end"
	- Python doesn't overload method names - each collection type has its own methods
		- #question What does method overloading mean?
		- #question What are the methods within collection types?
- Output (order output may vary for elements in set)
```
True
apple
banana
orange
```

### When to use Set / HashSet
- Remove duplicates from a list
- Check for [[membership]] quickly
	- #question What is meant by membership here? Is membership a programming term?
- When uniqueness is important, not order

### Building set data structure in Python using dictionary ^zjv7qu
```python
class MySet:
    def __init__(self):
        self._data = {}

    def add(self, item):
        self._data[item] = True

    def remove(self, item):
        if item in self._data:
            del self._data[item]

    def contains(self, item):
        return item in self._data
```
- Here, we are reconstructing the set data structure by using python's dictionary which has a hash table under the hood
	- #question What does a hash table look like?
- #question What is the `_data` part called? Is it an attribute?
- #question Why is there an underscore before `_data`?
- #question How can I use this class in a normal program? 
- #question What does `self` mean in this context
- #question What does `class` represent here?
- #question is "contains" known as a method or a function or definitions?

### Building a hash table in Python
```python
hash_table = {}
hash_table["key"] = "value"
```
- You can simulate a hash table in python 
	- #question What exactly is a hash table?
	- #question How is this a hash table? 
	- #question What does hash mean? Can you have a hash sequence or some other form other than table?
- Or build a simple one yourself using:
	- List of buckets
		- #question What does this mean?
	- A hash function to map keys to bucket indices
		- #question What does bucket indices mean?
	- Collision handling (e.g., chaining)
		- #question What is collision handling
		- #question What is chaining and how does it work?
- Basic version of a hash table below
```python
class SimpleHashTable:
    def __init__(self, size=10):
        self.buckets = [[] for _ in range(size)]

    def _hash(self, key):
        return hash(key) % len(self.buckets)

    def insert(self, key, value):
        index = self._hash(key)
        for i, (k, v) in enumerate(self.buckets[index]):
            if k == key:
                self.buckets[index][i] = (key, value)
                return
        self.buckets[index].append((key, value))
```
- #question What does `_innit_` mean for python?
- #question What does `[[] for _ in range(size)]` mean
	- #question In fact, could you explain the code for me with an example?
## Source[^1]
- [Test](https://github.com/VenturaNotes)
## References

[^1]: 