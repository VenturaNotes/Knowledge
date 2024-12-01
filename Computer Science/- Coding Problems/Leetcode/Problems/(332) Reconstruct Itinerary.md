---
Source:
  - https://leetcode.com/problems/reconstruct-itinerary/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-30 at 4.42.09 AM.png]]
- Will use [[Depth first search|DFS]] for this problem and it's useful to understand graphs and graphs traversals
- Need to return the smaller lexical order result
- Will create [[adjacency list]]
- For backtracking, the worst case scenario
	- Time complexity: $O(E^2)$
	- Memory complexity: $O(E)$ 
```python
class Solution:
    def findItinerary(self, tickets: List[List[str]]) -> List[str]:
        adj = { src : [] for src, dst in tickets}

        tickets.sort()
        for src, dst in tickets:
            adj[src].append(dst)
        
        res = ["JFK"]
        def dfs(src):
            if len(res) == len(tickets) + 1:
                return True
            if src not in adj:
                return False
            
            temp = list(adj[src])
            for i, v in enumerate(temp):
                adj[src].pop(i)
                res.append(v)

                if dfs(v): return True

                adj[src].insert(i, v)
                res.pop()
            return False
        dfs("JFK")
        return res
```
## References

[^1]: https://www.youtube.com/watch?v=ZyB_gQ8vqGA