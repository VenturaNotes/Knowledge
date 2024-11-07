---
aliases:
  - ord()
---
## Synthesis
```python
print(ord('a')) # Output: 97
print(ord('b')) # Output: 98
```
- Numeric representation of character
## Source [^1]
- Takes a single character (a string of length 1) and returns its [[unicode code point]]
	- The Unicode code point is a numeric representation of the character
- It will always convert a single character to a number
	- Valid characters include lower and uppercase letters, digits, punctuation marks, special characters (ñ), and even emojis. 
- `ord()` is short for [[ordinal]]
### Potential Errors
- A [[TypeError (Python)|TypeError]] will be raised if input is not a single character or if it is an empty string

### Example
- `ord("a")` returns `97`, which is the Unicode code point for the lowercase letter `a`
## References

[^1]: ChatGPT