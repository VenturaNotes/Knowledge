---
Source:
  - https://leetcode.com/problems/regular-expression-matching
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-01 at 4.53.53 AM.png]]
- Star is where the complexity mainly comes from
- This is a [[dynamic programming]] problem.
- Using a decision tree, the time complexity would be $2^n$. However, if we implement with a cache, we can get the time complexity down to $O(n^2)$ or $O(n*m)$ where `n` is the length of the input string and `m` is the length of the pattern
	- This is if we do [[top-down memoization]] with cache
	- Could also do [[bottom-up dynamic programming]] solution
	- Both have same time complexity
- If `j` is out of bounds, must return false. If `i` is out of bounds, do not need to return false as the `*` could make it so the next character does not need to be returned.
```python
class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        # TOP-Down Memoization
            
        def dfs(i, j):
            if i >= len(s) and j >= len(p):
                return True
            if j >= len(p):
                return False
            
            match = i < len(s) and (s[i] == p[j] or p[j] == ".")
            if (j + 1) < len(p) and p[j + 1] == "*":
                return (dfs(i, j + 2) or # don't use *
                        (match and dfs(i + 1, j))) # use *
            if match:
                return dfs(i + 1, j + 1)

            return False
        return dfs(0, 0)
```
- Above is solution without caching
```python
class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        # TOP-Down Memoization
        
        cache = {}

        def dfs(i, j):
            if (i, j) in cache:
                return cache[(i, j)]

            if i >= len(s) and j >= len(p):
                return True
            if j >= len(p):
                return False
            
            match = i < len(s) and (s[i] == p[j] or p[j] == ".")
            if (j + 1) < len(p) and p[j + 1] == "*":
                cache[(i, j)] = (dfs(i, j + 2) or # don't use *
                        (match and dfs(i + 1, j))) # use *
                return cache[(i, j)]
            if match:
                cache[(i, j)] = dfs(i + 1, j + 1)
                return cache[(i, j)]

            cache[(i, j)] = False
            return False
        return dfs(0, 0)        
```
- Above adds caching
## Source[^2]
### (1) Recursion
```python
class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        m, n = len(s), len(p)

        def dfs(i, j):
            if j == n:
                return i == m
            
            match = i < m and (s[i] == p[j] or p[j] == ".")
            if (j + 1) < n and p[j + 1] == "*":
                return (dfs(i, j + 2) or          # don't use * 
                       (match and dfs(i + 1, j))) # use *
            if match:
                return dfs(i + 1, j + 1)
            return False
        
        return dfs(0, 0)
```
Time Complexity: $O(2^{m+n})$
Space Complexity: $O(m+n)$
- Where $m$ is the length of the string $s$ and $n$ is the length of the string $p$
### (2) Dynamic Programming (Top-Down)
```python
class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        m, n = len(s), len(p)
        cache = {}

        def dfs(i, j):
            if j == n:
                return i == m
            if (i, j) in cache:
                return cache[(i, j)]

            match = i < m and (s[i] == p[j] or p[j] == ".")
            if (j + 1) < n and p[j + 1] == "*":
                cache[(i, j)] = (dfs(i, j + 2) or 
                                (match and dfs(i + 1, j)))
                return cache[(i, j)]

            if match:
                cache[(i, j)] = dfs(i + 1, j + 1)
                return cache[(i, j)]
                
            cache[(i, j)] = False
            return False
        
        return dfs(0, 0)
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m*n)$
- Where $m$ is the length of the string $s$ and $n$ is the length of the string $p$
### (3) Dynamic Programming (Bottom-Up)
```python
class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        dp = [[False] * (len(p) + 1) for i in range(len(s) + 1)]
        dp[len(s)][len(p)] = True

        for i in range(len(s), -1, -1):
            for j in range(len(p) - 1, -1, -1):
                match = i < len(s) and (s[i] == p[j] or p[j] == ".")

                if (j + 1) < len(p) and p[j + 1] == "*":
                    dp[i][j] = dp[i][j + 2]
                    if match:
                        dp[i][j] = dp[i + 1][j] or dp[i][j]
                elif match:
                    dp[i][j] = dp[i + 1][j + 1]

        return dp[0][0]
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m*n)$
- Where $m$ is the length of the string $s$ and $n$ is the length of the string $p$
### (4) Dynamic Programming (Space Optimized)
```python
class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        dp = [False] * (len(p) + 1)
        dp[len(p)] = True
        
        for i in range(len(s), -1, -1):
            nextDp = [False] * (len(p) + 1)
            nextDp[len(p)] = (i == len(s))

            for j in range(len(p) - 1, -1, -1):
                match = i < len(s) and (s[i] == p[j] or p[j] == ".")
                
                if (j + 1) < len(p) and p[j + 1] == "*":
                    nextDp[j] = nextDp[j + 2]
                    if match:
                        nextDp[j] |= dp[j]
                elif match:
                    nextDp[j] = dp[j + 1]
            
            dp = nextDp
        
        return dp[0]
```
Time Complexity: $O(m*n)$
Space Complexity: $O(n)$
- Where $m$ is the length of the string $s$ and $n$ is the length of the string $p$
### (5) Dynamic Programming (Optimal)
```python
class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        dp = [False] * (len(p) + 1)
        dp[len(p)] = True
        
        for i in range(len(s), -1, -1):
            dp1 = dp[len(p)]
            dp[len(p)] = (i == len(s))
            
            for j in range(len(p) - 1, -1, -1):
                match = i < len(s) and (s[i] == p[j] or p[j] == ".")
                res = False
                if (j + 1) < len(p) and p[j + 1] == "*":
                    res = dp[j + 2]
                    if match:
                        res |= dp[j]
                elif match:
                    res = dp1
                dp[j], dp1 = res, dp[j]

        return dp[0]
```
Time Complexity: $O(m*n)$
Space Complexity: $O(n)$
- Where $m$ is the length of the string $s$ and $n$ is the length of the string $p$
## References

[^1]: [Regular Expression Matching - Dynamic Programming Top-Down Memoization - Leetcode 10](https://www.youtube.com/watch?v=HAA8mgxlov8)
[^2]: https://neetcode.io/solutions/regular-expression-matching