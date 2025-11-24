---
Source:
  - https://leetcode.com/problems/height-checker/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def heightChecker(self, heights: List[int]) -> int:
        test = list(heights)
        heights.sort()
        count = 0

        for i in range(len(test)):
            if test[i] != heights[i]:
                count+= 1
        return count
```
## Source [^1]
- 
## References

[^1]: 