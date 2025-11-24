---
Source:
  - https://leetcode.com/problems/the-two-sneaky-numbers-of-digitville/description
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def getSneakyNumbers(self, nums: List[int]) -> List[int]:
        my_set = set()
        tracked = []

        for i in nums:
            if i not in my_set:
                my_set.add(i)
            else:
                tracked.append(i)
        return tracked
```
## Source [^1]
- 
## References

[^1]: 