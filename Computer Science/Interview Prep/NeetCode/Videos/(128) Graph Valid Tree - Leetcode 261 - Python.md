---
Source:
  - https://www.youtube.com/watch?v=bXsUuownnoQ
---
## Synthesis
- 
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
## References

[^1]: https://www.youtube.com/watch?v=bXsUuownnoQ