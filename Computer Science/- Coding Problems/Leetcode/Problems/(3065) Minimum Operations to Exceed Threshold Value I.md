---
Source:
  - https://leetcode.com/problems/minimum-operations-to-exceed-threshold-value-i/description/?envType=problem-list-v2&envId=v66iao7e
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def minOperations(self, nums: List[int], k: int) -> int:
        count = 0
        for i in nums:
            if i < k:
                count+=1
        return count
```
## Source [^1]
- 
## References

[^1]: 