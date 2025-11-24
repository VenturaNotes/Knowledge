---
Source:
  - https://leetcode.com/problems/final-value-of-variable-after-performing-operations/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def finalValueAfterOperations(self, operations: List[str]) -> int:
        value = 0
        for i in operations:
            if '-' in i:
                value -= 1
            else:
                value+=1
        return value
```
## Source [^1]
- 
## References

[^1]: 