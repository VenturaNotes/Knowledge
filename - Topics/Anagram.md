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
### How to Find if Two Strings are Anagrams
- Most efficient in Python is the Frequency Counting method using the `collections.Counter` class. 
#### (1) Frequency Counting Method
- Readable and performs in linear time, $O(n)$. Best for large datasets
- Counts the occurrences of each character in both strings and compares the resulting dictionaries.
	- #question Do you need the `collections.Counter` class to do this or can you write your own version with dictionaries?

```python
from collections import Counter

def is_anagram(str1, str2):
    # Anagrams must have the same length
    if len(str1) != len(str2): # O(1) Constant operation
        return False
    return Counter(str1) == Counter(str2)
```
- Time Complexity: $O(n)$, $n$ is length of strings.
	- This is because creating a frequency map requires iterating through the entire string which is an $O(n)$ operation
- Space Complexity: $O(k)$,  $k$ is # of unique characters.
	- #question Is it really $2k$ since you're making two dictionaries but since factors drop in Big O, it's just $O(k)$? 
- Note
	- The `len(str1) != len(str2)` is not necessary for frequency counting method. However, it's great for efficiency since checking the length of a string is $O(1)$ time because the length is stored as an attribute of the string object. 
		- #question Is there a difference between attribute vs metadata here?
		- It acts as a [[guard clause]] which provides a significant performance boost for negative cases (where strings aren't the same length) at almost zero cost. 
			- #question What is a guard clause?
#### (2) Sorting Method
- Concise (one-liner), slightly less efficient for large strings due to overhead of sorting

```python
def is_anagram(str1, str2):
    return sorted(str1) == sorted(str2)
```

- **Time Complexity:** $O(n \log n)$ due to the sorting algorithm ([[Timsort]] in Python).
	- #question How does Timsort work? Is it just a divide and conquer approach similar to merge sort?
- **Space Complexity:** $O(n)$ or $O(1)$ depending on the implementation of the sorting algorithm's space requirements.
	- #question What is the space complexity of `Timsort`? Is it $O(n)$ or $O(1)$? What is the space complexity of merge sort?
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