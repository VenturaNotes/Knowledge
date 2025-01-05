---
Source:
  - https://www.youtube.com/watch?v=8f1XPm4WOUc
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-24 at 12.28.09 AM.png]]
- This is a premium problem
- Return number of [[connected components]]
	- This is an individual portion of the graph that is all contiguous
	- We see components that are disjoint
	- Two different contiguous components
	- One node by itself does count as a connected component
- Could use [[Depth first search|DFS]]
- Using an unoptimized algorithm would be $O(e + v)$ 
- Could use the [[UnionFind]] algorithm
	- It was literally made for a problem like this
	- Union Find is basically a forest of trees
	- Will have `n` trees (one for every single node in the input)
- Will maintain the [[rank]] of every single component
	- What's the size of its entire connected component?
		- It's 1 initially
- When you get the root parent of two nodes, that's how you know if they're already connected or not.
	- Will always add to root parent to minimize height of tree
- Most union find problems are pretty similar
- LeetCode problem 547 `Number of Provinces` is pretty similar to this problem
- Path compression. This is how union find problems are optimized
```python
class Solution:
    def countComponents(self, n: int, edges: List[List[int]]) -> int:
        par = [i for i in range(n)]
        rank = [1] * n

        def find(n1):
            res = n1

            while res != par[res]:
                par[res] = par[par[res]]
                res = par[res]
            return res
        
        def union(n1, n2):
            p1, p2 = find(n1), find(n2)

            if p1 == p2:
                return 0
            
            if rank[p2] > rank[p1]:
                par[p1] = p2
                rank[p2] += rank[p1]
            else:
                par[p2] = p1
                rank[p1] += rank[p2]
            return 1
        
        res = n
        for n1, n2 in edges:
            res -= union(n1, n2)
        return res
```
## Source[^2]
### (1) Depth First Search
```python
class Solution:
    def countComponents(self, n: int, edges: List[List[int]]) -> int:
        adj = [[] for _ in range(n)]
        visit = [False] * n
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)

        def dfs(node):
            for nei in adj[node]:
                if not visit[nei]:
                    visit[nei] = True
                    dfs(nei)
        
        res = 0
        for node in range(n):
            if not visit[node]:
                visit[node] = True
                dfs(node)
                res += 1
        return res
```
Time Complexity: $O(V +E)$
Space Complexity: $O(V + E)$
- Where V is the number of vertices and E is the number of edges in the graph.
### (2) Breadth First Search
```python
class Solution:
    def countComponents(self, n: int, edges: List[List[int]]) -> int:
        adj = [[] for _ in range(n)]
        visit = [False] * n
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)

        def bfs(node):
            q = deque([node])
            visit[node] = True
            while q:
                cur = q.popleft()
                for nei in adj[cur]:
                    if not visit[nei]:
                        visit[nei] = True
                        q.append(nei)
        
        res = 0
        for node in range(n):
            if not visit[node]:
                bfs(node)
                res += 1
        return res
```
Time Complexity: $O(V + E)$
Space Complexity: $O(V + E)$
- Where V is the number of vertices and E is the number of edges in the graph.
### (3) Disjoint Set Union (Rank | Size)
```python
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [1] * n

    def find(self, node):
        cur = node
        while cur != self.parent[cur]:
            self.parent[cur] = self.parent[self.parent[cur]]
            cur = self.parent[cur]
        return cur

    def union(self, u, v):
        pu = self.find(u)
        pv = self.find(v)
        if pu == pv:
            return False
        if self.rank[pv] > self.rank[pu]:
            pu, pv = pv, pu
        self.parent[pv] = pu
        self.rank[pu] += self.rank[pv]
        return True

class Solution:
    def countComponents(self, n: int, edges: List[List[int]]) -> int:
        dsu = DSU(n)
        res = n
        for u, v in edges:
            if dsu.union(u, v):
                res -= 1
        return res
```
Time Complexity: $O(V + (E * \alpha(V)))$
Space Complexity: $O(V)$
- Where V is the number of vertices and E is the number of edges in the graph. $\alpha$() is used for amortized complexity
## References

[^1]: https://www.youtube.com/watch?v=8f1XPm4WOUc
[^2]: https://neetcode.io/solutions/number-of-connected-components-in-an-undirected-graph