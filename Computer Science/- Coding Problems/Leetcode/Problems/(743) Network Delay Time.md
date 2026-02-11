---
Source:
  - https://leetcode.com/problems/network-delay-time/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-01 at 1.56.09 AM.png]]
- Need to use [[dijkstra's algorithm]] for this problem
	- It's the shortest path graph algorithm. Not super common on LeetCode
- In the first example, we see the time taken would be the max time of a node `2` since by that point, the signal will have reached all other nodes
- Dijkstra's algorithm is basically a BFS algorithm, but a difference is that Dijkstra uses a Min Heap (or rather a [[priority queue]]). Min Heap is not a common data structure but it is needed for this graph algorithm
- Every time we want to get a minimum value from Min Heap, it's just a $logn$ operation
- The maximum number of edges that we could possibly have is about proportional to the number of nodes squared
	- E = $V^2$ 
	- Max size of heap could be $V^2$ 
	- Every heap operation could be worst case $Elog(v^2)$
	- Overall time complexity with a priority queue for dijkstra's algorithm is $Elogv$ 
```python
class Solution:
    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:
        edges = collections.defaultdict(list)

        for u, v, w in times:
            edges[u].append((v, w))
        minHeap = [(0, k)]
        visit = set()
        t = 0
        while minHeap:
            w1, n1 = heapq.heappop(minHeap)
            if n1 in visit:
                continue
            visit.add(n1)
            t = max(t, w1)

            for n2, w2 in edges[n1]:
                if n2 not in visit:
                    heapq.heappush(minHeap, (w1 + w2, n2))
        return t if len(visit) == n else -1
```
- Time complexity: $O(E * logV)$
## Source[^2]
### (1) Depth First Search
```python
class Solution:
    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:
        adj = defaultdict(list)
        for u, v, w in times:
            adj[u].append((v, w))
        
        dist = {node: float("inf") for node in range(1, n + 1)}

        def dfs(node, time):
            if time >= dist[node]:
                return
            
            dist[node] = time
            for nei, w in adj[node]:
                dfs(nei, time + w)
        
        dfs(k, 0)
        res = max(dist.values())
        return res if res < float('inf') else -1
```
Time Complexity: $O(V*E)$
Space Complexity: $O(V+E)$
- Where $V$ is the number of vertices and E is the number of edges
### (2) Floyd Warshall Algorithm
```python
class Solution:
    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:
        inf = float('inf')
        dist = [[inf] * n for _ in range(n)]
        
        for u, v, w in times:
            dist[u-1][v-1] = w
        for i in range(n):
            dist[i][i] = 0
        
        for mid in range(n):
            for i in range(n):
                for j in range(n):
                    dist[i][j] = min(dist[i][j], dist[i][mid] + dist[mid][j])
        
        res = max(dist[k-1])
        return res if res < inf else -1
```
Time Complexity: $O(V^3)$
Space Complexity: $O(V^2)$
- Where $V$ is the number of vertices
### (3) Bellman Ford Algorithm
```python
class Solution:
    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:
        dist = [float('inf')] * n
        dist[k - 1] = 0
        for _ in range(n - 1):
            for u, v, w in times:
                if dist[u - 1] + w < dist[v - 1]:
                    dist[v - 1] = dist[u - 1] + w
        max_dist = max(dist)
        return max_dist if max_dist < float('inf') else -1
```
Time Complexity: $O(V*E)$
Space Complexity: $O(V)$
- Where $V$ is the number of vertices and E is the number of edges
### (4) Shortest Path Faster Algorithm
```python
class Solution:
    def networkDelayTime(self, times, n, k):
        adj = defaultdict(list)
        for u, v, w in times:
            adj[u].append((v, w))
        
        dist = {node: float("inf") for node in range(1, n + 1)}
        q = deque([(k, 0)])
        dist[k] = 0

        while q:
            node, time = q.popleft()
            if dist[node] < time:
                continue
            for nei, w in adj[node]:
                if time + w < dist[nei]:
                    dist[nei] = time + w
                    q.append((nei, time + w))

        res = max(dist.values())
        return res if res < float('inf') else -1
```
Time Complexity: $O(V+E)$ in average case, $O(V*E)$ in worst case
Space Complexity: $O(V+E)$
- Where $V$ is the number of vertices and $E$ is the number of edges.
### (5) Dijkstra's Algorithm
```python
class Solution:
    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:
        edges = collections.defaultdict(list)
        for u, v, w in times:
            edges[u].append((v, w))

        minHeap = [(0, k)]
        visit = set()
        t = 0
        while minHeap:
            w1, n1 = heapq.heappop(minHeap)
            if n1 in visit:
                continue
            visit.add(n1)
            t = w1

            for n2, w2 in edges[n1]:
                if n2 not in visit:
                    heapq.heappush(minHeap, (w1 + w2, n2))
        return t if len(visit) == n else -1
```
Time Complexity: $O(ElogV)$
Space Complexity: $O(V+E)$
- Where $V$ is the number of vertices and $E$ is the number of edges
## References

[^1]: [Network Delay Time - Dijkstra's algorithm - Leetcode 743](https://www.youtube.com/watch?v=EaphyqKU4PQ)
[^2]: https://neetcode.io/solutions/network-delay-time