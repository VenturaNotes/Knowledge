---
aliases:
  - mutable
---
## Synthesis
- Means an object can be modified after it has been created. Includes:
	- Changing contents
	- Adding elements
	- Removing elements
	- Altering existing elements
### Referencing Mutable Objects
```python
a = ["test"]
b = a
b = ["test2"]

print(a)
```
- #question So the output is `["test"]` but shouldn't it be `["test2"]` since a list is a mutable object?
### Mutable Objects
- [[List (Python)|list]]
```python
my_list = [1, 2, 3]
my_list[0] = 10      # Changing an element
my_list.append(4)    # Adding an element
my_list.pop(1)       # Removing an element
print(my_list)       # Output: [10, 3, 4]
```
## Source [^1]
- 
## References

[^1]: 