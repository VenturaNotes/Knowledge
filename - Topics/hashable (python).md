---
aliases:
  - hashable
---
## Synthesis
- Hashable Objects include
	- Integers: `1, 2, 3, -100, 0`
	- Floating-point numbers: `1.0, 3.14, -2.5`
	- [[string (python)|Strings]]: `hello, world, 123`
	- Booleans: `True, False`
	- Tuples (when all elements hashable): `(1,2,3), ("a", "b", "c")`
		- #question can lists be hashable?
		- #question What happens if one element is not hashable? 
	- #question While integers and floating point numbers are specified as hashable objects, are all real and complex numbers considered hashable in python? 
- #question What are some examples of objects that are not hashable?
- #question Are integers, floating-point numbers, strings, and booleans the only types of elements that are hashable? Is it possible to make your own data type or object from a class that is hashable? 
## Source [^1]
- An object is hashable if it has a hash value which never changes during its lifetime 
	- #question What is a hash value?
## References

[^1]: https://docs.python.org/3/glossary.html
