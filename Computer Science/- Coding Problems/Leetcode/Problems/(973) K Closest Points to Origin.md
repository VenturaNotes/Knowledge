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
## Source[^2]
### (1) Sorting
```python
class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        points.sort(key=lambda p: p[0]**2 + p[1]**2)
        return points[:k]
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(1)$ or $O(n)$ depending on the sorting algorithm
### (2) Min Heap
```python
class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        minHeap = []
        for x, y in points:
            dist = (x ** 2) + (y ** 2)
            minHeap.append([dist, x, y])
        
        heapq.heapify(minHeap)
        res = []
        while k > 0:
            dist, x, y = heapq.heappop(minHeap)
            res.append([x, y])
            k -= 1
            
        return res
```
Time Complexity: $O(k*logn)$
Space Complexity: $O(n)$
- Where $n$ is the length of the array $points.$ 
### (3) Max Heap
```python
class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        maxHeap = []
        for x, y in points:
            dist = -(x ** 2 + y ** 2)
            heapq.heappush(maxHeap, [dist, x, y])
            if len(maxHeap) > k:
                heapq.heappop(maxHeap)
        
        res = []
        while maxHeap:
            dist, x, y = heapq.heappop(maxHeap)
            res.append([x, y])
        return res
```
Time Complexity: $O(n*logk)$
Space Complexity: $O(k)$
- Where $n$ is the length of the array $points.$
### (4) Quick Select
```python
class Solution:
    def kClosest(self, points, k):
        euclidean = lambda x: x[0] ** 2 + x[1] ** 2
        def partition(l, r):
            pivotIdx = r
            pivotDist = euclidean(points[pivotIdx])
            i = l
            for j in range(l, r):
                if euclidean(points[j]) <= pivotDist:
                    points[i], points[j] = points[j], points[i]
                    i += 1
            points[i], points[r] = points[r], points[i]
            return i

        L, R = 0, len(points) - 1
        pivot = len(points)

        while pivot != k:
            pivot = partition(L, R)
            if pivot < k:
                L = pivot + 1
            else:
                R = pivot - 1
        return points[:k]
```
Time Complexity: $O(n)$ in average case, $O(n^2)$ in worst case
Space Complexity: $O(1)$
## References

[^1]: https://www.youtube.com/watch?v=rI2EBUEMfTk
[^2]: https://neetcode.io/solutions/k-closest-points-to-origin