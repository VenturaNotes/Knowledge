---
Source:
  - https://leetcode.com/problems/neither-minimum-nor-maximum/description/
Approaches: "1"
---
## Approach 1
```python
class Solution:
    def findNonMinOrMax(self, nums: List[int]) -> int:
        if len(nums) > 2:
            for i in nums:
                if i != min(nums) and i != max(nums):
                    return i
        else:
            return -1
        return -1
```
- This solution checks if the length of the list is greater than 2.
	- True
		- Check each value in the array, and as long as it's not equal to the minimum or maximum, return that value. 
	- False
		- A list length of 2 or less makes it impossible for there to be a value that is not the minimum or maximum