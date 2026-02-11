---
Source:
  - https://leetcode.com/problems/kth-largest-element-in-an-array/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-22 at 1.10.22 AM.png]]
- Can use [[max heap]]
	- Can turn it into a heap in O(n)
		- Then need to pop k times which will give time complexity $n + klogn$ 
- There is a solution better though for the average case time complexity
	- Average time complexity is $O(n)$ but worst case would be $O(n^2)$ 
- We care about [[quick select]] algorithm
```python
class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        k = len(nums) - k

        def quickSelect(l, r):
            pivot, p = nums[r], l
            for i in range(l, r):
                if nums[i] <= pivot:
                    nums[p], nums[i] = nums[i], nums[p]
                    p += 1
            nums[p], nums[r] = nums[r], nums[p]

            if p > k: return quickSelect(l, p - 1)
            elif p < k: return quickSelect(p + 1, r)
            else: return nums[p]
        return quickSelect(0, len(nums) - 1)

```
- On average, this does beat the sorting approach below
```python
class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        nums.sort()
        return nums[len(nums) - k]
```
## Source[^2]
### (1) Sorting
```python
class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        nums.sort()
        return nums[len(nums) - k]
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(1)$ or $O(n)$ depending on the sorting algorithm
### (2) Min-Heap
```python
class Solution:
    def findKthLargest(self, nums, k):
        return heapq.nlargest(k, nums)[-1]
```
Time Complexity: $O(nlogk)$
Space Complexity: $O(k)$
- Where $n$ is the length of the array $nums.$ 
### (3) Quick Select
```python
class Solution:

    def findKthLargest(self, nums: List[int], k: int) -> int:
        k = len(nums) - k
        
        def quickSelect(l, r):
            pivot, p = nums[r], l
            for i in range(l, r):
                if nums[i] <= pivot:
                    nums[p], nums[i] = nums[i], nums[p]
                    p += 1
            nums[p], nums[r] = nums[r], nums[p]

            if p > k: 
                return quickSelect(l, p - 1)
            elif p < k:
                return quickSelect(p + 1, r)
            else:
                return nums[p]

        return quickSelect(0, len(nums) - 1)
```
Time Complexity: $O(n)$ in average case, $O(n^2)$ in worst case.
Space Complexity: $O(n)$
### (4) Quick Select (Optimal)
```python
class Solution:
    def partition(self, nums: List[int], left: int, right: int) -> int:
        mid = (left + right) >> 1
        nums[mid], nums[left + 1] = nums[left + 1], nums[mid]
        
        if nums[left] < nums[right]:
            nums[left], nums[right] = nums[right], nums[left]
        if nums[left + 1] < nums[right]:
            nums[left + 1], nums[right] = nums[right], nums[left + 1]
        if nums[left] < nums[left + 1]:
            nums[left], nums[left + 1] = nums[left + 1], nums[left]
        
        pivot = nums[left + 1]
        i = left + 1
        j = right
        
        while True:
            while True:
                i += 1
                if not nums[i] > pivot:
                    break
            while True:
                j -= 1
                if not nums[j] < pivot:
                    break
            if i > j:
                break
            nums[i], nums[j] = nums[j], nums[i]
        
        nums[left + 1], nums[j] = nums[j], nums[left + 1]
        return j
    
    def quickSelect(self, nums: List[int], k: int) -> int:
        left = 0
        right = len(nums) - 1
        
        while True:
            if right <= left + 1:
                if right == left + 1 and nums[right] > nums[left]:
                    nums[left], nums[right] = nums[right], nums[left]
                return nums[k]
            
            j = self.partition(nums, left, right)
            
            if j >= k:
                right = j - 1
            if j <= k:
                left = j + 1
    
    def findKthLargest(self, nums: List[int], k: int) -> int:
        return self.quickSelect(nums, k - 1)
```
Time Complexity: $O(n)$ in average case, $O(n^2)$ in worst case.
Space Complexity: $O(1)$
## References

[^1]: [Kth Largest Element in an Array - Quick Select - Leetcode 215 - Python](https://www.youtube.com/watch?v=XEmy13g1Qxc)
[^2]: https://neetcode.io/solutions/kth-largest-element-in-an-array