---
aliases:
  - array
---
## Synthesis
- 
## Source [^1]
- The `array` module in Python provides a way to create arrays that store elements of the same data type.
	- Python lists can store elements of different types. 
- Arrays created with the `array` module are more memory-efficient than lists when dealing with large sequences of numerical data of the same type
	- #question Does it have to be numerical data? What if it was characters or strings if possible?
### Example
```python
import array
my_array = array.array('i', [1, 2, 3, 4, 5])
```
- Arrays created by specifying a type code and an initial sequence of values
	- The type code `i` indicates the array will store signed integers
		- #question What is a signed integer?
	- `f` is for floats and `d` is for doubles
- While the `array` module provides memory efficiency for homogeneous data, the `NumPy` library offers more advanced array functionalities and is commonly used for numerical and scientific computing in Python. 
	- #question How is `NumPy` better than `array`?

## References

[^1]: Google's Search Labs | AI Overview