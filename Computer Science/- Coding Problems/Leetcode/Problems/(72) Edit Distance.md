---
Source:
  - https://leetcode.com/problems/edit-distance/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-01 at 4.28.16 AM.png]]
- Similar to longest common subsequence (LCS)
- This is a [[dynamic programming]] problem
```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        cache = [[float("inf")]*(len(word2) + 1) for i in range(len(word1) + 1)]
        
        for j in range(len(word2)+1):
            cache[len(word1)][j] = len(word2) - j
        for i in range(len(word1) + 1):
            cache[i][len(word2)] = len(word1) - i
        
        for i in range(len(word1) - 1, -1, -1):
            for j in range(len(word2)- 1, -1, -1):
                if word1[i] == word2[j]:
                    cache[i][j] = cache[i + 1][j + 1]
                else:
                    cache[i][j] = 1 + min(cache[i + 1][j], cache[i][j+1], cache[i+1][j+1])
        return cache[0][0]
```
## Source[^2]
### (1) Recursion
```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)

        def dfs(i, j):
            if i == m:
                return n - j
            if j == n:
                return m - i
            if word1[i] == word2[j]:
                return dfs(i + 1, j + 1)
            res = min(dfs(i + 1, j), dfs(i, j + 1))
            res = min(res, dfs(i + 1, j + 1))
            return res + 1
        
        return dfs(0, 0)
```
Time Complexity: $O(3^{m+n})$
Space Complexity: $O(m+n)$
- Where $m$ is the length of $word1$ and $n$ is the length of $word2$
### (2) Dynamic Programming (Top-Down)
```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)

        dp = {}
        def dfs(i, j):
            if i == m:
                return n - j
            if j == n:
                return m - i
            if (i, j) in dp:
                return dp[(i, j)]
                
            if word1[i] == word2[j]:
                dp[(i, j)] = dfs(i + 1, j + 1)
            else:
                res = min(dfs(i + 1, j), dfs(i, j + 1))
                res = min(res, dfs(i + 1, j + 1))
                dp[(i, j)] = res + 1
            return dp[(i, j)]
        
        return dfs(0, 0)
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m*n)$
- Where $m$ is the length of $word1$ and $n$ is the length of $word2$
### (3) Dynamic Programming (Bottom-Up)
```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        dp = [[float("inf")] * (len(word2) + 1) for i in range(len(word1) + 1)]

        for j in range(len(word2) + 1):
            dp[len(word1)][j] = len(word2) - j
        for i in range(len(word1) + 1):
            dp[i][len(word2)] = len(word1) - i

        for i in range(len(word1) - 1, -1, -1):
            for j in range(len(word2) - 1, -1, -1):
                if word1[i] == word2[j]:
                    dp[i][j] = dp[i + 1][j + 1]
                else:
                    dp[i][j] = 1 + min(dp[i + 1][j], dp[i][j + 1], dp[i + 1][j + 1])
        return dp[0][0]
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m*n)$
- Where $m$ is the length of $word1$ and $n$ is the length of $word2$

### (4) Dynamic Programming (Space Optimized)
```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)
        if m < n:
            m, n = n, m
            word1, word2 = word2, word1

        dp = [0] * (n + 1)
        nextDp = [0] * (n + 1)

        for j in range(n + 1):
            dp[j] = n - j

        for i in range(m - 1, -1, -1):
            nextDp[n] = m - i
            for j in range(n - 1, -1, -1):
                if word1[i] == word2[j]:
                    nextDp[j] = dp[j + 1]
                else:
                    nextDp[j] = 1 + min(dp[j], nextDp[j + 1], dp[j + 1])
            dp = nextDp[:]
        
        return dp[0]
```
- Time Complexity: $O(m*n)$
- Space Complexity: $O(min(m,n))$
	- Where $m$ is the length of $word1$ and $n$ is the length of $word2$
### (5) Dynamic Programming (Optimal)
```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)
        if m < n:
            m, n = n, m
            word1, word2 = word2, word1
        
        dp = [n - i for i in range(n + 1)]

        for i in range(m - 1, -1, -1):
            nextDp = dp[n]
            dp[n] = m - i
            for j in range(n - 1, -1, -1):
                temp = dp[j]
                if word1[i] == word2[j]:
                    dp[j] = nextDp
                else:
                    dp[j] = 1 + min(dp[j], dp[j + 1], nextDp)
                nextDp = temp
        return dp[0]
```
Time Complexity: $O(m*n)$
Space Complexity: $O(min(m,n))$
- While $m$ is the length of $word1$ and $n$ is the length of $word2$
## References

[^1]: [Edit Distance - Dynamic Programming - Leetcode 72 - Python](https://www.youtube.com/watch?v=XYi2-LPrwm4)
[^2]: https://neetcode.io/solutions/edit-distance