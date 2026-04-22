---
aliases:
  - PEP 8
---
## Synthesis
### Description
- The official [[style guide]] for writing Python code, created to ensure that Python code is readable, consistent, and professional.
- Code is read much more often than it is written. A standard style lets developers understand each other's code more easily.
- PEP 8 is the active and definitive style guide for Python. 
### Important Guidelines Included
- Indentation
	- Use 4 spaces per indentation level (do not use tabs).
		- This mainly means you should use the space character rather than the tab character (`\t`) in your files
		- If your editor is configured to "insert 4 spaces" when you hit the `Tab` key, that's the recommended way to work
		- Just avoid mixing actual tab characters and space characters in same file
			- Causes TabError in Python 3
				- #question What is a TabError?
- Maximum Line Length
	-  Limit all lines to a maximum of 79 characters.
- Blank Lines
```python
import os


def top_level_function():
    pass


class MyClass:
    pass
```
- Use two blank lines around top-level function and class definitions
	- #question Are we supposed to have two blank lines after an import as well for PEP 8?
```python
class MyClass:
	def method_one(self):
		pass

	def method_two(self):
		pass
```
- One blank line around method definitions inside a class.
- Imports
	- Use separate lines and grouped in following order
		- #question What are these imports called? Are they libraries? Modules? Is the name different depending on the language you're using like java? 
	    1. Standard library imports (built into Python)
		    - `import os`
			    - #question What are the os functions?
		    - `import sys`
			    - #question What are some `sys` functions?
		    - `import math`
			    - #question What are some math functions?
	    2. Related third-party imports (installed via `pip`)
			- `import requests`
				- #question What is the purpose of `requests` and give some examples
			- `import pandas as pd`
				- #question What is the purpose of `pandas` and give example
			- `from flask import Flask`
				- #question Can you just import Flask? What does it do?
	    3. Local application/library specific imports (your own files)
		    - `from my_project.utils import helper_function`
			    - #question Show an example of this working
		    - `from .models import User`
			    - #question Show an example of this working
- Whitespace in Expressions
	- Avoid extraneous whitespace inside parentheses, brackets, or before commas and colons.
		- Inside parentheses/brackets: 
			- Correct: `spam(ham[1], {eggs: 2})`
				- #question Is `ham[1]` an item in a list ad `{eggs : 2}` is a key value pair in a dictionary, and `spam` would be the function it's being called into?
			- Wrong: `spam( ham[ 1 ], { eggs: 2 } )`
		- Before comma/colon:
			- Correct: `if x == 4: print(x, y)`
			- Wrong: `if x == 4 : print(x , y)`
		- Before open parenthesis of function call
			- `spam(1)`
			- `spam (1)`
				- #question Would this even run?
- Naming Conventions
	- Functions and Variables: Use `snake_case` (e.g., `my_function`).
	- Classes: Use `PascalCase` (e.g., `MyClass`).
	- Constants: Use `UPPER_CASE_WITH_UNDERSCORES` (e.g., `MAX_OVERFLOW`).
		- However, true constants in Python do not exist. You can technically overwrite any variable, but the `UPPER_CASE` naming convention signals to not modify it
### Tools
- Most modern IDEs (VS Code or PyCharm) have [[linter|linters]] that automatically check your code against PEP 8 and highlight any violations.
## Source [^1]
- 
## References

[^1]: 