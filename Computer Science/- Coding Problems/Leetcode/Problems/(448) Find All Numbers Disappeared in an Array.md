---
Source:
  - https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/
Reviewed: false
tags:
  - in-progress
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def findDisappearedNumbers(self, nums: List[int]) -> List[int]:
        my_nums = set(nums)
        ret = []

        for i in range(1, len(nums)+1):
            if i not in my_nums:
                ret.append(i)
        return ret
```
## Source [^1]
- 
## References

[^1]: [Find All Numbers Disappeared in an Array - Leetcode 448 - Python](https://www.youtube.com/watch?v=8i-f24YFWC4)