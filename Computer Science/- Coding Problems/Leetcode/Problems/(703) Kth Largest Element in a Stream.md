---
Source:
  - https://leetcode.com/problems/kth-largest-element-in-a-stream/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-22 at 12.46.44 AM.png]]
- Stream basically means we continue to add numbers to the list of numbers
- We want to return the `kth` largest element in sorted order
- We will use a [[min heap]] of size k
	- A [[heap]] is a data structure that has a somewhat sorted property
		- We can add and pop elements from the min heap in log(n) time
		- We can also get the minimum value of the heap in O(1) time
	- We can run the add function in $mlogn$ time where m is the number of times we run $logn$ 
	- In terms of constructor function, generating heap is potentially $nlogn$ in the worst case 
		- We have $(n-k)logn$ or worst case $O(nlogn)$ for constructor
```python
class KthLargest:

    def __init__(self, k: int, nums: List[int]):
        self.minHeap, self.k = nums, k
        heapq.heapify(self.minHeap)
        while len(self.minHeap) > k:
            heapq.heappop(self.minHeap)

    def add(self, val: int) -> int:
        heapq.heappush(self.minHeap, val)
        if len(self.minHeap) > self.k:
            heapq.heappop(self.minHeap)
        return self.minHeap[0]

```
## Source[^2]
### (1) Sorting
```python
class KthLargest:

    def __init__(self, k: int, nums: List[int]):
        self.k = k
        self.arr = nums

    def add(self, val: int) -> int:
        self.arr.append(val)
        self.arr.sort()
        return self.arr[len(self.arr) - self.k]
```
Time Complexity: $O(m*nlogn)$
Space Complexity: $O(1)$ or $O(n)$ depending on the sorting algorithm
- Where $m$ is the number of calls made to $add()$ and $n$ is the current size of the array.
### (2) Min-Heap
```python
class KthLargest:
    
    def __init__(self, k: int, nums: List[int]):
        self.minHeap, self.k = nums, k
        heapq.heapify(self.minHeap)
        while len(self.minHeap) > k:
            heapq.heappop(self.minHeap)

    def add(self, val: int) -> int:
        heapq.heappush(self.minHeap, val)
        if len(self.minHeap) > self.k:
            heapq.heappop(self.minHeap)
        return self.minHeap[0]
```
Time Complexity: $O(m*logk)$
Space Complexity: $O(k)$
- Where $m$ is the number of calls made to $add()$


## References

[^1]: https://www.youtube.com/watch?v=hOjcdrqMoQ8
[^2]: https://neetcode.io/solutions/kth-largest-element-in-a-stream