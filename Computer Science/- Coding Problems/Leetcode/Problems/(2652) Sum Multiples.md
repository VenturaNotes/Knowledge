---
Source:
  - https://leetcode.com/problems/sum-multiples/description/?envType=problem-list-v2&envId=v66iao7e
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def sumOfMultiples(self, n: int) -> int:
        my_sum = 0
        for i in range(1, n+1):
            if i % 3 == 0 or i % 5 == 0 or i % 7 == 0:
                my_sum += i
        return my_sum
```
## Source [^1]
- 
## References

[^1]: 