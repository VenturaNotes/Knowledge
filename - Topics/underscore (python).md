---
aliases:
  - underscore
---
## Synthesis
- #question What is `_` in a for loop?
- The underscore `_` is commonly used as a throwaway variable name when the value of the variable is not going to be used.
- This usage is part of a broader convention where _ serves as a placeholder for variables whose values are not needed.
	- Technically, you could use the `_` as it will be treated like any other variable.
```python
_ = "hello world"
print(_) #Output: Hello world

#I can use the underscore this way but conventionally this is incorrect
```
### Example
```python
for _ in range(0, 100):
	print("This will print 100 times")

# The underscore is used to iterate over a range of numbers without needing to use the loop variable
```
### Other Uses
- Ignoring values in [[unpacking (python)|unpacking]]
	- When unpacking a tuple or list, you might want to ignore some values. Using `_` for those values indicates they are not needed
```python
coordinates = (1, 2, 3)
x, _, z = coordinates
print(x, z)  # Output: 1 3

```

- Ignoring values in functions
	- When defining a lambda function or using a function that returns multiple values, you can ignore some values using `_`
```python
def function():
    return 1, 2, 3

a, _, c = function()
print(a, c)  # Output: 1 3

```
- Placeholder in looping constructs
	- When using [[looping construct (python)|looping constructs]] like [[List comprehension (Python)|list comprehensions]], you might use `_` if the loop variable is not needed
```python
_ = [print("Hello") for _ in range(5)]
```
- #question What does it mean if you assign `_` to the loop, does it mean it it will just not be referenced?
- Translation placeholder
	- `_` conventionally used as a function name for translations in [[internationalization (python)|internationalization]] libraries such as `gettext`
		- #question What is [[gettext (python)|gettext]]
```python
from gettext import gettext as _
print(_("Hello, world!"))
```
- #question Help me understand this code
## Source [^1]
- 
## References

[^1]: 