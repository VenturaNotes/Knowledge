---
Source:
  - https://leetcode.com/problems/k-closest-points-to-origin/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-22 at 12.59.48 AM.png]]
- Sorting entire list would be $nlogn$ 
- Since only looking for k points, will use [[min heap]]
- [[Heapify]] is a linear time O(n) algorithm
- Time complexity will be $klogn$ 
```python
class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        minHeap = []
        for x, y in points:
            dist = (x ** 2) + (y**2)
            minHeap.append([dist, x, y])

        heapq.heapify(minHeap)
        res = []
        while k > 0:
            dist, x, y = heapq.heappop(minHeap)
            res.append([x, y])
            k -= 1
        return res
```
## References

[^1]: https://www.youtube.com/watch?v=rI2EBUEMfTk