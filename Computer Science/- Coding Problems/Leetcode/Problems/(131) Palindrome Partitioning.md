---
Source:
  - https://leetcode.com/problems/palindrome-partitioning/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-22 at 12.20.37 AM.png]]
- Want to partition `s` so that every single substring of the partition is a [[palindrome]]. Return all possible palindrome partitioning of `s`
	- A palindrome string is a string that reads the same backward as forward
- The brute force way to solve this problem also happens to be the main way to solve this problem
	- Will use [[backtracking]]
- Time complexity is $O(2^n)$
```python
class Solution:
    def partition(self, s: str) -> List[List[str]]:
        res = []
        part = []

        def dfs(i):
            if i >= len(s):
                res.append(part.copy())
                return
            for j in range(i, len(s)):
                if self.isPali(s, i, j):
                    part.append(s[i:j+1])
                    dfs(j + 1)
                    part.pop()
        dfs(0)
        return res
    def isPali(self, s, l, r):
        while l < r:
            if s[l] != s[r]:
                return False
            l, r = l + 1, r - 1
        return True
```

## Source[^2]
### (1) Backtracking (Pick / Not Pick)
```python
class Solution:
    def partition(self, s: str) -> List[List[str]]:
        res, part = [], []

        def dfs(j, i):
            if i >= len(s):
                if i == j:
                    res.append(part.copy())
                return
            
            if self.isPali(s, j, i):
                part.append(s[j : i + 1])
                dfs(i + 1, i + 1)
                part.pop()
            
            dfs(j, i + 1)
        
        dfs(0, 0)
        return res

    def isPali(self, s, l, r):
        while l < r:
            if s[l] != s[r]:
                return False
            l, r = l + 1, r - 1
        return True
```
Time Complexity: $O(n*2^n)$
Space Complexity: $O(n)$

### (2) Backtracking
```python
class Solution:
    
    def partition(self, s: str) -> List[List[str]]:
        res, part = [], []

        def dfs(i):
            if i >= len(s):
                res.append(part.copy())
                return
            for j in range(i, len(s)):
                if self.isPali(s, i, j):
                    part.append(s[i : j + 1])
                    dfs(j + 1)
                    part.pop()

        dfs(0)
        return res

    def isPali(self, s, l, r):
        while l < r:
            if s[l] != s[r]:
                return False
            l, r = l + 1, r - 1
        return True
```
Time Complexity: $O(n*2^n)$
Space Complexity: $O(n)$
### (3) Backtracking (DP)
```python
class Solution:
    
    def partition(self, s: str) -> List[List[str]]:
        n = len(s)
        dp = [[False] * n for _ in range(n)]
        for l in range(1, n + 1):
            for i in range(n - l + 1):
                dp[i][i + l - 1] = (s[i] == s[i + l - 1] and
                                    (i + 1 > (i + l - 2) or
                                    dp[i + 1][i + l - 2]))

        res, part = [], []
        def dfs(i):
            if i >= len(s):
                res.append(part.copy())
                return
            for j in range(i, len(s)):
                if dp[i][j]:
                    part.append(s[i : j + 1])
                    dfs(j + 1)
                    part.pop()

        dfs(0)
        return res
```
Time Complexity: $O(n*2^n)$
Space Complexity: $O(n^2)$

### (4) Recursion
```python
class Solution:
    
    def partition(self, s: str) -> List[List[str]]:
        n = len(s)
        dp = [[False] * n for _ in range(n)]
        for l in range(1, n + 1):
            for i in range(n - l + 1):
                dp[i][i + l - 1] = (s[i] == s[i + l - 1] and
                                    (i + 1 > (i + l - 2) or
                                    dp[i + 1][i + l - 2]))
        
        def dfs(i):
            if i >= n:
                return [[]]  
            
            ret = []
            for j in range(i, n):
                if dp[i][j]:
                    nxt = dfs(j + 1)
                    for part in nxt:
                        cur = [s[i : j + 1]] + part  
                        ret.append(cur)
            return ret
        
        return dfs(0)
```
Time Complexity: $O(n*2^n)$
Space Complexity: $O(n^2)$
## References

[^1]: https://www.youtube.com/watch?v=3jvWodd7ht0
[^2]: https://neetcode.io/solutions/palindrome-partitioning