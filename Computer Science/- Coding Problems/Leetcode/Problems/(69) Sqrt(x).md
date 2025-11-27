---
Source:
  - https://leetcode.com/problems/sqrtx/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def mySqrt(self, x: int) -> int:
        left = 0
        right = x

        my_set = set()
        while True:
            if x == 0:
                return 0
            center = (left + right) // 2
            if center*center >= x:
                right = center
            else:
                left = center
            if right - left == 1:
                if right*right == x:
                    return right
                else:
                    return left
                    # Automatically finds floor of number

"""
So since this problem is tagged binary search, 
we just split the problem in half until we find
the solution of what they're looking for

Not allowed to use built-in exponent function or operator.
We probably just keep finding the differnces until they 
are between two integers. Then just find the difference. 

So range starts from 0 to 4
First you center centerr. 4/2. If it equals 

Instead of division, you just need to find the centerr-point value

Could check if the answer is within 0.9
"""
```
## Source [^1]
- 
## References

[^1]: 