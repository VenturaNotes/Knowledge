---
Source:
  - https://leetcode.com/problems/find-the-highest-altitude/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def largestAltitude(self, gain: List[int]) -> int:
        count = 0
        maximum = 0
        for i in gain:
            count += i
            if maximum < count:
                maximum = count
        return maximum
```
## Source [^1]
- 
## References

[^1]: 