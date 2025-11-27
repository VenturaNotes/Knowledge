---
Source:
  - https://leetcode.com/problems/transform-array-by-parity/description/?envType=problem-list-v2&envId=v66iao7e
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def transformArray(self, nums: List[int]) -> List[int]:
        even = []
        odd = []
        for i in nums:
            if i % 2 == 0:
                even.append(0)
            else:
                odd.append(1)
        
        return even + odd
```
## Source [^1]
- 
## References

[^1]: 