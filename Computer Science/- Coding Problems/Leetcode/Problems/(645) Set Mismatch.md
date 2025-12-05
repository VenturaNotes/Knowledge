---
Source:
  - https://leetcode.com/problems/set-mismatch/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def findErrorNums(self, nums: List[int]) -> List[int]:
        my_set = set()

        not_in_set = 0
        duplicate = 0

        for i in range(1,len(nums)+1):
            if i not in nums:
                not_in_set = i
        for i in nums:
            if i in my_set:
                duplicate = i
            else:
                my_set.add(i)
        return[duplicate,not_in_set]
```
## Source [^1]
- 
## References

[^1]: 