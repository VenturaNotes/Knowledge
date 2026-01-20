---
Source:
  - https://leetcode.com/problems/earliest-time-to-finish-one-task/description/
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def earliestTime(self, tasks: List[List[int]]) -> int:
        
        minimum = -1
        for i in tasks:
            if minimum == -1:
                minimum = sum(i)
            elif minimum > sum(i):
                minimum = sum(i)
        return minimum
```
## Source [^1]
- 
## References

[^1]: 