---
aliases:
  - enumerate()
---
## Synthesis
### Description
- Iterates over an iterable (such as list, tuple, string) while keeping track of index of current item.
### Example
```python
A = [10, 11, 12]

for i,j in enumerate(A):
    print("index i: " + str(i) + " element j: " + str(j))
```

Output
```
index i: 0 element j: 10
index i: 1 element j: 11
index i: 2 element j: 12
```
- It seems like you need to have two variables to use enumerate
### Description 2
- enumerate() is a built-in function that allows you to iterate over an [[iterable (python)|iterable]] (like a list, tuple, or string) while also keeping track of the index of the current item.
### Enumerated Class
```python
A = [1, 2, 3]
print(type(enumerate(A)))
```
- Outputs an enumerated class
## Source [^1]
- Adds a counter to an [[iterable (python)|iterable]] such as a list and returns it as an [[enumerated object (python)|enumerated object]].
	- #question what is meant by enumerated object?

## Source[^2]
```python
a = ["Geeks", "for", "Geeks"]

# Iterating list using enumerate to get both index and element
for i, name in enumerate(a):
    print(f"Index {i}: {a}")

# Converting to a list of tuples
print(list(enumerate(a)))
```
- `i` is the index and `name` is the element
## References

[^1]: ChatGPT
[^2]: https://www.geeksforgeeks.org/enumerate-in-python/
