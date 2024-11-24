---
Source:
  - https://leetcode.com/problems/number-of-islands/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-23 at 9.37.52 PM.png]]
- Google and Uber ask this
- [[Graph]]
	- Graph traversal algorithm starting at original point and marking each layer of 1s
	- Using BFS for this 
		- It's not a recursive algorithm. It's iterative. So we need a data structure to use for memory so a [[queue]] is normally used
```python
class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        if not grid:
            return 0
        
        rows, cols = len(grid), len(grid[0])
        visit = set()
        islands = 0

        def bfs(r, c):
            q = collections.deque()
            visit.add((r, c))
            q.append((r, c))
            while q:
                row, col = q.popleft()
                directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]
                for dr, dc in directions:
                    r, c = row + dr, col + dc
                    if (r in range(rows) and 
                        c in range(cols) and
                        grid[r][c] == "1" and
                        (r, c) not in visit):
                        q.append((r, c))
                        visit.add((r, c))
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == "1" and (r, c) not in visit:
                    bfs(r, c)
                    islands += 1
        return islands

```
- If interviewer asks at end to give a depth first search solution, you could easily change the `row, col = q.popleft()` to a regular pop `row, col = q.pop()`, it will pop the most recent element we added instead of first element we added which means it will be a DFS, but it's non-recursive, it's iterative
## References

[^1]: https://www.youtube.com/watch?v=pV2kpPD66nE