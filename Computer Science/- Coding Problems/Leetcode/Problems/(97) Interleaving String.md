---
Source:
  - https://leetcode.com/problems/interleaving-string/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-01 at 3.53.18 AM.png]]
- Could use [[caching]] to eliminate a lot of repeated work so the time complexity of the solution can be broken down into $O(m*n)$ 
- Could also do a true [[dynamic programming]] solution which would also give the time complexity of $O(m*n)$ 
- Worst case time complexity is $2^{n+m}$ through [[decision tree]]
```python
class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        dp = {}
        # k = i + j
        if len(s1) + len(s2) != len(s3):
            return False
        def dfs(i, j):
            if i == len(s1) and j == len(s2):
                return True
            if (i, j) in dp:
                return dp[(i, j)]
            
            if i < len(s1) and s1[i] == s3[i + j] and dfs(i + 1, j):
                return True
            if j < len(s2) and s2[j] == s3[i + j] and dfs(i, j + 1):
                return True
            dp[(i, j)] = False
            return False
        return dfs(0, 0)
```
- Above is [[memoization]] recursive solution
```python
class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        if len(s1) + len(s2) != len(s3):
            return False
        dp = [[False] * (len(s2) + 1) for i in range(len(s1) + 1)]
        dp[len(s1)][len(s2)] = True

        for i in range(len(s1), -1, -1):
            for j in range(len(s2), -1, -1):
                if i < len(s1) and s1[i] == s3[i + j] and dp[i + 1][j]:
                    dp[i][j] = True
                if j < len(s2) and s2[j] == s3[i + j] and dp[i][j+1]:
                    dp[i][j] = True
        return dp[0][0]
                
        
```
- The above is the dynamic programming solution
	- Using a 2-D DP solution
## Source[^2]
### (1) Recursion
```python
class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        
        def dfs(i, j, k):
            if k == len(s3):
                return (i == len(s1)) and (j == len(s2))
            
            if i < len(s1) and s1[i] == s3[k]:
                if dfs(i + 1, j, k + 1):
                    return True
            
            if j < len(s2) and s2[j] == s3[k]:
                if dfs(i, j + 1, k + 1):
                    return True
            
            return False
        
        return dfs(0, 0, 0)
```
Time Complexity: $O(2^{m+n})$
Space Complexity: $O(m+n)$
- Where $m$ is the length of the string $s1$ and $n$ is the length of the string $s2$
### (2) Dynamic Programming (Top-Down)
```python
class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        if len(s1) + len(s2) != len(s3):
            return False

        dp = {}
        def dfs(i, j, k):
            if k == len(s3):
                return (i == len(s1)) and (j == len(s2))
            if (i, j) in dp:
                return dp[(i, j)]
            
            res = False
            if i < len(s1) and s1[i] == s3[k]:
                res = dfs(i + 1, j, k + 1)
            if not res and j < len(s2) and s2[j] == s3[k]:
                res = dfs(i, j + 1, k + 1)
            
            dp[(i, j)] = res
            return res
        
        return dfs(0, 0, 0)
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m*n)$
- Where $m$ is the length of the string $s1$ and $n$ is the length of the string $s2$
### (3) Dynamic Programming (Bottom-Up)
```python
class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        if len(s1) + len(s2) != len(s3):
            return False

        dp = [[False] * (len(s2) + 1) for i in range(len(s1) + 1)]
        dp[len(s1)][len(s2)] = True

        for i in range(len(s1), -1, -1):
            for j in range(len(s2), -1, -1):
                if i < len(s1) and s1[i] == s3[i + j] and dp[i + 1][j]:
                    dp[i][j] = True
                if j < len(s2) and s2[j] == s3[i + j] and dp[i][j + 1]:
                    dp[i][j] = True
        return dp[0][0]
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m*n)$
- Where $m$ is the length of the string $s1$ and $n$ is the length of the string $s2$
### (4) Dynamic Programming (Space Optimized)
```python
class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        m, n = len(s1), len(s2)
        if m + n != len(s3):
            return False
        if n < m:
            s1, s2 = s2, s1
            m, n = n, m
        
        dp = [False for _ in range(n + 1)]
        dp[n] = True
        for i in range(m, -1, -1):
            nextDp = [False for _ in range(n + 1)]
            nextDp[n] = True
            for j in range(n, -1, -1):
                if i < m and s1[i] == s3[i + j] and dp[j]:
                    nextDp[j] = True
                if j < n and s2[j] == s3[i + j] and nextDp[j + 1]:
                    nextDp[j] = True
            dp = nextDp
        return dp[0]
```
Time Complexity: $O(m*n)$
Space Complexity: $O(min(m,n))$
- Where $m$ is the length of the string $s1$ and $n$ is the length of the string $s2$
### (5) Dynamic Programming (Optimal)
```python
class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        m, n = len(s1), len(s2)
        if m + n != len(s3):
            return False
        if n < m:
            s1, s2 = s2, s1
            m, n = n, m
        
        dp = [False for _ in range(n + 1)]
        dp[n] = True
        for i in range(m, -1, -1):
            nextDp = True
            for j in range(n - 1, -1, -1):
                res = False
                if i < m and s1[i] == s3[i + j] and dp[j]:
                    res = True
                if j < n and s2[j] == s3[i + j] and nextDp:
                    res = True
                dp[j] = res
                nextDp = dp[j]
        return dp[0]
```
Time Complexity: $O(m*n)$
Space Complexity: $O(min(m,n))$
- Where $m$ is the length of the string $s1$ and $n$ is the length of the string $s2$
## References

[^1]: https://www.youtube.com/watch?v=3Rw3p9LrgvE
[^2]: https://neetcode.io/solutions/interleaving-string