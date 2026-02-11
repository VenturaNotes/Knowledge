---
Source:
  - https://leetcode.com/problems/clone-graph/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-23 at 9.54.09 PM.png]]
- Given a reference of a node in a connected undirected graph
- Return a deep copy (clone) of the graph
- Each node in the graph contains a val (int) and a list `(List[Node])` of its neighbors
- Original Graph
	- No
		- Won't just create a shallow copy
			- You can't return the same graph
		- The nodes were cloned. But the graph is messed up. Doesn't have the same connections
	- Yes
		- This looks like a clone. The new nodes are NEW, Graph looks the same.
- Will use a [[hashmap]] + [[Depth first search|DFS]] (but could use [[Breadth First Search|BFS]] instead)
- We can do this in O(n) = E + V
	- Edges + vertices
```python
"""
# Definition for a Node.
class Node:
    def __init__(self, val = 0, neighbors = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
"""

class Solution:
    def cloneGraph(self, node: Optional['Node']) -> Optional['Node']:
        oldToNew = {}

        def dfs(node):
            if node in oldToNew:
                return oldToNew[node]
            
            copy = Node(node.val)
            oldToNew[node] = copy
            for nei in node.neighbors:
                copy.neighbors.append(dfs(nei))
            return copy
        return dfs(node) if node else None
```
## Source[^2]
### (1) Depth First Search
```python
"""
# Definition for a Node.
class Node:
    def __init__(self, val = 0, neighbors = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
"""

class Solution:
    def cloneGraph(self, node: Optional['Node']) -> Optional['Node']:
        oldToNew = {}

        def dfs(node):
            if node in oldToNew:
                return oldToNew[node]

            copy = Node(node.val)
            oldToNew[node] = copy
            for nei in node.neighbors:
                copy.neighbors.append(dfs(nei))
            return copy

        return dfs(node) if node else None
```
Time Complexity: $O(V + E)$
Space Complexity: $O(V)$
- Where $V$ is the number of vertices and $E$ is the number of edges
### (2) Breadth First Search
```python
"""
# Definition for a Node.
class Node:
    def __init__(self, val = 0, neighbors = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
"""

class Solution:
    def cloneGraph(self, node: Optional['Node']) -> Optional['Node']:
        if not node:
            return None

        oldToNew = {}
        oldToNew[node] = Node(node.val)
        q = deque([node])

        while q:
            cur = q.popleft()
            for nei in cur.neighbors:
                if nei not in oldToNew:
                    oldToNew[nei] = Node(nei.val)
                    q.append(nei)
                oldToNew[cur].neighbors.append(oldToNew[nei])

        return oldToNew[node]
```
Time Complexity: $O(V + E)$
Space Complexity: $O(E)$
- Where V is the number of vertices and E is the number of edges
## References

[^1]: [Clone Graph - Depth First Search - Leetcode 133](https://www.youtube.com/watch?v=mQeF6bN8hMk)
[^2]: https://neetcode.io/solutions/clone-graph