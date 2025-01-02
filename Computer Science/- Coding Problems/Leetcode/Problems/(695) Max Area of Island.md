---
Source:
  - https://leetcode.com/problems/max-area-of-island/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-23 at 9.44.33 PM.png]]
- Can use [[Depth first search|DFS]]
	- DFS is a recursive algorithm
	- Will use a HashSet to mark positions we've already visited so we don't revisit them
- Overall time complexity is $O(m*n)$ 
	- This will also be memory complexity since we have a HashSet that could contain every cell in the grid
	- DFS is also recursive so there is a call stack associated with it
```python
class Solution:
    def maxAreaOfIsland(self, grid: List[List[int]]) -> int:
        ROWS, COLS = len(grid), len(grid[0])
        visit = set()
	    # A small optimization is that you don't actually need
		# an external visit set. You can actually just use the grid
		# itself to determine if you visited a position or not but
		# we're not guaranteed that we can write over the input grid
		# so I don't think it's a big deal to use the hash set
		# You could just clarify with interviewer if you really want
		# to. It's just a small optimization which isn't that big
		# of an opinion.

        def dfs(r, c):
            if (r < 0 or r == ROWS or c < 0 or c == COLS or 
                grid[r][c] == 0 or (r, c) in visit):
                return 0
            
            visit.add((r, c))
            return (1 + dfs(r+1, c) +
                        dfs(r-1, c) +
                        dfs(r, c+1) +
                        dfs(r, c-1))
        area = 0
        for r in range(ROWS):
            for c in range(COLS):
                area = max(area, dfs(r, c))
        return area

```
## References

[^1]: https://www.youtube.com/watch?v=iJGr1OtmH0c