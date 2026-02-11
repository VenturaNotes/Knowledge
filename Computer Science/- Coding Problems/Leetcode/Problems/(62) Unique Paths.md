---
Source:
  - https://leetcode.com/problems/unique-paths/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-01 at 2.42.44 AM.png]]
- [[Dynamic programming]] problem
- Finding how many possible unique paths are there?
	- Can only go down or right.
- When doing DFS, could have a cache so that for every row, column position, we can cache the result.
	- The sum we're looking for is R + D
- There are 28 unique paths to get to the result
	- When you look at the picture, it actually looks more like a math problem than a coding problem
	- You can actually calculate the number of ways from the top-left in constant time if you have a math equation. So we're just going to stick to dynamic programming solution for this
```python
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        row = [1]*n

        for i in range(m-1):
            newRow = [1]*n
            for j in range(n-2, -1, -1):
                newRow[j] = newRow[j + 1] + row[j]
            row = newRow
        return row[0]
```
- Time Complexity: $O(n*m)$
- Memory Complexity: $O(n)$ `length of row`
## Source[^2]
### (1) Recursion
```python
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        
        def dfs(i, j):
            if i == (m - 1) and j == (n - 1):
                return 1
            if i >= m or j >= n:
                return 0
            return dfs(i, j + 1) + dfs(i + 1, j)
        
        return dfs(0, 0)
```
Time Complexity: $O(2^{m+n})$
Space Complexity: $O(m+n)$
- Where $m$ is the number of rows and $n$ is the number of columns
### (2) Dynamic Programming (Top-Down)
```python
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        memo = [[-1] * n for _ in range(m)]
        def dfs(i, j):
            if i == (m - 1) and j == (n - 1):
                return 1
            if i >= m or j >= n:
                return 0
            if memo[i][j] != -1:
                return memo[i][j]
            
            memo[i][j] =  dfs(i, j + 1) + dfs(i + 1, j)
            return memo[i][j]
        
        return dfs(0, 0)
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m*n)$
- Where $m$ is the number of rows and $n$ is the number of columns.

### (3) Dynamic Programming (Bottom-Up)
```python
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        dp[m - 1][n - 1] = 1

        for i in range(m - 1, -1, -1):
            for j in range(n - 1, -1, -1):
                dp[i][j] += dp[i + 1][j] + dp[i][j + 1]

        return dp[0][0]
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m*n)$
- Where $m$ is the number of rows and $n$ is the number of columns
### (4) Dynamic Programming (Space Optimized)
```python
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        row = [1] * n

        for i in range(m - 1):
            newRow = [1] * n
            for j in range(n - 2, -1, -1):
                newRow[j] = newRow[j + 1] + row[j]
            row = newRow
        return row[0]
```
Time Complexity: $O(m*n)$
Space Complexity: $O(n)$
- Where $m$ is the number of rows and $n$ is the number of columns
### (5) Dynamic Programming (Optimal)
```python
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        dp = [1] * n
        for i in range(m - 2, -1, -1):
            for j in range(n - 2, -1, -1):
                dp[j] += dp[j + 1]
                
        return dp[0]
```
Time Complexity: $O(m*n)$
Space Complexity: $O(n)$
- Where $m$ is the number of rows and $n$ is the number of columns
### (6) Math
```python
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        if m == 1 or n == 1:
            return 1
        if m < n:
            m, n = n, m

        res = j = 1
        for i in range(m, m + n - 1):
            res *= i
            res //= j
            j += 1

        return res
```
Time Complexity: $O(min(m,n))$
Space Complexity: $O(1)$
- Where $m$ is the number of rows and $n$ is the number of columns
## References

[^1]: [Unique Paths - Dynamic Programming - Leetcode 62](https://www.youtube.com/watch?v=IlEsdxuD4lY)
[^2]: https://neetcode.io/solutions/unique-paths