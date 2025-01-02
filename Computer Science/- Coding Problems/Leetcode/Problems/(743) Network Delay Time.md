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
## References

[^1]: https://www.youtube.com/watch?v=EaphyqKU4PQ