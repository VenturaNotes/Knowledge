---
Source:
  - https://leetcode.com/problems/merge-intervals/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-29 at 10.03.48 PM.png|400]]
- Given two intervals `[1,4]` and `[4, 5]`, they're considered overlapping
- Mainly start values are important so we'll sort by start values
```python
class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        # O(nLogn)
        intervals.sort(key = lambda i : i[0])
        output = [intervals[0]]

        for start, end in intervals[1:]:
            lastEnd = output[-1][1]

            if start <= lastEnd:
                output[-1][1] = max(lastEnd, end)
            else:
                output.append([start, end])
        return output

```
## References

[^1]: https://www.youtube.com/watch?v=44H3cEC2fFM