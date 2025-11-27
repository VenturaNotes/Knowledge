---
Source:
  - https://leetcode.com/problems/find-the-maximum-achievable-number/?envType=problem-list-v2&envId=v66iao7e
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def theMaximumAchievableX(self, num: int, t: int) -> int:
        test = abs(t)

        return num + test*2
```
## Source [^1]
- 
## References

[^1]: 