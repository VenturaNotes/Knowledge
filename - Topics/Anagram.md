---
aliases:
  - anagrams
---
## Synthesis
### Definition
- A word formed by rearranging the letters of a different word or phrase
### Example
- `anagram` $\to$ `nagaram`

- A word formed by rearranging the letters
## Source [^1]
- It's a word or phrase formed by rearranging the letters of a different word or phrase
	- Example:
		- anagram 
		- nagaram

## Source[^2]
- When determining if one string is an anagram of another, ignore
	- Spaces
	- Punctuation Characters
	- Character Cases

### #comment

The two strings `"a gentleman"` and `elegantman` are considered anagrams because all the original letters are used exactly once. However, using the [[Counter (Python)|Counter]] module will return false as the space character will be considered.

Code
```python
from collections import Counter

D1 = Counter("a gentleman")
D2 = Counter("elegantman")
print(D1)
print(D2)
print(D1 == D2)
```

Output
```python
Counter({'a': 2, 'e': 2, 'n': 2, ' ': 1, 'g': 1, 't': 1, 'l': 1, 'm': 1})
Counter({'e': 2, 'a': 2, 'n': 2, 'l': 1, 'g': 1, 't': 1, 'm': 1})
False
```
- Counts the space character as 1

## References
[^1]: https://leetcode.com/problems/valid-anagram/description/
[^2]: https://icarus.cs.weber.edu/~dab/cs1410/textbook/8.Strings/progexample/anagram.html#:~:text=%22An%20anagram%20is%20a%20word,cases%20(upper%20or%20lower).