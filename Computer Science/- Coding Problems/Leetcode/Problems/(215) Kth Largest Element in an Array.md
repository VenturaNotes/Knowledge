---
Source:
  - https://leetcode.com/problems/kth-largest-element-in-an-array/
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
## References

[^1]: https://www.youtube.com/watch?v=XEmy13g1Qxc