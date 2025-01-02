---
Source:
  - https://leetcode.com/problems/minimum-interval-to-include-each-query/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-30 at 2.38.12 AM.png]]
- Find length of smallest interval that the query falls into
- $O(n*q)$
	- This will be the overall time complexity
	- `n` is the size of intervals
	- `q` is the size of queries
- More efficient time complexity
	- $O(nlogn + qlogq)$ 
		- Will sort intervals and queries
		- Then can scan queries from left to right
- Will need a [[min Heap]] to find the smallest interval for this
- Will make sure start time is less than or equal to query
```python
class Solution:
    def minInterval(self, intervals: List[List[int]], queries: List[int]) -> List[int]:
        intervals.sort()
        minHeap = []
        res, i = {}, 0

        for q in sorted(queries):
            while i < len(intervals) and intervals[i][0] <= q:
                l, r = intervals[i]
                heapq.heappush(minHeap, (r - l + 1, r))
                i += 1
            while minHeap and minHeap[0][1] < q:
                heapq.heappop(minHeap)
            res[q] = minHeap[0][0] if minHeap else -1
        return [res[q] for q in queries]
```
- Time Complexity: $O(nlogn + qlogq)$ 
	- `n` is length of intervals
	- `q` is length of queries
	
## References

[^1]: https://www.youtube.com/watch?v=5hQ5WWW5awQ