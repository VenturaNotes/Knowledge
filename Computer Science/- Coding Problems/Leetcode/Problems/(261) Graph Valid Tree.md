---
Source:
  - https://leetcode.com/problems/graph-valid-tree/description/
  - https://thita.ai/problems/graph-valid-tree
Approaches: "0"
---
## Synthesis
- Locked on LeetCode
## Source [^1]
- ![[Screenshot 2024-11-23 at 11.38.08 PM.png]]
- Will be using [[LintCode]] for this problem as it's premium on LeetCode
- Will have [[undirected edges]]
	- It just means that the edges will go both ways
- Want to see if it creates a valid [[tree]]
	- Trees not allowed to have loops
	- A tree needs to be connected
- Using the edges will create an [[adjacency list]]
	- This list will be for creating every single node to all its neighbors
- An empty graph does count as a tree
	- If we don't even have node zero (or any nodes at all), this empty graph would still count as a tree
- Will do [[Depth first search|DFS]] (recursively)
	- If the number of visited nodes matches the input value for nodes, that means that every node inside the graph is connected
	- Need to make sure graph does not contain cycles or loops
- Will use [[HashSet]]
- Will keep track of previous nodes 
- Overall time and memory complexity is $O(E + V)$
```python
class Solution:
    """
    @param edges: a list of undirected edges
    @return: true if its' a valid tree, or false
    """
    def validTree(self, n: int, edges: List[List[int]]) -> bool:
        if not n:
            return True
        adj = { i: [] for i in range(n)}
        for n1, n2 in edges:
            adj[n1].append(n2)
            adj[n2].append(n1)
        
        visit = set()
        def dfs(i, prev):
            if i in visit:
                return False
            
            visit.add(i)
            for j in adj[i]:
                if j == prev:
                    continue
                if not dfs(j, i):
                    return False
            return True
        return dfs(0, -1) and n == len(visit)
        
```
## Source[^2]
### (1) Cycle Detection (DFS)
```python
class Solution:
    def validTree(self, n: int, edges: List[List[int]]) -> bool:
        if len(edges) > (n - 1):
            return False
        
        adj = [[] for _ in range(n)]
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)
        
        visit = set()
        def dfs(node, par):
            if node in visit:
                return False
            
            visit.add(node)
            for nei in adj[node]:
                if nei == par:
                    continue
                if not dfs(nei, node):
                    return False
            return True
        
        return dfs(0, -1) and len(visit) == n
```
Time Complexity: $O(V + E)$
Space Complexity: $O(V + E)$
- Where V is the number of vertices and E is the number of edges in the graph
### (2) Breadth First Search
```python
class Solution:
    def validTree(self, n: int, edges: List[List[int]]) -> bool:
        if len(edges) > n - 1:
            return False
        
        adj = [[] for _ in range(n)]
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)
        
        visit = set()
        q = deque([(0, -1)])  # (current node, parent node)
        visit.add(0)
        
        while q:
            node, parent = q.popleft()
            for nei in adj[node]:
                if nei == parent:
                    continue
                if nei in visit:
                    return False
                visit.add(nei)
                q.append((nei, node))
        
        return len(visit) == n
```
Time Complexity: $O(V + E)$
Space Complexity: $O(V +E)$
- Where V is the number of vertices and E is the number of edges in the graph.
### (3) Disjoint Set Union
```python
class DSU:
    def __init__(self, n):
        self.comps = n
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

        self.comps -= 1
        if self.Size[pu] < self.Size[pv]:
            pu, pv = pv, pu
        self.Size[pu] += self.Size[pv]
        self.Parent[pv] = pu
        return True
    
    def components(self):
        return self.comps

class Solution:
    def validTree(self, n: int, edges: List[List[int]]) -> bool:
        if len(edges) > n - 1:
            return False
        
        dsu = DSU(n)
        for u, v in edges:
            if not dsu.union(u, v):
                return False
        return dsu.components() == 1
```
Time Complexity: $O(V + (E + \alpha(V)))$
Space Complexity: $O(V)$
- Where V is the number of vertices and E is the number of edges in the graph. $\alpha$() is used for amortized complexity 
## References

[^1]: [Graph Valid Tree - Leetcode 261 - Python](https://www.youtube.com/watch?v=bXsUuownnoQ)
[^2]: https://neetcode.io/solutions/graph-valid-tree