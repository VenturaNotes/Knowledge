---
Source:
  - https://leetcode.com/problems/find-missing-elements/description/
tags:
  - leetcode/solved
---
## Synthesis
### My Solution
```python
class Solution:
    def findMissingElements(self, nums: List[int]) -> List[int]:
        nums.sort()
        missing = []
        minimum = min(nums)
        maximum = max(nums)

        while maximum > minimum:
            if minimum + 1 not in nums:
                missing.append(minimum+1)
            minimum+= 1
        return missing
```
## Source [^1]
- 
## References

[^1]: 