---
Source:
  - https://leetcode.com/problems/palindromic-substrings/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-24 at 3.21.47 AM.png]]
- A [[substring]] is a contiguous sequence of characters within the string.
- Brute force solution is $O(n^3)$ and optimized solution is $O(n^2)$ 
- Finding the time complexity for even numbers is $O(n^2)$ 
- Find the time complexity for odd numbers is $O(n^2)$ 
- Adding the two together will still give an overall time complexity of $O(n^2)$
```python
class Solution:
    def countSubstrings(self, s: str) -> int:
        res = 0

        for i in range(len(s)):
            l = r = i
            while l >= 0 and r < len(s) and s[l] == s[r]:
                res += 1
                l-= 1
                r += 1
            
            l = i
            r = i + 1
            while l >= 0 and r < len(s) and s[l] == s[r]:
                res += 1
                l-=1
                r += 1
        return res
```
- And now condensed into a single function
```python
class Solution:
    def countSubstrings(self, s: str) -> int:
        res = 0

        for i in range(len(s)):
            res += self.countPali(s, i, i)
            res += self.countPali(s, i, i+1)
        return res
    
    def countPali(self, s, l, r):
        res = 0
        while l >= 0 and r < len(s) and s[l] == s[r]:
            res += 1
            l -= 1
            r += 1
        return res
```
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def countSubstrings(self, s: str) -> int:
        res = 0
        
        for i in range(len(s)):
            for j in range(i, len(s)):
                l, r = i, j
                while l < r and s[l] == s[r]:
                    l += 1
                    r -= 1
                res += (l >= r)
                
        return res
```
Time Complexity: $O(n^3)$
Space Complexity: $O(1)$
### (2) Dynamic Programming
```python
class Solution:
    def countSubstrings(self, s: str) -> int:
        n, res = len(s), 0
        dp = [[False] * n for _ in range(n)]

        for i in range(n - 1, -1, -1):
            for j in range(i, n):
                if s[i] == s[j] and (j - i <= 2 or dp[i + 1][j - 1]):
                    dp[i][j] = True
                    res += 1

        return res
```
Time Complexity: $O(n^2)$
Space Complexity: $O(n^2)$

### (3) Two Pointers
```python
class Solution:
    def countSubstrings(self, s: str) -> int:
        res = 0
        
        for i in range(len(s)):
            # odd length
            l, r = i, i
            while l >= 0 and r < len(s) and s[l] == s[r]:
                res += 1
                l -= 1
                r += 1

            # even length
            l, r = i, i + 1
            while l >= 0 and r < len(s) and s[l] == s[r]:
                res += 1
                l -= 1
                r += 1
        
        return res
```
Time Complexity: $O(n^2)$
Space Complexity: $O(1)$
### (4) Two Pointers (Optimal)
```python
class Solution:
    
    def countSubstrings(self, s: str) -> int:
        res = 0

        for i in range(len(s)):
            res += self.countPali(s, i, i)
            res += self.countPali(s, i, i + 1)
        return res

    def countPali(self, s, l, r):
        res = 0
        while l >= 0 and r < len(s) and s[l] == s[r]:
            res += 1
            l -= 1
            r += 1
        return res
```
Time Complexity: $O(n^2)$
Space Complexity: $O(1)$
### (5) Manacher's Algorithm
```python
class Solution:
    def countSubstrings(self, s: str) -> int:

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
        res = 0
        for i in p:
            res += (i + 1) // 2
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
## References

[^1]: https://www.youtube.com/watch?v=4RACzI5-du8
[^2]: https://neetcode.io/solutions/palindromic-substrings