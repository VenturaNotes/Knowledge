---
Source:
  - https://leetcode.com/problems/smallest-even-multiple/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def smallestEvenMultiple(self, n: int) -> int:
        if n % 2 == 0:
            return n
        if n % 2 == 1:
            return n*2
```
## Source [^1]
- 
## References

[^1]: 