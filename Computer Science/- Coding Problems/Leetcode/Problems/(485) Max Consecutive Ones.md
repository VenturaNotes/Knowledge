---
Source:
  - https://leetcode.com/problems/max-consecutive-ones/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def findMaxConsecutiveOnes(self, nums: List[int]) -> int:
        maximum = 0
        consecutive = 0
        for i in nums:
            if i == 1:
                consecutive +=1
                if consecutive > maximum:
                    maximum = consecutive
            else:
                consecutive = 0
        return maximum
```
## Source [^1]
- 
## References

[^1]: 