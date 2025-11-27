---
Source:
  - https://leetcode.com/problems/convert-the-temperature/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def convertTemperature(self, celsius: float) -> List[float]:
        my_list = [0,0]

        my_list[0] = celsius + 273.15
        my_list[1] = celsius * 1.80 + 32.00

        return my_list
```
## Source [^1]
- 
## References

[^1]: 