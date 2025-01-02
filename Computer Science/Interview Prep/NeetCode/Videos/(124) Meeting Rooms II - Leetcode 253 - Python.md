---
Source:
  - https://www.youtube.com/watch?v=FdzJmTCVyJU
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-30 at 2.26.26 AM.png]]
- Find the minimum number of conference rooms required
- Time complexity:  $O(nlogn)$
- Memory complexity: $O(n)$ 
```python
"""
Definition of Interval:
class Interval(object):
    def __init__(self, start, end):
        self.start = start
        self.end = end
"""

class Solution:
    """
    @param intervals: an array of meeting time intervals
    @return: the minimum number of conference rooms required
    """
    def minMeetingRooms(self, intervals: List[Interval]) -> int:
        start = sorted([i.start for i in intervals])
        end = sorted([i.end for i in intervals])

        res, count = 0, 0
        s, e = 0, 0
        while s < len(intervals):
            if start[s] < end[e]:
                s += 1
                count += 1
            else:
                e += 1
                count -= 1
            res = max(res, count)
        return res
        
```
## References

[^1]: https://www.youtube.com/watch?v=FdzJmTCVyJU