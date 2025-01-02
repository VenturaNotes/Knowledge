---
Source:
  - https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-10-20 at 11.02.39 PM.png]]
- We want to return the minimum element in an array in $O(logn)$ time.
- The elements in the array are sorted in ascending order but they may have been rotated between 1 and `n` times.
- Will use [[binary search]] algorithm which runs in $O(logn)$ time
- We could find the pivot where the elements are not in increasing order.
- If we're at a value that's in the right sorted portion, then we want to search the left.
- If middle pointer in right sorted portion, search left. Otherwise if in left sorted portion, we want to search to the right
```python
class Solution:
    def findMin(self, nums: List[int]) -> int:
        # Set result to first value of array
        res = nums[0]
		# Set left pointer to first index of array
		# Set right pointer to last index of array
        l, r = 0, len(nums) - 1

        while l <= r:
		    #If left pointer value is less than right pointer value
		    #res wil be the minimum of the left pointer value
            if nums[l] < nums[r]:
                res = min(res, nums[l])
                break

			# Using binary search here
			# If middle value is larger than left value,
			# Then we just search the right half 
			# If middle value is less than left value
			# Then we search the left half
            m = (l + r) // 2
            res = min(res, nums[m])
            if nums[m] >= nums[l]:
                l = m + 1
            else:
                r = m -1
        return res
```
## References

[^1]: https://www.youtube.com/watch?v=nIVW4P8b1VA