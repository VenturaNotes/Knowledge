---
Source:
  - https://leetcode.com/problems/running-sum-of-1d-array/
Reviewed: false
---
## Synthesis
### My Solution
```python
class Solution:
    def runningSum(self, nums: List[int]) -> List[int]:
        sums = []
        for i in range(len(nums)):
            if i == 0:
                sums.append(nums[i])
            else:
                sums.append(sums[i-1]+nums[i])
        return sums
```
## Source [^1]
- 
## References

[^1]: 