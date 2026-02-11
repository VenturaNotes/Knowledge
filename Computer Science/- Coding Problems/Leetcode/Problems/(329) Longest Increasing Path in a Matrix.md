---
Source:
  - https://leetcode.com/problems/longest-increasing-path-in-a-matrix/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-01 at 4.05.41 AM.png]]
- Not allowed to reuse values
- Can call longest increasing path as LIP for this problem
- For any particular position, we find the longest length through brute force using DFS
	- Storing work in matrix by not repeating the work
- Time and memory complexity is $O(n*m)$ 
```python
class Solution:
    def longestIncreasingPath(self, matrix: List[List[int]]) -> int:
        ROWS, COLS = len(matrix), len(matrix[0])
        dp = {} # (r, c) -> LIP

        def dfs(r, c, prevVal):
            if (r < 0 or r == ROWS or
                c < 0 or c == COLS or
                matrix[r][c] <= prevVal):
                return 0
            if (r, c) in dp:
                return dp[(r,c)]
            
            res = 1
            res = max(res, 1 + dfs(r + 1, c, matrix[r][c]))
            res = max(res, 1 + dfs(r - 1, c, matrix[r][c]))
            res = max(res, 1 + dfs(r, c + 1, matrix[r][c]))
            res = max(res, 1 + dfs(r, c - 1, matrix[r][c]))
            dp[(r, c)] = res
            return res
        for r in range(ROWS):
            for c in range(COLS):
                dfs(r, c, -1)
        return max(dp.values())


```
## Source[^2]
### (1) Recursion
```python
class Solution:
    def longestIncreasingPath(self, matrix: List[List[int]]) -> int:
        ROWS, COLS = len(matrix), len(matrix[0])
        directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]

        def dfs(r, c, prevVal):
            if (min(r, c) < 0 or r >= ROWS or 
                c >= COLS or matrix[r][c] <= prevVal
            ):
                return 0
            
            res = 1
            for d in directions:
                res = max(res, 1 + dfs(r + d[0], c + d[1], matrix[r][c]))
            return res

        LIP = 0
        for r in range(ROWS):
            for c in range(COLS):
                LIP = max(LIP, dfs(r, c, float('-inf')))
        return LIP
```
Time Complexity: $O(m*n*4^{m*n})$
Space Complexity: $O(m*n)$
- Where $m$ is the number of rows and $n$ is the number of columns in the given matrix
### (2) Dynamic Programming (Top-Down)
```python
class Solution:
    def longestIncreasingPath(self, matrix: List[List[int]]) -> int:
        ROWS, COLS = len(matrix), len(matrix[0])
        dp = {}  # (r, c) -> LIP

        def dfs(r, c, prevVal):
            if (r < 0 or r == ROWS or c < 0 or 
                c == COLS or matrix[r][c] <= prevVal
            ):
                return 0
            if (r, c) in dp:
                return dp[(r, c)]

            res = 1
            res = max(res, 1 + dfs(r + 1, c, matrix[r][c]))
            res = max(res, 1 + dfs(r - 1, c, matrix[r][c]))
            res = max(res, 1 + dfs(r, c + 1, matrix[r][c]))
            res = max(res, 1 + dfs(r, c - 1, matrix[r][c]))
            dp[(r, c)] = res
            return res

        for r in range(ROWS):
            for c in range(COLS):
                dfs(r, c, -1)
        return max(dp.values())
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m*n)$
- Where $m$ is the number of rows and $n$ is the number of columns in the given $matrix$
### (3) Topological Sort (Kahn's Algorithm)
```python
class Solution:
    def longestIncreasingPath(self, matrix: List[List[int]]) -> int:
        ROWS, COLS = len(matrix), len(matrix[0])
        directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
        indegree = [[0] * COLS for _ in range(ROWS)]
        
        for r in range(ROWS):
            for c in range(COLS):
                for d in directions:
                    nr, nc = d[0] + r, d[1] + c
                    if (0 <= nr < ROWS and 0 <= nc < COLS and 
                        matrix[nr][nc] < matrix[r][c]
                    ):
                        indegree[r][c] += 1

        q = deque()
        for r in range(ROWS):
            for c in range(COLS):
                if indegree[r][c] == 0:
                    q.append([r, c])

        LIS = 0
        while q:
            for _ in range(len(q)):
                r, c = q.popleft()
                for d in directions:
                    nr, nc = r + d[0], c + d[1]
                    if (0 <= nr < ROWS and 0 <= nc < COLS and 
                        matrix[nr][nc] > matrix[r][c]
                    ):
                        indegree[nr][nc] -= 1
                        if indegree[nr][nc] == 0:
                            q.append([nr, nc])
            LIS += 1
        return LIS
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m*n)$
- Where $m$ is the number of rows and $n$ is the number of columns in the given $matrix$
## References

[^1]: [Longest Increasing Path in a Matrix - Leetcode 329](https://www.youtube.com/watch?v=wCc_nd-GiEc)
[^2]: https://neetcode.io/solutions/longest-increasing-path-in-a-matrix