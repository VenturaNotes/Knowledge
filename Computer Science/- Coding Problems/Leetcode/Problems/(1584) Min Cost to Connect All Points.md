---
Source:
  - https://leetcode.com/problems/min-cost-to-connect-all-points/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-30 at 5.30.41 AM.png]]
- [[Minimum Spanning Trees|minimum spanning tree]]
	- We know it's an MST problem because it asks the minimum cost to make all points connected
	- [[Prim's algorithm]]
		- Will implement this one as it's easier to implement and happens to be more efficient
		- It's $O(n^2logn)$ 
			- `n` is the number of points given
			- `logn` is from Prim's algorithm
			- Will use a [[min heap]] for this problem
		- Similar to [[dijkstra's algorithm]]
	- [[Kruskal's algorithm]]
- [[manhattan distance]]
	- The cost of connecting two points $[x_i, y_i]$ and $[x_j, y_j]$ is the manhattan distance between them: $|x_i - x_j| + |y_i - y_j|$, where `|val|` denotes the absolute value of `val`
- Want minimum cost to make all points connected
- We want all nodes to be connected together without forming a cycle
	- Will take `n-1` edges to connect all nodes together without creating a cycle
- With Prim's algorithm, will perform a BFS on a node (can start with any of them)
	- Will have a visit (hash set)
		- Make sure we don't add two nodes twice
	- and a [[frontier]] (min heap)
		- Keep track of frontier
		- Want to connect with minimum possible cost
```python
class Solution:
    def minCostConnectPoints(self, points: List[List[int]]) -> int:
        N = len(points)

        adj = {i:[] for i in range(N)} # i : list of [cost, node]
        for i in range(N):
            x1, y1 = points[i]
            for j in range(i + 1, N):
                x2, y2 = points[j]
                dist = abs(x1 - x2) + abs(y1-y2)
                adj[i].append([dist, j])
                adj[j].append([dist, i])
    
        # Prim's
        res = 0
        visit = set()
        minH = [[0, 0]] # [cost, point]
        while len(visit) < N:
            cost, i = heapq.heappop(minH)
            if i in visit:
                continue
            res += cost
            visit.add(i)
            for neiCost, nei in adj[i]:
                if nei not in visit:
                    heapq.heappush(minH, [neiCost, nei])
        return res

```
## References

[^1]: https://www.youtube.com/watch?v=f7JOBJIC-NA