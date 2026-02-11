---
Source:
  - https://leetcode.com/problems/longest-palindromic-substring
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-24 at 3.14.55 AM.png]]
- Want to return the longest palindromic substring of a string.
	- Can have multiple answers
- [[Palindrome]]
	- Writing in reverse order is the exact same string
- For any given substring, to check if it's a palindrome, it will take linear time complexity
- Brute force approach is $n^3$ 
	- We have total $n^2$ substrings to check and it takes $n$ to check a substring giving $O(n^3)$ for a time complexity
- Need to do a linear scan for every single substring
- Can get time complexity of $O(n^2)$ when expanding characters
	- However, an edge case we're missing is a palindrome of even length
	- It's only a slight edge case which can be easily added to the solution
```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        res = ""
        resLen = 0

        for i in range(len(s)):
            # odd length
            l, r = i, i
            while l >= 0 and r < len(s) and s[l] == s[r]:
                if (r - l + 1) > resLen:
                    res = s[l:r+1]
                    resLen = r - l + 1
                l -= 1
                r += 1
            
            # even length
            l, r = i, i + 1
            while l >= 0 and r < len(s) and s[l] == s[r]:
                if (r - l + 1) > resLen:
                    res = s[l:r+1]
                    resLen = r - l + 1
                l -= 1
                r += 1
        
        return res
```
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        res, resLen = "", 0

        for i in range(len(s)):
            for j in range(i, len(s)):
                l, r = i, j
                while l < r and s[l] == s[r]:
                    l += 1
                    r -= 1
                
                if l >= r and resLen < (j - i + 1):
                    res = s[i : j + 1]
                    resLen = j - i + 1
        return res
```
Time Complexity: $O(n^3)$
Space Complexity: $O(1)$

### (2) Dynamic Programming
```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        resIdx, resLen = 0, 0
        n = len(s)

        dp = [[False] * n for _ in range(n)]

        for i in range(n - 1, -1, -1):
            for j in range(i, n):
                if s[i] == s[j] and (j - i <= 2 or dp[i + 1][j - 1]):
                    dp[i][j] = True
                    if resLen < (j - i + 1):
                        resIdx = i
                        resLen = j - i + 1

        return s[resIdx : resIdx + resLen]
```
Time Complexity: $O(n^2)$
Space Complexity: $O(n^2)$
### (3) Two Pointers
```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        resIdx = 0
        resLen = 0

        for i in range(len(s)):
            # odd length
            l, r = i, i
            while l >= 0 and r < len(s) and s[l] == s[r]:
                if (r - l + 1) > resLen:
                    resIdx = l
                    resLen = r - l + 1
                l -= 1
                r += 1

            # even length
            l, r = i, i + 1
            while l >= 0 and r < len(s) and s[l] == s[r]:
                if (r - l + 1) > resLen:
                    resIdx = l
                    resLen = r - l + 1
                l -= 1
                r += 1

        return s[resIdx : resIdx + resLen]
```
Time Complexity: $O(n^2)$
Space Complexity: $O(1)$

### (4) Manacher's Algorithm
```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        def manacher(s):
            t = '#' + '#'.join(s) + '#'
            n = len(t)
            p = [0] * n
            l, r = 0, 0
            for i in range(n):
                p[i] = min(r - i, p[l + (r - i)]) if i < r else 0
                while (i + p[i] + 1 < n and i - p[i] - 1 >= 0 
                       and t[i + p[i] + 1] == t[i - p[i] - 1]):
                    p[i] += 1
                if i + p[i] > r:
                    l, r = i - p[i], i + p[i]
            return p
        
        p = manacher(s)
        resLen, center_idx = max((v, i) for i, v in enumerate(p))
        resIdx = (center_idx - resLen) // 2
        return s[resIdx : resIdx + resLen]
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
## References

[^1]: [Longest Palindromic Substring - Python - Leetcode 5](https://www.youtube.com/watch?v=XYQecbcd6_c)
[^2]: https://neetcode.io/solutions/longest-palindromic-substring