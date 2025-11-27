---
Source:
  - https://leetcode.com/problems/count-asterisks/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def countAsterisks(self, s: str) -> int:
        count = 0
        count2 = 0
        for i in s:
            if i == "|":
                count += 1
                continue
            if count % 2 == 0:
                if i == '*':
                    count2 += 1
        return count2
```
## Source [^1]
- 
## References

[^1]: 