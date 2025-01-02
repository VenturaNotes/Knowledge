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
## References

[^1]: https://www.youtube.com/watch?v=wCc_nd-GiEc