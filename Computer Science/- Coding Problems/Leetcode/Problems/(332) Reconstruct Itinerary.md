---
Source:
  - https://leetcode.com/problems/reconstruct-itinerary/
Reviewed: false
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
## Sources[^2]
### (1) Depth First Search
```python
class Solution:
    def findItinerary(self, tickets: List[List[str]]) -> List[str]:
        adj = {src: [] for src, dst in tickets}
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
Time Complexity: $O(E*V)$
Space Complexity: $O(E*V)$
- Where E is the number of tickets (edges) and V is the number of airports (vertices).
### (2) Hierholzer's Algorithm (Recursion)
```python
class Solution:
    def findItinerary(self, tickets: List[List[str]]) -> List[str]:
        adj = defaultdict(list)
        for src, dst in sorted(tickets)[::-1]:
            adj[src].append(dst)

        res = []
        def dfs(src):
            while adj[src]:
                dst = adj[src].pop()
                dfs(dst)
            res.append(src)
            
        dfs('JFK')
        return res[::-1]
```
Time Complexity: $O(ElogE)$
Space Complexity: $O(E)$
- Where E is the number of tickets (edges) and V is the number of airports (vertices).
### (3) Hierholzer's Algorithm (Iteration)
```python
class Solution:
    def findItinerary(self, tickets: List[List[str]]) -> List[str]:
        adj = defaultdict(list)
        for src, dst in sorted(tickets)[::-1]:
            adj[src].append(dst)
            
        stack = ["JFK"]
        res = []
        
        while stack:
            curr = stack[-1]
            if not adj[curr]:
                res.append(stack.pop())
            else:
                stack.append(adj[curr].pop())
                
        return res[::-1]
```
Time Complexity: $O(ElogE)$
Space Complexity: $O(E)$
- Where E is the number of tickets (edges) and V is the number of airports (vertices)
## References

[^1]: https://www.youtube.com/watch?v=ZyB_gQ8vqGA
[^2]: https://neetcode.io/solutions/reconstruct-itinerary