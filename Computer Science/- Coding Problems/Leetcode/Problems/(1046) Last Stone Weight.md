---
Source:
  - https://leetcode.com/problems/last-stone-weight/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-22 at 12.53.06 AM.png|400]]
- Will use [[max heap]] for this
	- Taking the max stones each iteration
	- To take input array and transform into max heap is O(n) time operation with the heapify function
		- But to get the maximum, it will be a $nlog(n)$ operation which will be the overall time complexity of the solution
- [[python]] does not have max heaps
	- So we'll have to use a min heap to simulate a max heap
	- We'll multiply every value in the heap by `-1` so that the minimum will be negative (although technically the maximum)
```python
class Solution:
    def lastStoneWeight(self, stones: List[int]) -> int:
        stones = [-s for s in stones]
        heapq.heapify(stones)

        while len(stones) > 1:
            first = heapq.heappop(stones)
            second = heapq.heappop(stones)
            if second > first:
                heapq.heappush(stones, first - second)
        stones.append(0)
        return abs(stones[0])

```
## References

[^1]: https://www.youtube.com/watch?v=B-QCq79-Vfw