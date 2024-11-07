---
aliases:
  - bool
  - booleans
  - boolean
---
## Synthesis
- Check below
## Source [^1]

| Conditional        | Bool Value | Additional Information        |
| ------------------ | ---------- | ----------------------------- |
| print(10 > 9)      | True       |                               |
| print(10 == 9)     | False      |                               |
| print(10 < 9)      | False      |                               |
| print(bool("abc")) | True       | True when string is non-empty |
| print(bool(""))    | False      | Empty string is false[^2]     |
| print(bool(0))     | False      | 0 always False                |
| print(bool(53))    | True       | Non-zero integer is True      |
## Source [^2]
- In Python, `True` and `False` are built-in constants, not just reserved keywords

```python
# Adding and multiplying booleans
print(True + True) #Output: 2
print(True * 5) #Output: 5
```

### Subset of int()
- The `bool` type is a [[subclass (python)|subclass]] of `int` which means
	- `True` = 1
	- `False` = 0
- Design choice allows [[boolean operations (python)|boolean operations]] to seamlessly work with [[numerical operations (Python)|numerical operations]]

## References

[^1]: https://www.w3schools.com/python/exercise.asp?filename=exercise_booleans1
[^2]: ChatGPT
