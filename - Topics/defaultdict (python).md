---
aliases:
  - defaultdict
---
## Synthesis
- A subclass of the built-in [[dictionary (Python)|dict]] class.
	- #question What are others subclasses for the built-in `dict` class? Definitions and examples would be very helpful. 
- `defaultdict` overrides the `__missing__()` method of `dict`, so when a key is missing, it doesn't raise a `KeyError`; instead, it uses the provided default factory (e.g., `list`, `int`) to create a default value
	- #question What is meant by default factory? Is this the correct term? 
	- #question Does a `__missing__()` method actually exist in `dict`? 
	- #question How can it create a default value with a missing key? Could you give an example?
- `defaultdict` adds a new [[attribute]] called `.default_factory`, which stores the function used to create default values (e.g., `list` in your example). You can access or modify it like a regular attribute.
	- #question What is meant by attribute?
	- #question What does `.default_factory` look like? How do we access this attribute?
	- #question Show an example of `.default_factory`
	- #question What ways can we modify it? 
	- #question Is the new attribute known as a writeable instance variable? 
- It provides a default value for the key that does not exist
	- #question What would the key be? Could you show an explicit difference between `dict` vs `defaultdict` and how they handle keys differently
	- Default value examples
		- `defaultdict(list)` $\to$ default value is `[]`
			- #question Does this mean if I create a new key without a value, the value will automatically be an empty list?
		- `defaultdict(int)` $\to$ default value is 0
		- `defaultdict(set)` $\to$ default value is `set()`
			- #question What does `set()` look like since `{}` initializes a dictionary
				- #question Is it initializes or instantiates or is that just a c# vs python thing?
- `defaultdict` is especially useful when building collections like lists, sets, or counters grouped by some computed keys
	- #question What are some examples of computed keys? 
### Example
Code
```python
from collections import defaultdict
res = defaultdict(list)

# Add an item to key 'a'
res['a'].append(4)

print(res)
```
- Each key will have a default value of an empty list. Great for appending lists that may not have been initialized yet
Output
```
defaultdict(<class 'list'>, {'a': [4]})
```
- When printing a `defaultdict`, Python shows its actual type and its contents
	- The factory function is `<class 'list'>
		- #question What is a factory function?
	- The current contents are `{'a': [4]}`
- To print the dictionary content, just convert it to `dict`
	- `print(dict(res)) # Output: {'a' : [4]}`
### Advantage of defaultdict over regular dictionary
- #question What does `strs` represent?
- Using `dict`
```python
res = {} # Regular dictionary
for s in strs:
    sortedS = ''.join(sorted(s))
    if sortedS not in res:
        res[sortedS] = [] # Manual initialization
    res[sortedS].append(s)
```
- Using `defaultdict(list)`
```python
from collections import defaultdict
res = defaultdict(list)
for s in strs:
    sortedS = ''.join(sorted(s))
    res[sortedS].append(s)  # No need to check or initialize
```
- Eliminates the boilerplate code (`if key not in res`) and reduces the risk of `KeyError`. Makes code cleaner and more efficient
	- #question what is boilerplate code?
	- #question How does it reduce the risk of `KeyError` that `if key not in res` is unable to do?
- #question How does `defaultdict` handle missing keys?

## Source [^1]
- 
## References

[^1]: 