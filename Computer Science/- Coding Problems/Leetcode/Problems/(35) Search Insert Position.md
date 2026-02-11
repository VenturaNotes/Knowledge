---
Source:
  - https://leetcode.com/problems/search-insert-position/
Reviewed: false
Approaches: "1"
---
## Synthesis
### Brute Force Solution
```python
class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        
        for i in range(len(nums)):
            if nums[i] == target:
                return i
            elif nums[i] > target:
                return i
        return len(nums)
```
- Efficiency
	- Time Complexity: O(n)
	- Auxiliary Space: O(1)
		- Since no new memory was saved
- Explanation
	- I iterate through the array. If the target equals an element in the array, I know that's where the index is. If the target is less than element in the array, this means the target must occupy that index. If the target is greater than all elements within the array, it must occupy the last index + 1.
### Faster Solution
- A faster solution since there are no repeats and the list is already sorted with the integers would be to find half the dataset and onwards.
- It probably matters if it's even or odd?
	- So even solution and then an odd solution
## Source [^1]
### Optimized Solution
```python
class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        left = 0
        right = len(nums) - 1

        while left <= right:
            mid = (left + right) // 2

            if nums[mid] == target:
                return mid
            elif nums[mid] > target:
                right = mid - 1
            else:
                left = mid + 1

        return left
```
- Time Complexity: $O(logn)$
- Space Complexity: $O(1)$ 
- The question should be solved with [[binary search]]
	- #comment 
		- It seems like binary search can work for both even and odd lists
		- So quick description
			- Always calculate mid each rotation
			- If mid equals target, return mid
			- If mid greater than target, right is mid - 1
			- If mid less than target, left is mid + 1
			- If left > right, then break loop and return left.
		- #question Is there a way so that I could potentially return the "right" side? Does this only work in terms of "right" because we're trying to find a greater number? 
		- ![[Screenshot 2025-10-07 at 2.19.30 AM.png]]
			- Binary Search with target found in list

## Source[^2]
- 
## References

[^1]: https://leetcode.com/problems/search-insert-position/solutions/5361984/video-return-middle-or-left-pointer/
[^2]: [Search Insert Position - Binary Search - Leetcode 35 - Python](https://www.youtube.com/watch?v=K-RYzDZkzCI)