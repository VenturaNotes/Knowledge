---
Source:
  - https://leetcode.com/problems/alternating-groups-i/description/
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def numberOfAlternatingGroups(self, colors: List[int]) -> int:
        
        groups = 0
        for i in range(len(colors)):
            if i == 0:
                if colors[i] != colors[-1] and colors[i] != colors[i+1]:
                    groups += 1
            elif i == len(colors)-1:
                if colors[i] != colors[0] and colors[i] != colors[i-1]:
                    groups += 1
            else:
                if colors[i] != colors[i-1] and colors[i] != colors[i+1]:
                    groups+=1
        return groups
            
"""
colors[i]: Represents color of tile
    `colors[i] == 0` is red tile
    `colors[i] == 0` is blue tlie

You need red -> blue -> red to be considered contiguous
You need blue -> red -> blue to be considered contiguous
"""
```
## Source [^1]
- 
## References

[^1]: 