---
Source:
  - https://leetcode.com/problems/find-closest-person/?envType=problem-list-v2&envId=v66iao7e
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def findClosest(self, x: int, y: int, z: int) -> int:
        if abs(z-x) > abs(z-y):
            return 2
        elif abs(z-y) > abs(z-x):
            return 1
        else:
            return 0
```
## Source [^1]
- 
## References

[^1]: 