---
Source:
  - https://leetcode.com/problems/find-indices-of-stable-mountains/
tags:
  - leetcode/solved
---
## Synthesis
### My Solution
```python
class Solution:
    def stableMountains(self, height: List[int], threshold: int) -> List[int]:
        stable = []
        
        for i in range(len(height)):
            if i == 0:
                continue
            if height[i-1] > threshold:
                stable.append(i)
        return stable
```
- Just iterating through list and checking if index before is > than the threshold given
## Source [^1]
- 
## References

[^1]: 