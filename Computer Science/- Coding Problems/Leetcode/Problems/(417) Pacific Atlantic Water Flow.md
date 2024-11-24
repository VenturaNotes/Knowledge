---
Source:
  - https://leetcode.com/problems/pacific-atlantic-water-flow/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-23 at 10.40.19 PM.png|400]]
- Water can flow in four directions: up, down, left, and right. Water flows from a cell to an adjacent one with an equal or lower height
- Return a list of grid coordinates where water can flow to both the Pacific and Atlantic oceans
- Will use a [[HashSet]] to prevent adding duplicates
```python
class Solution:
    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:
        ROWS, COLS = len(heights), len(heights[0])
        pac, atl = set(), set()

        def dfs(r, c, visit, prevHeight):
            if ((r, c) in visit or 
                r < 0 or c < 0 or r == ROWS or c == COLS or
                heights[r][c] < prevHeight):
                    return
            visit.add((r, c))
            dfs(r+1, c, visit, heights[r][c])
            dfs(r-1, c, visit, heights[r][c])
            dfs(r, c+1, visit, heights[r][c])
            dfs(r, c-1, visit, heights[r][c])

        for c in range(COLS):
            dfs(0, c, pac, heights[0][c])
            dfs(ROWS - 1, c, atl, heights[ROWS-1][c])
        
        for r in range(ROWS):
            dfs(r, 0, pac, heights[r][0])
            dfs(r, COLS - 1, atl, heights[r][COLS - 1])
        
        res = []
        for r in range(ROWS):
            for c in range(COLS):
                if (r, c) in pac and (r, c) in atl:
                    res.append([r, c])
        return res
```
## References

[^1]: https://www.youtube.com/watch?v=s-VkcjHqkGI