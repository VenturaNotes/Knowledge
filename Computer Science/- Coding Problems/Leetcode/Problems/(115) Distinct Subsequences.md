---
Source:
  - https://leetcode.com/problems/distinct-subsequences/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-01 at 4.14.36 AM.png]]
- Will solve with [[dynamic programming]]
	- Similar to longest common subsequence (LCS)
- Will do this recursively with DFS or backtracking (whatever you want to call it)
	- Will use [[cache]] so we don't repeat the same work twice
- Memory and runtime complexity of algorithm is $O(n*m)$ 
- Will use recursive approach for this (which is top-down)
```python
class Solution:
    def numDistinct(self, s: str, t: str) -> int:
        cache = {}

        def dfs(i, j):
            if j == len(t):
                return 1
            if i == len(s):
                return 0
            if (i, j) in cache:
                return cache[(i, j)]
            
            if s[i] == t[j]:
                cache[(i, j)] = dfs(i + 1, j + 1) + dfs(i + 1, j)
            else:
                cache[(i, j)] = dfs(i + 1, j)
            return cache[(i, j)]
        return dfs(0, 0)
```
- #comment Problem initially incorrect with `i+i` being added. Found solution in comment section though
## Source[^2]
### (1) Recursion
```python
class Solution:
    def numDistinct(self, s: str, t: str) -> int:
        if len(t) > len(s):
            return 0
            
        def dfs(i, j):
            if j == len(t):
                return 1
            if i == len(s):
                return 0
            
            res = dfs(i + 1, j)
            if s[i] == t[j]:
                res += dfs(i + 1, j + 1)
            return res
        
        return dfs(0, 0)
```
Time Complexity: $O(2^m)$
Space Complexity: $O(m)$
### (2) Dynamic Programming (Top-Down)
```python
class Solution:
    def numDistinct(self, s: str, t: str) -> int:
        if len(t) > len(s):
            return 0
        
        dp = {}
        def dfs(i, j):
            if j == len(t):
                return 1
            if i == len(s):
                return 0
            if (i, j) in dp:
                return dp[(i, j)]
            
            res = dfs(i + 1, j)
            if s[i] == t[j]:
                res += dfs(i + 1, j + 1)
            dp[(i, j)] = res
            return res

        return dfs(0, 0)
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m*n)$
- Where $m$ is the length of the string $s$ and $n$ is the length of the string $t$
### (3) Dynamic Programing (Bottom-Up)
```python
class Solution:
    def numDistinct(self, s: str, t: str) -> int:
        m, n = len(s), len(t)
        dp = [[0] * (n + 1) for _ in range(m + 1)]

        for i in range(m + 1):
            dp[i][n] = 1
        
        for i in range(m - 1, -1, -1):
            for j in range(n - 1, -1, -1):
                dp[i][j] = dp[i + 1][j]
                if s[i] == t[j]:
                    dp[i][j] += dp[i + 1][j + 1]
                    
        return dp[0][0]
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m*n)$
- Where $m$ is the length of the string $s$ and $n$ is the length of the string $t$
### (4) Dynamic Programming (Space Optimized)
```python
class Solution:
    def numDistinct(self, s: str, t: str) -> int:
        m, n = len(s), len(t)
        dp = [0] * (n + 1)
        nextDp = [0] * (n + 1)

        dp[n] = nextDp[n] = 1
        for i in range(m - 1, -1, -1):
            for j in range(n - 1, -1, -1):
                nextDp[j] = dp[j]
                if s[i] == t[j]:
                    nextDp[j] += dp[j + 1]
            dp = nextDp[:]

        return dp[0]
```
Time Complexity: $O(m*n)$
Space Complexity: $O(n)$
- Where $m$ is the length of the string $s$ and $n$ is the length of the string $t$
### (5) Dynamic Programming (Optimal)
```python
class Solution:
    def numDistinct(self, s: str, t: str) -> int:
        m, n = len(s), len(t)
        dp = [0] * (n + 1)

        dp[n] = 1
        for i in range(m - 1, -1, -1):
            prev = 1
            for j in range(n - 1, -1, -1):
                res = dp[j]
                if s[i] == t[j]:
                    res += prev

                prev = dp[j]
                dp[j] = res 
                
        return dp[0]
```
Time Complexity: $O(m*n)$
Space Complexity: $O(n)$
- Where $m$ is the length of the string $s$ and $n$ is the length of the string $t$ 
## References

[^1]: [Distinct Subsequences - Dynamic Programming - Leetcode 115 - Python](https://www.youtube.com/watch?v=-RDzMJ33nx8)
[^2]: https://neetcode.io/solutions/distinct-subsequences