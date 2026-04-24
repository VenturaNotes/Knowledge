---
aliases:
  - anagrams
tags:
  - in-progress
---
## Synthesis
### Definition
- A word formed by rearranging the letters of a different word or phrase
### Example
- `anagram` $\to$ `nagaram`
- A word formed by rearranging the letters
## Organize
### Checking If Two Strings Are Anagrams
The best and most efficient way to check if two strings are anagrams in Python is by using the **Frequency Counting** method, specifically utilizing the `collections.Counter` class.
### 1. The Frequency Counting Method (Recommended)
This method is considered the best because it is highly readable and performs in linear time, $O(n)$. It counts the occurrences of each character in both strings and compares the resulting dictionaries.

```python
from collections import Counter

def is_anagram(str1, str2):
    # Anagrams must have the same length
    if len(str1) != len(str2):
        return False
    return Counter(str1) == Counter(str2)
```

- **Time Complexity:** $O(n)$, where $n$ is the length of the strings.
- **Space Complexity:** $O(k)$, where $k$ is the number of unique characters.

### 2. The Sorting Method
Another common approach is the **Sorting** method. While it is very concise (often a one-liner), it is slightly less efficient for very large strings due to the overhead of sorting.

```python
def is_anagram(str1, str2):
    return sorted(str1) == sorted(str2)
```

- **Time Complexity:** $O(n \log n)$ due to the sorting algorithm (Timsort in Python).
- **Space Complexity:** $O(n)$ or $O(1)$ depending on the implementation of the sorting algorithm's space requirements.

### Summary Table

| Method | Name | Time Complexity | Best For |
| --- | --- | --- | --- |
| `collections.Counter` | Frequency Counting | $O(n)$ | Performance and large datasets |
| `sorted()` | Sorting | $O(n \log n)$ | Quick scripts and readability |

If you are storing these snippets in your vault, you might want to create a note titled [[Python String Algorithms]] to keep track of these patterns!

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