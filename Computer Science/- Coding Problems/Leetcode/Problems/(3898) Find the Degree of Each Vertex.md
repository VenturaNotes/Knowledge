---
Source:
  - https://leetcode.com/problems/find-the-degree-of-each-vertex/description/
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def findDegrees(self, matrix: list[list[int]]) -> list[int]:
        test = []
        for i in matrix: 
            test.append(sum(i))
        return(test)
```