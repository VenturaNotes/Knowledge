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
## Source[^2]
### (1) Brute Force (Backtracking)
```python
class Solution:
    def islandsAndTreasure(self, grid: List[List[int]]) -> None:
        ROWS, COLS = len(grid), len(grid[0])
        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        INF = 2147483647
        visit = [[False for _ in range(COLS)] for _ in range(ROWS)]

        def dfs(r, c):
            if (r < 0 or c < 0 or r >= ROWS or
                c >= COLS or grid[r][c] == -1 or
                visit[r][c]):
                return INF
            if grid[r][c] == 0:
                return 0

            visit[r][c] = True
            res = INF
            for dx, dy in directions:
                res = min(res, 1 + dfs(r + dx, c + dy))
            visit[r][c] = False
            return res

        for r in range(ROWS):
            for c in range(COLS):
                if grid[r][c] == INF:
                    grid[r][c] = dfs(r, c)
```
Time Complexity: $O(m*n*4^{m*n})$
Space Complexity: $O(m*n)$
- Where $m$ is the number of rows and $n$ is the number of columns in the $grid$

### (2) Breadth First Search
```python
class Solution:
    def islandsAndTreasure(self, grid: List[List[int]]) -> None:
        ROWS, COLS = len(grid), len(grid[0])
        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        INF = 2147483647

        def bfs(r, c):
            q = deque([(r, c)])
            visit = [[False] * COLS for _ in range(ROWS)]
            visit[r][c] = True
            steps = 0
            while q:
                for _ in range(len(q)):
                    row, col = q.popleft()
                    if grid[row][col] == 0:
                        return steps
                    for dr, dc in directions:
                        nr, nc = row + dr, col + dc
                        if (0 <= nr < ROWS and 0 <= nc < COLS and 
                            not visit[nr][nc] and grid[nr][nc] != -1
                        ):
                            visit[nr][nc] = True
                            q.append((nr, nc))
                steps += 1
            return INF

        for r in range(ROWS):
            for c in range(COLS):
                if grid[r][c] == INF:
                    grid[r][c] = bfs(r, c)
```
Time Complexity: $O((m*n)^2)$
Space Complexity: $O(m*n)$
- Where $m$ is the number of rows and $n$ is the number of columns in the $grid$
### (3) Multi Source BFS
```python
class Solution:
    def islandsAndTreasure(self, grid: List[List[int]]) -> None:
        ROWS, COLS = len(grid), len(grid[0])
        visit = set()
        q = deque()

        def addCell(r, c):
            if (min(r, c) < 0 or r == ROWS or c == COLS or
                (r, c) in visit or grid[r][c] == -1
            ):
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
                addCell(r + 1, c)
                addCell(r - 1, c)
                addCell(r, c + 1)
                addCell(r, c - 1)
            dist += 1
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m*n)$
- Where $m$ is the number of rows and $n$ is the number of columns in the $grid$ 

## References

[^1]: https://www.youtube.com/watch?v=e69C6xhiSQE
[^2]: https://neetcode.io/solutions/walls-and-gates