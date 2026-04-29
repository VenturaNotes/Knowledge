---
aliases:
  - len()
---
## Synthesis
### Description
- Checking the length of two strings is a constant-time operation because Python strings store their length as metadata
	- #question What is meant by metadata here? Where and how is the metadata stored?
### Example
```python
s = "Hello"
t = "World"

if len(s) != len(t): # Performs in constant time
	print("Strings not equal")
```
## Source [^1]
- 
## References

[^1]: 