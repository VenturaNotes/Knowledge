---
Source:
  - https://leetcode.com/problems/min-cost-to-connect-all-points/
Reviewed: false
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
## Source[^2]
### (1) Kruskal's Algorithm
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

class Solution:
    def minCostConnectPoints(self, points: List[List[int]]) -> int:
        n = len(points)
        dsu = DSU(n)
        edges = []
        for i in range(n):
            x1, y1 = points[i]
            for j in range(i + 1, n):
                x2, y2 = points[j]
                dist = abs(x1 - x2) + abs(y1 - y2)
                edges.append((dist, i, j))
        
        edges.sort()
        res = 0
        for dist, u, v in edges:
            if dsu.union(u, v):
                res += dist
        return res
```
Time Complexity: $O(n^2logn)$
Space Complexity: $O(n^2)$

### (2) Prim's Algorithm
```python
class Solution:
    def minCostConnectPoints(self, points: List[List[int]]) -> int:
        N = len(points)
        adj = {i: [] for i in range(N)}
        for i in range(N):
            x1, y1 = points[i]
            for j in range(i + 1, N):
                x2, y2 = points[j]
                dist = abs(x1 - x2) + abs(y1 - y2)
                adj[i].append([dist, j])
                adj[j].append([dist, i])

        res = 0
        visit = set()
        minH = [[0, 0]]
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
Time Complexity: $O(n^2logn)$
Space Complexity: $O(n^2)$

### (3) Prim's Algorithm (Optimal)
```python
class Solution:
    def minCostConnectPoints(self, points: List[List[int]]) -> int:
        n, node = len(points), 0
        dist = [100000000] * n
        visit = [False] * n
        edges, res = 0, 0

        while edges < n - 1:
            visit[node] = True
            nextNode = -1
            for i in range(n):
                if visit[i]:
                    continue
                curDist = (abs(points[i][0] - points[node][0]) + 
                           abs(points[i][1] - points[node][1]))
                dist[i] = min(dist[i], curDist)
                if nextNode == -1 or dist[i] < dist[nextNode]:
                    nextNode = i
                    
            res += dist[nextNode]
            node = nextNode
            edges += 1

        return res
```
Time Complexity: $O(n^2)$
Space Complexity: $O(n)$
## References

[^1]: [Prim's Algorithm - Minimum Spanning Tree - Min Cost to Connect all Points - Leetcode 1584 - Python](https://www.youtube.com/watch?v=f7JOBJIC-NA)
[^2]: https://neetcode.io/solutions/min-cost-to-connect-all-points