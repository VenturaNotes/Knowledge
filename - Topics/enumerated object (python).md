## Synthesis
- 
## Source [^1]
- Result of applying the [[enumerate() (Python)|enumerate()]] function in python to an iterable such as a list, string, or tuple. 
	- A special object that contains pairs of indexes and corresponding elements from the original iterable
- The enumerated object doesn't store values directly like a list does, but does generate them on the fly (as it's an [[iterator (python)|iterator]])
### Example
Code
```python
myVar = [-4, -1, -1, 0, 1, 2]

# Create an enumerated object
enum_obj = enumerate(myVar)

# Print the enumerated object
print(enum_obj)

# Convert it to a list to see the contents
print(list(enum_obj))
```

Output
```
<enumerate object at 0x7f8c2c3b1c40>  # This is the enumerated object itself
[(0, -4), (1, -1), (2, -1), (3, 0), (4, 1), (5, 2)]  # The list of index-element pairs
```

## References

[^1]: ChatGPT