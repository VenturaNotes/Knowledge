---
Source:
  - https://www.youtube.com/watch?v=PaJxqZVPhbg
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-30 at 2.21.01 AM.png]]
- LintCode lets you save premium leetcode problems for free
- The reason $(0,8)$ and $(8,10)$ is not overlapping is because someone could attend both of those meetings
- Sort meetings based on start time
- Overall time complexity is $O(nlogn)$ 
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
    @return: if a person could attend all meetings
    """
    def canAttendMeetings(self, intervals: List[Interval]) -> bool:
        intervals.sort(key = lambda i : i.start)

        for i in range(1, len(intervals)):
            i1 = intervals[i - 1]
            i2 = intervals[i]

            if i1.end > i2.start:
                return False
        return True
```
## References

[^1]: https://www.youtube.com/watch?v=PaJxqZVPhbg