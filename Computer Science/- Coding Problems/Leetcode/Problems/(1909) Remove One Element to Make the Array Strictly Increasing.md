---
Source:
  - https://leetcode.com/problems/remove-one-element-to-make-the-array-strictly-increasing/
Reviewed: false
tags:
  - leetcode/solved
---
## Synthesis
### My Solution
```python
class Solution:
    def canBeIncreasing(self, nums: List[int]) -> bool:
        if len(nums) == 2:
            return True
        mycopy = list(nums)
        for i in range(len(nums)):
            del mycopy[i]
            for j in range(len(mycopy)-1):
                if mycopy[j] >= mycopy[j+1]:
                    break
                if j == len(mycopy)-2:
                    return True
            mycopy = list(nums)
        return False
```
## Source [^1]
- 
## References

[^1]: 