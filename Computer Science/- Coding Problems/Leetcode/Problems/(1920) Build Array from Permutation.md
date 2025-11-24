---
Source:
  - https://leetcode.com/problems/build-array-from-permutation/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def buildArray(self, nums: List[int]) -> List[int]:
        new_list = []

        for i in range(len(nums)):
            new_list.append(nums[nums[i]])
        return new_list
```
## Source [^1]
- 
## References

[^1]: 