---
aliases:
  - center()
---
## Synthesis
### Description
- In `string.center(width)`, the specified `width` refers to the total desired length of the resulting string
- If the original string is shorter than this `width`, it will be padded with spaces (or a specified fill character) on both sides to reach that total width, effectively centering the original string within that space.
	- #question What happens if the original string is longer than the `width`?
### Example
```python
s = "hello"
print(s.center(10))      # Output: "  hello   "
print(s.center(10, '*')) # Output: "**hello***"
```
- #question How the `center()` method choose the number of `*` on either side? For example, why are there 2 `*` on the left side of `hello` and 3 `*` on the right side of `hello` and not the other way around?
## Source [^1]
- 
## References

[^1]: 