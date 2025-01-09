---
aliases:
  - defaultdict
---
## Synthesis
- 
## Source [^1]
- A subclass of the built-in [[dictionary (Python)|dict]] class.
- Overrides one method and adds one writable instance variable
- It provides a default value for the key that does not exist
### Example
```python
from collections import defaultdict
res = defaultdict(list)
```
- Each key will have a default value of an empty list. Great for appending lists that may not have been initialized yet
### Advantage of defaultdict over regular dictionary
```python
res = {}  # Regular dictionary
for s in strs:
    sortedS = ''.join(sorted(s))
    if sortedS not in res:  # Explicit initialization
        res[sortedS] = []
    res[sortedS].append(s)
```
## References

[^1]: ChatGPT