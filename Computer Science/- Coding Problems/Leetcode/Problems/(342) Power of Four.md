---
Source:
  - https://leetcode.com/problems/power-of-four/
Reviewed: false
Approaches: "1"
---
## Synthesis
```python
import math

class Solution:
    def isPowerOfFour(self, n: int) -> bool:
        if n <= 0:
            return False
        base4_log = math.log(n,4)
        return base4_log.is_integer()

""" Ideas
Maybe I could take a log instead?
Wait, I could just solve for x, right?

Need to solve n = 4^x
log_4n = x

Just convert exponential form to logaritmic form
Then need to check if it's a float or int. 
"""
```
## Source [^1]
- 
## References

[^1]: 