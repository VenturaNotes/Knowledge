---
aliases:
  - hashable
---
## Synthesis
- 
## Source [^1]
- An object is hashable if it has a hash value which never changes during its lifetime 

## Source[^2]
- Hashable Objects include
	- Integers
		- `1`
		- `2`
		- `3`
		- `-100`
		- `0`
	- Floating-point numbers
		- `1.0`
		- `3.14`
		- `-2.5`
	- Strings
		- `hello`
		- `world`
		- `123`
	- Booleans
		- `True`
		- `False`
	- Tuples (as long as all elements are hashable)
		- `(1, 2, 3)`
		- `("a", "b", "c")`
		- #question Can lists be hashable? 
## References

[^1]: https://docs.python.org/3/glossary.html
[^2]: Google's Search Labs | AI Overview