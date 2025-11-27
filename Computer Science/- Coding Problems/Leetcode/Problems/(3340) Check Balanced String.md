---
Source:
  - https://leetcode.com/problems/check-balanced-string/description/?envType=problem-list-v2&envId=v66iao7e
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def isBalanced(self, num: str) -> bool:
        odd = 0
        even = 0
        for i in range(len(num)):
            if i % 2 == 0:
                even += int(num[i])
            else:
                odd += int(num[i])
        return odd == even
```
- #question Is it faster to cast each individual character or the entire string at once and loop through it like a string or list?
## Source [^1]
- 
## References

[^1]: 