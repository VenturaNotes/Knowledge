---
Source:
  - https://leetcode.com/problems/insert-interval/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-29 at 9.57.14 PM.png]]
- Time and space complexity is $O(n)$
```python
class Solution:
    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
        res = []

        for i in range(len(intervals)):
            if newInterval[1] < intervals[i][0]:
                res.append(newInterval)
                return res + intervals[i:]
            elif newInterval[0] > intervals[i][1]:
                res.append(intervals[i])
            else:
                newInterval = [min(newInterval[0], intervals[i][0]),max(newInterval[1],intervals[i][1])]

        res.append(newInterval)
        return res
```
## References

[^1]: https://www.youtube.com/watch?v=A8NUOmlwOlM