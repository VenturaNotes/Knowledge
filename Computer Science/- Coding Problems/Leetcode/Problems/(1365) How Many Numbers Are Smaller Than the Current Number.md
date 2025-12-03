---
Source:
  - https://leetcode.com/problems/how-many-numbers-are-smaller-than-the-current-number/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def smallerNumbersThanCurrent(self, nums: List[int]) -> List[int]:
        count = [0] * len(nums)

        for i in range(len(nums)):
            for j in range(len(nums)):
                if i != j:
                    if nums[i] > nums[j]:
                        count[i] += 1
        return count
```
## Source [^1]
- 
## References

[^1]: 