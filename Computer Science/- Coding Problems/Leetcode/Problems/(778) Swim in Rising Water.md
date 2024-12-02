---
Source:
  - https://leetcode.com/problems/swim-in-rising-water/
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
## References

[^1]: https://www.youtube.com/watch?v=amvrKlMLuGY