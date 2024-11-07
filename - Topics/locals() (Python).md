---
aliases:
  - locals()
---
## Synthesis
- 
## Source [^1]
- Returns a dictionary containing the current [[local symbol table]]
	- This symbol table holds information about [[local variable (Python)|local variables]] in the current [[scope (Python)|scope]] including variables, functions, and their values. 
- If you call `locals()` within a function, it returns a dictionary representing the local symbol table of that function. The keys are the names of variables, functions and objects defined in the function. The values are their corresponding values

### Example
```python
def example_function():
    a = 10
    b = 'hello'
    print(locals())

example_function()

#Output: {'a': 10, 'b': 'hello'}

```

### Usage
- Often used in debugging or [[dynamic code generation]] scenarios where you need to access or manipulate local variables programmatically.
- Modifying dictionary returned by `locals()` not recommended as it can lead to unexpected behavior

## Source [^2]
- The dictionary returned by `locals()` is not a view of the function's locals, but a copy. Therefore, modification of the dictionary returned from locals() will not modify the local variables of the function

Code from ChatGPT
```python
def example_function():
    a = 10
    print(locals()) #Output: {'a': 10}
    locals()['a'] = 20  # Modifying local value
    print(a)  # Output: 10
    print(locals()) #Output: {'a': 10}

example_function()

```
## References

[^1]: ChatGPT
[^2]: https://codeql.github.com/codeql-query-help/python/py-modification-of-locals/