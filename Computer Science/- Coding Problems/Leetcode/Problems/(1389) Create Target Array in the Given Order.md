---
Source:
  - https://leetcode.com/problems/create-target-array-in-the-given-order/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def createTargetArray(self, nums: List[int], index: List[int]) -> List[int]:
        target = []

        for i in range(len(nums)):
            target.insert(index[i], nums[i])
        return target
```
## Source [^1]
- 
## References

[^1]: 