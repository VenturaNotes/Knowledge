---
aliases:
  - Counter
---
## Synthesis

### Description
- A dictionary subclass that holds the count of each element present in string.
### Example
Code
```python
from collections import Counter

D1 = Counter("anagram")
D2 = Counter("nagaram")
print(D1)
print(D2)
print(D1 == D2)
```
Output
```
Counter({'a': 3, 'n': 1, 'g': 1, 'r': 1, 'm': 1})
Counter({'a': 3, 'n': 1, 'g': 1, 'r': 1, 'm': 1})
True
```
## Source 1[^1]
- It's from collections
- Can count several repeated objects at once

## Source 2[^2]
- It's a container that will hold the count of each of the elements present in the container
	- It is a dict subclass that stores counts for hashable objects. [^3]
## References

[^1]: https://realpython.com/lessons/counting-python-counter-overview/
[^2]: https://www.guru99.com/python-counter-collections-example.html
[^3]: https://www.codecademy.com/resources/docs/python/collections-module/Counter