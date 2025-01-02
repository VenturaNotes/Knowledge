---
Source:
  - https://www.youtube.com/watch?v=e69C6xhiSQE
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-23 at 9.59.53 PM.png]]
- DFS will be size of grid so it might be something like $O(mn)^2$ but can we do better than this Big O time complexity?
- Lets try out a BFS solution
- Let's do a BFS solution from all gates
	- BFS solutions implemented with a [[queue]]
- Will have a time complexity with BFS of $O(m*n)$ and a memory complexity of $O(m*n)$ to make sure we don't visit the same empty room twice.
```python
class Solution:
    def islandsAndTreasure(self, grid: List[List[int]]) -> None:
        ROWS, COLS = len(grid), len(grid[0])
        visit = set()
        q = deque()

        def addRoom(r, c):
            if (r < 0 or r == ROWS or c < 0 or c == COLS 
                or (r, c) in visit or grid[r][c] == -1):
                return
            visit.add((r, c))
            q.append([r, c])

        for r in range(ROWS):
            for c in range(COLS):
                if grid[r][c] == 0:
                    q.append([r, c])
                    visit.add((r, c))
        
        dist = 0
        while q:
            for i in range(len(q)):
                r, c = q.popleft()
                grid[r][c] = dist
                addRoom(r + 1, c)
                addRoom(r - 1, c)
                addRoom(r, c + 1)
                addRoom(r, c - 1)
            dist += 1
```
## References

[^1]: https://www.youtube.com/watch?v=e69C6xhiSQE