---
Source:
  - https://leetcode.com/problems/meeting-rooms/description/
Approaches: "0"
---
## Synthesis
- Locked on LeetCode
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
## Source[^2]
### (1) Brute Force
```python
"""
Definition of Interval:
class Interval(object):
    def __init__(self, start, end):
        self.start = start
        self.end = end
"""

class Solution:
    def canAttendMeetings(self, intervals: List[Interval]) -> bool:
        n = len(intervals)
        for i in range(n):
            A = intervals[i]
            for j in range(i + 1, n):
                B = intervals[j]
                if min(A.end, B.end) > max(A.start, B.start):
                    return False
        return True
```
Time Complexity: $O(n^2)$
Space Complexity: $O(1)$
### (2) Sorting
```python
"""
Definition of Interval:
class Interval(object):
    def __init__(self, start, end):
        self.start = start
        self.end = end
"""

class Solution:
    def canAttendMeetings(self, intervals: List[Interval]) -> bool:
        intervals.sort(key=lambda i: i.start)

        for i in range(1, len(intervals)):
            i1 = intervals[i - 1]
            i2 = intervals[i]

            if i1.end > i2.start:
                return False
        return True
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(1)$ or $O(n)$ depending on the sorting algorithm.
## References

[^1]: [Meeting Rooms - Leetcode 252 - Python](https://www.youtube.com/watch?v=PaJxqZVPhbg)
[^2]: https://neetcode.io/solutions/meeting-rooms