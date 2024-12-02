---
Source:
  - https://leetcode.com/problems/cheapest-flights-within-k-stops/
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
## References

[^1]: https://www.youtube.com/watch?v=5eIK3zUdYmE