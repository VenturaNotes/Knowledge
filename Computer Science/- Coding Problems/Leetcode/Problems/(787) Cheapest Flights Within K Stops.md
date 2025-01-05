---
Source:
  - https://leetcode.com/problems/cheapest-flights-within-k-stops/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-01 at 2.35.35 AM.png]]
- Will use the [[Bellman-Ford algorithm]] for this problem
	- Can only do at most `k` stops which is why we can't really use [[Dijkstra's algorithm]] here
	- Time complexity: $O(E*k)$
		- E is the edges and k is the number of stops
		- Will use a BFS approach
		- In general, the Bellman-ford algorithm runs in $E*V$ time
- Bellman-Ford can deal with negative weights which Dijkstra's algorithm can't do
	- Using BFS
	- Will do `k+1` layers of BFS (nothing to do with Bellman-ford. Just how problem is defined)
- Since overall time complexity the same, better to do readable solution rather than a solution that saves 10% on the runtime.
- We have to use a temporary prices array because we might use a path that has an extra node along it which we're not supposed to follow
```python
class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
        prices = [float("inf")] *n
        prices[src] = 0

        for i in range(k + 1):
            tmpPrices = prices.copy()
            for s, d, p in flights: #s=source, d=destination, p=price
                if prices[s] == float("inf"):
                    continue
                if prices[s] + p < tmpPrices[d]:
                    tmpPrices[d] = prices[s] + p
            prices = tmpPrices
        return -1 if prices[dst] == float("inf") else prices[dst]

```
## Source[^2]
### (1) Dijkstra's Algorithm
```python
class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
        INF = float("inf")
        adj = [[] for _ in range(n)]
        dist = [[INF] * (k + 5) for _ in range(n)]
        for u, v, cst in flights:
            adj[u].append([v, cst])
        
        dist[src][0] = 0
        minHeap = [(0, src, -1)] # cost, node, stops
        while len(minHeap):
            cst, node, stops = heapq.heappop(minHeap)
            if dst == node: return cst
            if stops == k or dist[node][stops + 1] < cst:
                continue
            for nei, w in adj[node]:
                nextCst = cst + w
                nextStops = 1 + stops
                if dist[nei][nextStops + 1] > nextCst:
                    dist[nei][nextStops + 1] = nextCst
                    heapq.heappush(minHeap, (nextCst, nei, nextStops))

        return -1
```
Time Complexity: $O((n+m)*k)$
Space Complexity: $O(n*k)$
- Where $n$ is the number of cities, $m$ is the number of flights and $k$ is the number of stops.
### (2) Bellman Ford Algorithm
```python
class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
        prices = [float("inf")] * n
        prices[src] = 0

        for i in range(k + 1):
            tmpPrices = prices.copy()

            for s, d, p in flights:  # s=source, d=dest, p=price
                if prices[s] == float("inf"):
                    continue
                if prices[s] + p < tmpPrices[d]:
                    tmpPrices[d] = prices[s] + p
            prices = tmpPrices
        return -1 if prices[dst] == float("inf") else prices[dst]
```
Time Complexity: $O(n+(m*k))$
Space Complexity: $O(n)$
- Where $n$ is the number 
## References

[^1]: https://www.youtube.com/watch?v=5eIK3zUdYmE
[^2]: https://neetcode.io/solutions/cheapest-flights-within-k-stops