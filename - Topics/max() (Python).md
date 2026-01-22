---
aliases:
  - max()
---
## Synthesis
- Finds the largest item in an [[iterable]]. 
### Numbers
- Returns largest number
```python
max_value = max([0, 2, 45, 3, 44]) # 45
```
- #question What data types does max() or min() work on? Does it work on sets? Lists? Is List or hashmaps data types or is there some other name for them?
### Alphabetical / Strings
- Compares strings alphabetically. "date" would be last as it comes last alphabetically.
```python
words = max(["apple", "banana", "cherry", "date"]) # date
```
### Dictionary
- Operates on `keys` by default. 
- Compares the keys `5, 4, 3` and returns 5 as it's the greatest. Ignores the values `6, 3, 6`
```python
my_dict = max({5: 6, 4: 3, 3: 6}) # 5
```
## Source [^1]
- 
## References

[^1]: