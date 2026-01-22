---
tags:
  - in-progress
---
## Synthesis
- `key` is the specific parameter name that functions like `max()`, `min()`, `sorted()`, `list.sort()`, etc., use to accept a custom comparison function. It's part of the function's signature
	- #question What is a function's signature? Or is it just function signature? 
- For example, if you call a function `my_function(arg1, arg2=default_value)`, you have to use `arg1` and `arg2` as the parameter names if you want to pass values to them by name. `key` is just one such parameter name for thees specific built-in functions
	- #question What other parameter names are there? 
	- #question Could you give me an example of using this `my_function` example? 
	- #question Are dictionaries iterables or iterators? 
- `key` argument is designed to work with any iterable (lists, tuples, sets) and even custom objects, not just dictionary keys
	- A set is considered an iterable
		- #question What would the order be?
- `key` is a common parameter in functions like `max()`, `min()`, `sorted()`, and `list.sort()`. It provides a function for custom comparison/sorting 
- You pass a function (often a lambda function) to this key parameter to customize how those functions perform their comparisons or sorting
- lambda functions, tuples for tie-breaking. 
## Source [^1]
- 
## References

[^1]: 