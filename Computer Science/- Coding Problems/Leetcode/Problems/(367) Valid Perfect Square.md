---
Source:
  - https://leetcode.com/problems/valid-perfect-square/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def isPerfectSquare(self, num: int) -> bool:
        left = 0
        right = num

        ## Edge Cases
        if num == 0:
            return True
        if num == 1:
            return True

        while True:
            center = (left + right) // 2
            if center*center == num:
                return True
            if right - left == 1:
                return False
            elif center*center > num:
                right = center
            else:
                left = center
                
```
- Pretty similar to this problem [[(69) Sqrt(x)]]
## Source [^1]
- 
## References

[^1]: [Valid Perfect Square - Leetcode 367 - Python](https://www.youtube.com/watch?v=Cg_wWPHJ2Sk)