---
Source:
  - https://leetcode.com/problems/number-of-islands/
Reviewed: false
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
## Source[^2]
### (1) Depth First Search
```python
class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]
        ROWS, COLS = len(grid), len(grid[0])
        islands = 0

        def dfs(r, c):
            if (r < 0 or c < 0 or r >= ROWS or 
                c >= COLS or grid[r][c] == "0"
            ):
                return
                
            grid[r][c] = "0"
            for dr, dc in directions:
                dfs(r + dr, c + dc)

        for r in range(ROWS):
            for c in range(COLS):
                if grid[r][c] == "1":
                    dfs(r, c)
                    islands += 1

        return islands
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m*n)$
- Where $m$ is the number of rows and $n$ is the number of columns in the $grid$
### (2) Breadth First Search
```python
class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]
        ROWS, COLS = len(grid), len(grid[0])
        islands = 0

        def bfs(r, c):
            q = deque()
            grid[r][c] = "0"
            q.append((r, c))

            while q:
                row, col = q.popleft()  
                for dr, dc in directions:
                    nr, nc = dr + row, dc + col
                    if (nr < 0 or nc < 0 or nr >= ROWS or
                        nc >= COLS or grid[nr][nc] == "0"
                    ):
                        continue
                    q.append((nr, nc))
                    grid[nr][nc] = "0"

        for r in range(ROWS):
            for c in range(COLS):
                if grid[r][c] == "1":
                    bfs(r, c)
                    islands += 1

        return islands
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m*n)$
- Where $m$ is the number of rows and $n$ is the number of columns in the $grid$

### (3) Disjoint Set Union
```python
class DSU:
    def __init__(self, n):
        self.Parent = list(range(n + 1))
        self.Size = [1] * (n + 1)

    def find(self, node):
        if self.Parent[node] != node:
            self.Parent[node] = self.find(self.Parent[node])
        return self.Parent[node]

    def union(self, u, v):
        pu = self.find(u)
        pv = self.find(v)
        if pu == pv:
            return False
        if self.Size[pu] >= self.Size[pv]:
            self.Size[pu] += self.Size[pv]
            self.Parent[pv] = pu
        else:
            self.Size[pv] += self.Size[pu]
            self.Parent[pu] = pv
        return True

class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        ROWS, COLS = len(grid), len(grid[0])
        dsu = DSU(ROWS * COLS)

        def index(r, c):
            return r * COLS + c

        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        islands = 0

        for r in range(ROWS):
            for c in range(COLS):
                if grid[r][c] == '1':
                    islands += 1
                    for dr, dc in directions:
                        nr, nc = r + dr, c + dc
                        if (nr < 0 or nc < 0 or nr >= ROWS or
                            nc >= COLS or grid[nr][nc] == "0"
                        ):
                            continue
                            
                        if dsu.union(index(r, c), index(nr, nc)):
                            islands -= 1

        return islands
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m*n)$
- Where $m$ is the number of rows and $n$ is the number of columns in the $grid$ 
## References

[^1]: https://www.youtube.com/watch?v=pV2kpPD66nE
[^2]: https://neetcode.io/solutions/number-of-islands