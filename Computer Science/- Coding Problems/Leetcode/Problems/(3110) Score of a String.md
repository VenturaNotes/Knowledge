---
Source:
  - https://leetcode.com/problems/score-of-a-string/?envType=problem-list-v2&envId=v66iao7e
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def scoreOfString(self, s: str) -> int:
        i = 0
        j = 1
        sum = 0
        
        while j < len(s):
            sum += abs(ord(s[i]) - ord(s[j]))
            i+=1
            j+=1
        return sum
```
## Source [^1]
- 
## References

[^1]: 