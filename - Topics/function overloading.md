## Synthesis
### Description
- When multiple functions have the same name but differ in their parameters
### Python 
- #question Apparently function dispatching could do something like function overloading?
- Python does not support traditional function overloading in the same way that languages like C++ or Java do.
	- In Python, if you define multiple functions with the same name, the last definition will overwrite the previous ones. The interpreter does not automatically select a function based on the number or type of arguments passed.
- For a single function name to handle different types or number of arguments:
	- Default Argument Values
		- You can assign default values to parameters, allowing a function to be called with fewer arguments.
			- #question How can I assign a default argument? 
	- Variable-Length Argument Lists
		- The `*args` and `**kwargs` syntax allows a function to accept an arbitrary number of positional and keyword arguments, respectively. This enables a single function definition to handle various argument combinations.
			- #question What is the difference between `*args` and `**kwargs`?
	- Type Hinting and Runtime Checks
		- While not enforcing overloading at definition, you can use type hints and then implement logic within the function to behave differently based on the types of arguments received.
			- #question What would this look like in practice? 
## Source [^1]
- 
## References

[^1]: 