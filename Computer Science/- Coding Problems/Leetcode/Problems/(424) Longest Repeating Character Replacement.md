---
Source:
  - https://leetcode.com/problems/longest-repeating-character-replacement/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-16 at 6.20.31 PM.png]]
- Will be 26 uppercase characters in string
- Allowed to replace k different characters in string to any other character we want
- Return length of longest substring containing same letter you can get after performing operations
- Time complexity: $O(26*n)$
	- Main way to solve but could also do $O(n)$ 
- We would want to replace the character that occurs less frequently
- [[Sliding window technique]]
- Will have hashmap or array 
	- Will calculate number of characters we want to replace by taking the length of the window, subtracting by the count of the most occurring character, and the result needs to be less than or equal to k
- There is a way to do it without needing to look through the entire hashmap to find most frequent character
- Solution in $O(26*n)$ time
```python
class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        count = {} #counts occurrences of each character
        res = 0

        l = 0
        for r in range(len(s)):
            count[s[r]] = 1 + count.get(s[r], 0)

            while (r - l + 1) - max(count.values()) > k:
                count[s[l]] -= 1
                l += 1
            
            res = max(res, r - l + 1)
        return res
```
- ![[Screenshot 2024-11-16 at 6.23.12 PM.png]]
- Will have another variable called maximum frequency. Basically the count of the most frequent character at any given time
	- Result will only be maximized as long as you find a new max frequency
	- Can just leave the maximum frequency as is without subtracting because it won't change our result
- Solution in $O(n)$ time
```python
class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        count = {} #counts occurrences of each character
        res = 0

        l = 0
        maxf = 0
        for r in range(len(s)):
            count[s[r]] = 1 + count.get(s[r], 0)
            # This is a constant time operation. No scanning
            maxf = max(maxf, count[s[r]])

            while (r - l + 1) - maxf > k:
                count[s[l]] -= 1
                l += 1
            
            res = max(res, r - l + 1)
        return res
```
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        res = 0
        for i in range(len(s)):
            count, maxf = {}, 0
            for j in range(i, len(s)):
                count[s[j]] = 1 + count.get(s[j], 0)
                maxf = max(maxf, count[s[j]])
                if (j - i + 1) - maxf <= k:
                    res = max(res, j - i + 1)
        return res
```
Time Complexity: $O(n^2)$
Space Complexity: $O(m)$
- Where $n$ is the length of the string and $m$ is the total number of unique characters in the string

### (2) Sliding Window
```python
class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        res = 0
        charSet = set(s)

        for c in charSet:
            count = l = 0
            for r in range(len(s)):
                if s[r] == c:
                    count += 1

                while (r - l + 1) - count > k:
                    if s[l] == c:
                        count -= 1
                    l += 1
                    
                res = max(res, r - l + 1)
        return res
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m)$
- Where $n$ is the length of the string and $m$ is the total number of unique characters in the string

### (3) Sliding Window (Optimal)
```python
class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        count = {}
        res = 0
        
        l = 0
        maxf = 0
        for r in range(len(s)):
            count[s[r]] = 1 + count.get(s[r], 0)
            maxf = max(maxf, count[s[r]])

            while (r - l + 1) - maxf > k:
                count[s[l]] -= 1
                l += 1
            res = max(res, r - l + 1)

        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(m)$
- Where $n$ is the length of the string and $m$ is the total number of unique characters in the string
## References

[^1]: https://www.youtube.com/watch?v=gqXU1UyA8pk
[^2]: https://neetcode.io/solutions/longest-repeating-character-replacement