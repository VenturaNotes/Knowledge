---
Source:
  - https://leetcode.com/problems/compute-alternating-sum/description
tags:
  - leetcode/solved
---
## Synthesis
### My Solution
```python
class Solution:
    def alternatingSum(self, nums: List[int]) -> int:
        sum = 0
        for i in range(len(nums)):
            # Even
            if i % 2 == 0:
                sum += nums[i]
            else:
                sum -= nums[i]
        return sum
'''
Subtract, add, subtract, add...
'''
```
## Source [^1]
- 
## References

[^1]: 