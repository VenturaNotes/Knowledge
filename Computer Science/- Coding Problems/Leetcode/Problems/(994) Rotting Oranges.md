---
Source:
  - https://leetcode.com/problems/rotting-oranges/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-23 at 10.25.32 PM.png]]
- Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten
- DFS won't really work
- Can run the [[Breadth First Search|BFS]] algorithm simultaneously on multiple sources
	- Usually implemented with a [[queue]] data structure
- Time complexity is $O(n*m)$
```python
class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        q = deque()
        time, fresh = 0, 0

        ROWS, COLS = len(grid), len(grid[0])
        for r in range(ROWS):
            for c in range(COLS):
                if grid[r][c] == 1:
                    fresh += 1
                if grid[r][c] == 2:
                    q.append([r, c])
        directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]
        while q and fresh > 0:
            for i in range(len(q)):
                r, c = q.popleft()
                for dr, dc in directions:
                    row,col = dr + r, dc + c
                    # if in bounds and fresh, make rotten
                    if (row < 0 or row == len(grid) or
                        col < 0 or col == len(grid[0]) or
                        grid[row][col] != 1):
                        continue
                    grid[row][col] = 0
                    q.append([row, col])
                    fresh -= 1
            time += 1
        return time if fresh == 0 else -1

```

## Source[^2]
### (1) Breadth First Search
```python
class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        q = collections.deque()
        fresh = 0
        time = 0

        for r in range(len(grid)):
            for c in range(len(grid[0])):
                if grid[r][c] == 1:
                    fresh += 1
                if grid[r][c] == 2:
                    q.append((r, c))

        directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]
        while fresh > 0 and q:
            length = len(q)
            for i in range(length):
                r, c = q.popleft()

                for dr, dc in directions:
                    row, col = r + dr, c + dc
                    if (row in range(len(grid))
                        and col in range(len(grid[0]))
                        and grid[row][col] == 1
                    ):
                        grid[row][col] = 2
                        q.append((row, col))
                        fresh -= 1
            time += 1
        return time if fresh == 0 else -1
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m*n)$
- What $m$ is the number of rows and $n$ is the number of columns in the $grid$
### (2) Breadth First Search (No Queue)
```python
class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        ROWS, COLS = len(grid), len(grid[0])
        fresh = 0
        time = 0

        for r in range(ROWS):
            for c in range(COLS):
                if grid[r][c] == 1:
                    fresh += 1

        directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]

        while fresh > 0:
            flag = False
            for r in range(ROWS):
                for c in range(COLS):
                    if grid[r][c] == 2:
                        for dr, dc in directions:
                            row, col = r + dr, c + dc
                            if (row in range(ROWS) and 
                                col in range(COLS) and 
                                grid[row][col] == 1):
                                grid[row][col] = 3  
                                fresh -= 1
                                flag = True

            if not flag:
                return -1

            for r in range(ROWS):
                for c in range(COLS):
                    if grid[r][c] == 3:
                        grid[r][c] = 2  

            time += 1

        return time
```
Time Complexity: $O((m*n)^2)$
Space Complexity: $O(1)$
- Where $m$ is the number of rows and $n$ is the number of columns in the $grid$
## References

[^1]: https://www.youtube.com/watch?v=y704fEOx0s0
[^2]: https://neetcode.io/solutions/rotting-oranges