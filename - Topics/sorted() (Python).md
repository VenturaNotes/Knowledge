---
aliases:
  - sorted()
---
## Synthesis
### Definition
- `sorted()` returns a sorted list in ascending order by default
### Example
Code
```python
print(sorted("hello world"))
```
Output
```
[' ', 'd', 'e', 'h', 'l', 'l', 'l', 'o', 'o', 'r', 'w']
```

## Source [^1]
- It is a built-in python function

## Source[^2]
- The `sorted()` function returns a sorted list of the specified [[iterable (python)|iterable]] [[object (Python)|object]]
- You can specify ascending or descending order. 
	- Strings are sorted alphabetically
	- Numbers are sorted numerically
- You cannot sort a list that contains both string values and numeric values

## Source[^3]
- `sorted` will sort a string with spaces inside of it such as `hello world`

## References

[^1]: [[Built-in Functions (Python)]]
[^2]: https://www.w3schools.com/python/ref_func_sorted.asp
[^3]: https://realpython.com/python-sort/#:~:text=sorted()%20will%20not%20treat,sort%20each%20character%2C%20including%20spaces.