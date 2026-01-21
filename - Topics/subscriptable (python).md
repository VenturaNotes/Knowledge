## Synthesis
### Description
- An object is subscriptable if it implements the `__getitem__` method, allowing its elements to be accessed using square brackets `[]`.
	- This mechanism is known as subscripting or indexing
### Example
- The `__getitem__` method is implicitly called when you use square brackets `[]` to access elements of a list (or other subscriptable objects)
```python
my_list = [10, 20, 30, 40, 50]

# Accessing an element using square brackets
# This implicitly calls my_list.__getitem__(0)
first_element = my_list[0] # 10

# Explicitly call __getitem__ (not common practice)
first_element = my_list.__getitem__(0)
```
- Basically `my_list[0]` is shorthand (syntactic sugar) for `my_list.__getitem__(0)`
## Source [^1]
- An object is subscriptable if it implements the `__getitem__()` method. This describes objects as containers meaning they contain other objects
	- This includes strings, lists, tuples, and dictionaries
## References

[^1]: https://stackoverflow.com/questions/216972/what-does-it-mean-if-a-python-object-is-subscriptable-or-not