---
Source:
  - https://leetcode.com/problems/reverse-degree-of-a-string/description/?envType=problem-list-v2&envId=v66iao7e
Approaches: "1"
---
## Synthesis
```python
class Solution:
    def reverseDegree(self, s: str) -> int:
        count = 0
        for i in range(len(s)):
            count += (ord(s[i])*-1+123) *(i+1)

            print(i+1)
        return count
"""
Keep in mind it's 1-indexed
"""
```
## Source [^1]
- 
## References

[^1]: 