---
Source:
  - https://leetcode.com/problems/calculate-delayed-arrival-time
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def findDelayedArrivalTime(self, arrivalTime: int, delayedTime: int) -> int:
        return (arrivalTime + delayedTime) % 24
```
## Source [^1]
- 
## References

[^1]: 