---
aliases:
  - list comprehension
  - list comprehensions
---
## Synthesis
- Can use list comprehension on range
```python
squares = [x**2 for x in range(5)]
print(squares) #Output: [0, 1, 4, 9, 16]
```
- Below is the format for list comprehension
```python
[expression for item in iterable if condition]
```
- The "condition" part is optional
- Read as "do the expression for item in iterable if condition is true"
### Details
- Explicitly driven by a `for` loop structure as it provides a concise way to create lists by iterating over an iterable and optionally including a condition for filtering elements
## Source [^1]
- A type of [[comprehension (python)|comprehension]] in python 
## References

[^1]: https://python-reference.readthedocs.io/en/latest/docs/comprehensions/index.html