---
Source:
  - https://leetcode.com/problems/first-missing-positive/
Reviewed: false
tags:
  - in-progress
---
## Synthesis
- 
## Source [^1]
```python
class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        n = len(nums)

        # Correct slot:
        # nums[i] = i + 1
        # nums[i] - 1 = i
        # nums[nums[i] - 1] = nums[i]
        for i in range(n):
            while nums[i] > 0 and nums[i] <= n and nums[nums[i] - 1] != nums[i]:
                nums[nums[i] - 1], nums[i] = nums[i], nums[nums[i] - 1]
        
        for i, num in enumerate(nums):
            if num != i + 1:
                return i + 1
        
        return n + 1
```
Time: $O(n)$
Space: $O(1)$
## References

[^1]: https://walkccc.me/LeetCode/problems/41/?h=41#__tabbed_1_3