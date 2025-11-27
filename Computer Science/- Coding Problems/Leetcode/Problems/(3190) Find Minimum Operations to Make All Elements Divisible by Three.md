---
Source:
  - https://leetcode.com/problems/find-minimum-operations-to-make-all-elements-divisible-by-three/description/?envType=problem-list-v2&envId=v66iao7e
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def minimumOperations(self, nums: List[int]) -> int:
        my_sum = 0
        for i in nums:
            if i % 3 != 0:
                my_sum += 1
        return my_sum

"""
0 (no change needed)
1 (subtract 1)
2 (add 1)
3 (no change needed)

If n % 3 = 0, then no change needed
If n % 3 = 1, Then
"""
```
## Source [^1]
- 
## References

[^1]: 