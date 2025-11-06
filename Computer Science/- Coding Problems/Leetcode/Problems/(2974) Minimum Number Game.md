---
Source:
  - https://leetcode.com/problems/minimum-number-game/description/
tags:
  - leetcode/solved
---
## Synthesis
### My Solution
```python
class Solution:
    def numberGame(self, nums: List[int]) -> List[int]:
        lowest = []
        length = len(nums)

        for i in range(0, length, 2):
            minimum1 = min(nums)
            nums.remove(minimum1)
            minimum2 = min(nums)
            nums.remove(minimum2)
            lowest.append(minimum2)
            lowest.append(minimum1)
        return lowest
```
## Source [^1]
- 
## References

[^1]: 