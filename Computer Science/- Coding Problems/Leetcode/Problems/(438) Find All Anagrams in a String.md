---
Source:
  - https://leetcode.com/problems/find-all-anagrams-in-a-string/
Reviewed: false
tags:
  - in-progress
---
## Synthesis

### Problem
- Given
	- `s` = string
	- `p` = string
- Return an array of all the start indices of `p`'s anagrams in `s`. You may return the answer in any order.

**Example 1:**

```
Input: s = "cbaebabacd", p = "abc"
Output: [0,6]
Explanation:
The substring with start index = 0 is "cba", which is an anagram of "abc".
The substring with start index = 6 is "bac", which is an anagram of "abc".
```

**Example 2:**

```
Input: s = "abab", p = "ab"
Output: [0,1,2]
Explanation:
The substring with start index = 0 is "ab", which is an anagram of "ab".
The substring with start index = 1 is "ba", which is an anagram of "ab".
The substring with start index = 2 is "ab", which is an anagram of "ab".
```

**Constraints:**

- $1 \le \text{s.length}, \text{p.length} <= 3 * 10^4$
- `s` and `p` consist of lowercase English letters.
### Solution
```python
class Solution:
    def findAnagrams(self, s: str, p: str) -> List[int]:
        
```
- So the sliding window size seems to be based on 
- Do we know if `p` is always greater than `s`? Maybe not. 
- So we use a pattern called sliding window fixed 
## Source [^1]
- 
## References

[^1]: [Find All Anagrams in a String - Leetcode 438 - Python](https://www.youtube.com/watch?v=G8xtZy0fDKg)