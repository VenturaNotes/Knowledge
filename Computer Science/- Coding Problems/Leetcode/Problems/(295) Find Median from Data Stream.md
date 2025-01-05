---
Source:
  - https://leetcode.com/problems/find-median-from-data-stream/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-23 at 9.22.48 PM.png]]
- Design a data structure that supports the two following operations
- Insert elements in-order
	- Worst case is that every single time we add an element, it will be $O(n)$
	- The .getMedian operation will always be $O(1)$ but how can we speed up the add operation?
- Will use a [[heap]] data structure for this
	- All elements in the small heap that we create will always be less than the number of elements in the large heap
	- Adding elements to a heap will always be a $O(logn)$ operation
	- Removing an element will always be $O(logn)$ 
	- Finding max heap and min heap is O(1)
	- Whichever heap is bigger (the small or larger one) is where we take the median from (since the number of elements would be odd at that point)
```python
class MedianFinder:

    def __init__(self):
        """
        initialize your data structure here
        """
        # two heaps, large, small, minheap, maxheap
        # heaps should be equal size
        self.small, self.large = [],[]
        
    def addNum(self, num: int) -> None:
        heapq.heappush(self.small, -1 * num)

        # make sure every num small is <= every num in large
        if (self.small and self.large and (-1 * self.small[0]) > self.large[0]):
            val = -1 * heapq.heappop(self.small)
            heapq.heappush(self.large, val)

        # uneven size?
        if len(self.small) > len(self.large) + 1:
            val = -1 * heapq.heappop(self.small)
            heapq.heappush(self.large, val)
        if len(self.large) > len(self.small) + 1:
            val = heapq.heappop(self.large)
            heapq.heappush(self.small, -1 * val)

    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return -1*self.small[0]
        if len(self.large) > len(self.small):
            return self.large[0]
        
        return (-1* self.small[0] + self.large[0]) / 2
        
        
```
## Source[^2]
### (1) Sorting
```python
class MedianFinder:

    def __init__(self):
        self.data = []

    def addNum(self, num: int) -> None:
        self.data.append(num)

    def findMedian(self) -> float:
        self.data.sort()
        n = len(self.data)
        return (self.data[n // 2] if (n & 1) else 
                (self.data[n // 2] + self.data[n // 2 - 1]) / 2)
```
Time Complexity: $O(m)$ for $addNum()$, $O(m*nlogn)$ for $findMedian()$.
Space Complexity: $O(n)$
- Where $m$ is the number of function calls and $n$ is the length of the array.
### (2) Heap
```python
class MedianFinder:
    def __init__(self):
        # two heaps, large, small, minheap, maxheap
        # heaps should be equal size
        self.small, self.large = [], []  

    def addNum(self, num: int) -> None:
        if self.large and num > self.large[0]:
            heapq.heappush(self.large, num)
        else:
            heapq.heappush(self.small, -1 * num)

        if len(self.small) > len(self.large) + 1:
            val = -1 * heapq.heappop(self.small)
            heapq.heappush(self.large, val)
        if len(self.large) > len(self.small) + 1:
            val = heapq.heappop(self.large)
            heapq.heappush(self.small, -1 * val)

    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return -1 * self.small[0]
        elif len(self.large) > len(self.small):
            return self.large[0]
        return (-1 * self.small[0] + self.large[0]) / 2.0
```
Time Complexity: $O(m*logn)$ for $addNum()$, $O(m)$ for $findMedian()$
Space Complexity: $O(n)$
- Where $m$ is the number of function calls and $n$ is the length of the array.
## References

[^1]: https://www.youtube.com/watch?v=itmhHWaHupI
[^2]: https://neetcode.io/solutions/find-median-from-data-stream