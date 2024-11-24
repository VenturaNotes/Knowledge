---
Source:
  - https://leetcode.com/problems/redundant-connection/
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
## References

[^1]: https://www.youtube.com/watch?v=FXWRE67PLL0