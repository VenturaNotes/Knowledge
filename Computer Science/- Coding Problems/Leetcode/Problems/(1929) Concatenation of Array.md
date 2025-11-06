---
Source:
  - https://leetcode.com/problems/concatenation-of-array/
Reviewed: false
tags:
  - leetcode/solved
---
## Synthesis
### My Solution
```python
class Solution:
    def getConcatenation(self, nums: List[int]) -> List[int]:
        nums.extend(nums)
        return nums
```
## Source [^1]
- 
## References

[^1]: 