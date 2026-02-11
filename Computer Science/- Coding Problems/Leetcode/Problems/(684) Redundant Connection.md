---
Source:
  - https://leetcode.com/problems/redundant-connection/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-24 at 12.39.06 AM.png]]
- [[Undirected graph]]
- DFS will solve this in $O(n^2)$ but could reduce this to $O(n)$ with [[UnionFind]] algorithm
- In this problem, a tree is an [[undirected graph]] that is [[connected]] and has no [[cycles]]
- If we have `n` nodes and `n` edges, we will end up with a cycle no matter what.
	- Once we've noticed that we found an edge in our input array that caused us to take our connected graph and add another redundant connection, that will be the one we return. 
		- Seems like why we're able to use union find algorithm for this
```python
class Solution:
    def findRedundantConnection(self, edges: List[List[int]]) -> List[int]:
        par = [i for i in range(len(edges) + 1)]
        rank = [1] * (len(edges) + 1)

        def find(n):
            p = par[n]
            while p != par[p]:
                par[p] = par[par[p]]
                p = par[p]
            return p
        
        # return False if cant complete
        def union(n1, n2):
            p1, p2 = find(n1), find(n2)

            if p1 == p2:
                return False
            
            if rank[p1] > rank[p2]:
                par[p2] = p1
                rank[p1] += rank[p2]
            else:
                par[p1] = p2
                rank[p2] += rank[p1]
            return True
        
        for n1, n2 in edges:
            if not union(n1, n2):
                return [n1, n2]
```
## Source[^2]
### (1) Cycle Detection (DFS)
```python
class Solution:
    def findRedundantConnection(self, edges: List[List[int]]) -> List[int]:
        n = len(edges)
        adj = [[] for _ in range(n + 1)]

        def dfs(node, par):
            if visit[node]:
                return True
            
            visit[node] = True
            for nei in adj[node]:
                if nei == par:
                    continue
                if dfs(nei, node):
                    return True
            return False
        
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)
            visit = [False] * (n + 1)
            
            if dfs(u, -1):
                return [u, v]
        return []
```
Time Complexity: $O(E*(V+E))$
Space Complexity: $O(V+E)$
- Where V is the number of vertices and E is the number of edges in the graph.

### (2) Depth First Search (Optimal)
```python
class Solution:
    def findRedundantConnection(self, edges: List[List[int]]) -> List[int]:
        n = len(edges)
        adj = [[] for _ in range(n + 1)]
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)

        visit = [False] * (n + 1)
        cycle = set()
        cycleStart = -1
        
        def dfs(node, par):
            nonlocal cycleStart
            if visit[node]:
                cycleStart = node
                return True  
            
            visit[node] = True
            for nei in adj[node]:
                if nei == par:
                    continue
                if dfs(nei, node):
                    if cycleStart != -1:
                        cycle.add(node)
                    if node == cycleStart:
                        cycleStart = -1
                    return True
            return False
        
        dfs(1, -1)
        
        for u, v in reversed(edges):
            if u in cycle and v in cycle:
                return [u, v]

        return []
```
Time Complexity: $O(V + E)$
Space Complexity: $O(V + E)$
- Where V is the number of vertices and E is the number of edges in the graph

### (3) Topological Sort (Kahn's Algorithm)
```python
class Solution:
    def findRedundantConnection(self, edges: List[List[int]]) -> List[int]:
        n = len(edges)
        indegree = [0] * (n + 1)
        adj = [[] for _ in range(n + 1)]
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)
            indegree[u] += 1
            indegree[v] += 1
        
        q = deque()
        for i in range(1, n + 1):
            if indegree[i] == 1:
                q.append(i)

        while q:
            node = q.popleft()
            indegree[node] -= 1
            for nei in adj[node]:
                indegree[nei] -= 1
                if indegree[nei] == 1:
                    q.append(nei)

        for u, v in edges[::-1]:
            if indegree[u] == 2 and indegree[v]:
                return [u, v]
        return []
```
Time Complexity: $O(V + E)$
Space Complexity: $O(V + E)$
- Where V is the number of vertices and E is the number of edges in the graph.
### (4) Disjoint Set Union
```python
class Solution:
    def findRedundantConnection(self, edges: List[List[int]]) -> List[int]:
        par = [i for i in range(len(edges) + 1)]
        rank = [1] * (len(edges) + 1)

        def find(n):
            p = par[n]
            while p != par[p]:
                par[p] = par[par[p]]
                p = par[p]
            return p

        def union(n1, n2):
            p1, p2 = find(n1), find(n2)

            if p1 == p2:
                return False
            if rank[p1] > rank[p2]:
                par[p2] = p1
                rank[p1] += rank[p2]
            else:
                par[p1] = p2
                rank[p2] += rank[p1]
            return True

        for n1, n2 in edges:
            if not union(n1, n2):
                return [n1, n2]
```
Time Complexity: $O(V + (E *\alpha(V)))$
Space Complexity: $O(V)$
- Where V is the number of vertices and E is the number of edges in the graph. $\alpha$() is used for amortized complexity
## References

[^1]: [Redundant Connection - Union Find - Leetcode 684 - Python](https://www.youtube.com/watch?v=FXWRE67PLL0)
[^2]: https://neetcode.io/solutions/redundant-connection