---
Source:
  - https://leetcode.com/problems/left-and-right-sum-differences/description/
tags:
  - leetcode/solved
---
## Synthesis
### My Solution
```python
class Solution:
    def leftRightDifference(self, nums: List[int]) -> List[int]:
        leftSum = []
        rightSum = []
        result = []
        for i in range(len(nums)):
            if i == 0:
                leftSum.append(0)
                rightSum.append(0)
            else:
                leftSum.append(leftSum[-1] + nums[i-1])
                rightSum.insert(0, nums[len(nums)-i]+rightSum[0])
        for i in range(len(nums)):
            result.append(abs(leftSum[i] - rightSum[i]))
        return result
```
## Source [^1]
- 
## References

[^1]: 