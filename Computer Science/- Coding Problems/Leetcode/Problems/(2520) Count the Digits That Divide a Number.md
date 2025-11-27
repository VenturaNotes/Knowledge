---
Source:
  - https://leetcode.com/problems/count-the-digits-that-divide-a-number/?envType=problem-list-v2&envId=v66iao7e
Approaches: "1"
---
## Synthesis
```python
class Solution:
    def countDigits(self, num: int) -> int:
        add = 0
        for i in str(num):
            if num % int(i) == 0:
                add+=1
        return add
```
## Source [^1]
- 
## References

[^1]: 