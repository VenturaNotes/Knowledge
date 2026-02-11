---
Source:
  - https://leetcode.com/problems/swim-in-rising-water/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-01 at 2.05.03 AM.png]]
- Bottleneck will be whatever the maximum height is
- Could use [[Dijkstra's algorithm]] which is a greedy algorithm and could use a modified version which will give time complexity of $n^2logn$ 
	- Basically BFS with a Min Heap (which is a priority queue)
		- Will be adding positions to frontier
- Want maximum height along path to be minimized
- Will have a visit HashSet as well
- Went through a dry run here
```python
class Solution:
    def swimInWater(self, grid: List[List[int]]) -> int:
        N = len(grid)
        visit = set()
        minH = [[grid[0][0], 0, 0]] # (time/max-height, r ,c)
        directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]

        visit.add((0, 0))
        while minH:
            t, r, c = heapq.heappop(minH)

            if r == N - 1 and c == N -1:
                return t
            for dr, dc in directions:
                neiR, neiC = r + dr, c + dc
                if (neiR < 0 or neiC < 0 or neiR == N 
                    or neiC == N or (neiR, neiC) in visit):
                    continue
                visit.add((neiR, neiC))
                heapq.heappush(minH, [max(t, grid[neiR][neiC]), neiR, neiC])
```
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def swimInWater(self, grid: List[List[int]]) -> int:
        n = len(grid)
        visit = [[False] * n for _ in range(n)]

        def dfs(node, t):
            r, c = node
            if min(r, c) < 0 or max(r, c) >= n or visit[r][c]:
                return 1000000
            if r == (n - 1) and c == (n - 1):
                return max(t, grid[r][c])
            visit[r][c] = True
            t = max(t, grid[r][c])
            res = min(dfs((r + 1, c), t),
                       dfs((r - 1, c), t),
                       dfs((r, c + 1), t),
                       dfs((r, c - 1), t))
            visit[r][c] = False
            return res
        
        return dfs((0, 0), 0)
```
Time Complexity: $O(4^{n^2})$
Space Complexity: $O(n^2)$

### (2) Depth First Search
```python
class Solution:
    def swimInWater(self, grid: List[List[int]]) -> int:
        n = len(grid)
        visit = [[False] * n for _ in range(n)]
        minH = maxH = grid[0][0]
        for row in range(n):
            maxH = max(maxH, max(grid[row]))
            minH = min(minH, min(grid[row]))

        def dfs(node, t):
            r, c = node
            if (min(r, c) < 0 or max(r, c) >= n or 
                visit[r][c] or grid[r][c] > t):
                return False
            if r == (n - 1) and c == (n - 1):
                return True
            visit[r][c] = True
            return (dfs((r + 1, c), t) or
                    dfs((r - 1, c), t) or
                    dfs((r, c + 1), t) or
                    dfs((r, c - 1), t))
            
        for t in range(minH, maxH):
            if dfs((0, 0), t):
                return t
            for r in range(n):
                for c in range(n):
                    visit[r][c] = False
        
        return maxH
```
Time Complexity: $O(n^4)$
Space Complexity: $O(n^2)$

### (3) Binary Search + DFS
```python
class Solution:
    def swimInWater(self, grid: List[List[int]]) -> int:
        n = len(grid)
        visit = [[False] * n for _ in range(n)]
        minH = maxH = grid[0][0]
        for row in range(n):
            maxH = max(maxH, max(grid[row]))
            minH = min(minH, min(grid[row]))

        def dfs(node, t):
            r, c = node
            if (min(r, c) < 0 or max(r, c) >= n or 
                visit[r][c] or grid[r][c] > t):
                return False
            if r == (n - 1) and c == (n - 1):
                return True
            visit[r][c] = True
            return (dfs((r + 1, c), t) or
                    dfs((r - 1, c), t) or
                    dfs((r, c + 1), t) or
                    dfs((r, c - 1), t))
        
        l, r = minH, maxH
        while l < r:
            m = (l + r) >> 1
            if dfs((0, 0), m):
                r = m
            else:
                l = m + 1
            for row in range(n):
                for col in range(n):
                    visit[row][col] = False
        
        return r
```
Time Complexity: $O(n^2logn)$
Space Complexity: $O(n^2)$

### (4) Dijkstra's Algorithm
```python
class Solution:
    def swimInWater(self, grid: List[List[int]]) -> int:
        N = len(grid)
        visit = set()
        minH = [[grid[0][0], 0, 0]]  # (time/max-height, r, c)
        directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]

        visit.add((0, 0))
        while minH:
            t, r, c = heapq.heappop(minH)
            if r == N - 1 and c == N - 1:
                return t
            for dr, dc in directions:
                neiR, neiC = r + dr, c + dc
                if (neiR < 0 or neiC < 0 or 
                    neiR == N or neiC == N or
                    (neiR, neiC) in visit
                ):
                    continue
                visit.add((neiR, neiC))
                heapq.heappush(minH, [max(t, grid[neiR][neiC]), neiR, neiC])
```
Time Complexity: $O(n^2logn)$
Space Complexity: $O(n^2)$

### (5) Kruskal's Algorithm
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
        if self.Size[pu] < self.Size[pv]:
            pu, pv = pv, pu
        self.Size[pu] += self.Size[pv]
        self.Parent[pv] = pu
        return True
    
    def connected(self, u, v):
        return self.find(u) == self.find(v)

class Solution:
    def swimInWater(self, grid: List[List[int]]) -> int:
        N = len(grid)
        dsu = DSU(N * N)
        positions = sorted((grid[r][c], r, c) for r in range(N) for c in range(N))
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        
        for t, r, c in positions:
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < N and 0 <= nc < N and grid[nr][nc] <= t:
                    dsu.union(r * N + c, nr * N + nc)
            if dsu.connected(0, N * N - 1):
                return t
```
Time Complexity: $O(n^2logn)$
Space Complexity: $O(n^2)$
## References

[^1]: [Swim in Rising Water - Dijkstra's Algorithm - Leetcode 778 - Python](https://www.youtube.com/watch?v=amvrKlMLuGY)
[^2]: https://neetcode.io/solutions/swim-in-rising-water