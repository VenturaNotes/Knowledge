---
Source:
  - https://leetcode.com/problems/divisible-and-non-divisible-sums-difference/description/?envType=problem-list-v2&envId=v66iao7e
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def differenceOfSums(self, n: int, m: int) -> int:
        sum1 = 0
        sum2 = 0
        for i in range(1, n+1):
            if i % m != 0:
                sum1+=i
            else:
                sum2 += i
        return sum1 - sum2


```
## Source [^1]
- 
## References

[^1]: 