---
aliases:
  - reversed()
---
## Synthesis
- This does not modify a list in place, but it returns a reverse iterator.
	- #question What is a reverse iterator?
- If you print `reversed([1, 2, 3, 4])`, you get
	- `<list_reverseiterator object at 0x7f4e64d82040>`
### Reversing a List
```python
test = [1, 2, 3, 4]
test = list(reversed(test))
print(test)

# Output: [4, 3, 2, 1]
```
### Iterating a List in Reverse without Modifying List
```python
test = [1, 2, 3, 4]
for x in reversed(test):
	print(x)
	
""" Output
4
3
2
1
"""
```
## Source [^1]
- 
## References

[^1]: