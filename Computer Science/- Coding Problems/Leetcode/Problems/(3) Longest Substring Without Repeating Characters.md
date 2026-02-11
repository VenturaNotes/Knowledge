---
Source:
  - https://leetcode.com/problems/longest-substring-without-repeating-characters
Reviewed: false
tags:
  - in-progress
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
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        res = 0
        for i in range(len(s)):
            charSet = set()
            for j in range(i, len(s)):
                if s[j] in charSet:
                    break
                charSet.add(s[j])
            res = max(res, len(charSet))
        return res
```
Time Complexity: $O(n*m)$
Space Complexity: $O(m)$
- Where $n$ is the length of the string and $m$ is the total number of unique characters in the string
### (2) Sliding Window
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
Time Complexity: $O(n)$
Space Complexity: $O(m)$
- Where $n$ is the length of the string and $m$ is the total number of unique characters in the string

### (3) Sliding Window (Optimal)
```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        mp = {}
        l = 0
        res = 0
        
        for r in range(len(s)):
            if s[r] in mp:
                l = max(mp[s[r]] + 1, l)
            mp[s[r]] = r
            res = max(res, r - l + 1)
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(m)$
- Where $n$ is the length of the string and $m$ is the total number of unique characters in the string

## References

[^1]: [Longest Substring Without Repeating Characters - Leetcode 3 - Python](https://www.youtube.com/watch?v=wiGpQwVHdE0)
[^2]: https://neetcode.io/solutions/longest-substring-without-repeating-characters