---
Source:
  - https://leetcode.com/problems/longest-substring-without-repeating-characters
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-16 at 6.14.05 PM.png]]
- Find the length of the longest substring without repeating characters
- [[Sliding window technique]]
- Can use sets for substring to check if we have a duplicate instantly
- Can cut time complexity to O(n)
	- Can add or remove values from set but that's a very quick operation
	- Memory complexity is O(n) because of set as each character in string could all be unique
```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        charSet = set()
        l = 0
        res = 0

        for r in range(len(s)):
            while s[r] in charSet:
                charSet.remove(s[l])
                l += 1
            charSet.add(s[r])
            res = max(res, r - l + 1)
        return res
```
- #question Is this set ordered?
## References

[^1]: https://www.youtube.com/watch?v=wiGpQwVHdE0