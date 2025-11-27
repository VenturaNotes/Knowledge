---
Source:
  - https://leetcode.com/problems/subtract-the-product-and-sum-of-digits-of-an-integer/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def subtractProductAndSum(self, n: int) -> int:
        my_product = 1
        my_sum = 0

        for i in str(n):
            my_product *= int(i)
            my_sum+=int(i)
        return my_product - my_sum
```
## Source [^1]
- 
## References

[^1]: 