---
Source:
  - https://leetcode.com/problems/last-stone-weight/
Reviewed: false
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
## Source[^2]
### (1) Sorting
```python
class Solution:
    def lastStoneWeight(self, stones: List[int]) -> int:
        
        while len(stones) > 1:
            stones.sort()
            cur = stones.pop() - stones.pop()
            if cur:
                stones.append(cur)
                
        return stones[0] if stones else 0
```
Time Complexity: $O(n^2logn)$
Space Complexity: $O(1)$ or $O(n)$ depending on the sorting algorithm
### (2) Binary Search
```python
class Solution:
    def lastStoneWeight(self, stones: List[int]) -> int:
        stones.sort()
        n = len(stones)

        while n > 1:
            cur = stones.pop() - stones.pop()
            n -= 2
            if cur > 0:
                l, r = 0, n
                while l < r:
                    mid = (l + r) // 2
                    if stones[mid] < cur:
                        l = mid + 1
                    else:
                        r = mid
                pos = l
                n += 1
                stones.append(0)
                for i in range(n - 1, pos, -1):
                    stones[i] = stones[i - 1]
                stones[pos] = cur

        return stones[0] if n > 0 else 0
```
Time Complexity: $O(n^2)$
Space Complexity: $O(1)$ or $O(n)$ depending on the sorting algorithm
### (3) Heap
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
Time Complexity: $O(nlogn)$
Space Complexity: $O(n)$

### (4) Bucket Sort
```python
class Solution:
    def lastStoneWeight(self, stones: List[int]) -> int:

        maxStone = max(stones)
        bucket = [0] * (maxStone + 1)
        for stone in stones:
            bucket[stone] += 1
        
        first = second = maxStone
        while first > 0:
            if bucket[first] % 2 == 0:
                first -= 1
                continue
            
            j = min(first - 1, second)
            while j > 0 and bucket[j] == 0:
                j -= 1
            
            if j == 0:
                return first
            second = j
            bucket[first] -= 1
            bucket[second] -= 1
            bucket[first - second] += 1
            first = max(first - second, second)
        return first
```
Time Complexity: $O(n+w)$
Space Complexity: $O(w)$
- Where $n$ is the length of the $stones$ array and $w$ is the maximum value in the $stones$ array.
## References

[^1]: https://www.youtube.com/watch?v=B-QCq79-Vfw
[^2]: https://neetcode.io/solutions/last-stone-weight