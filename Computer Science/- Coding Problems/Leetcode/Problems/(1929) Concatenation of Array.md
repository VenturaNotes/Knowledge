---
Source:
  - https://leetcode.com/problems/concatenation-of-array/
Reviewed: false
Approaches: "1"
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