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
## Source[^2]
### (1) Min Heap
```python
"""
Definition of Interval:
class Interval(object):
    def __init__(self, start, end):
        self.start = start
        self.end = end
"""

class Solution:
    def minMeetingRooms(self, intervals: List[Interval]) -> int:
        intervals.sort(key=lambda x: x.start)
        min_heap = []

        for interval in intervals:
            if min_heap and min_heap[0] <= interval.start:
                heapq.heappop(min_heap)
            heapq.heappush(min_heap, interval.end)

        return len(min_heap)
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(n)$
### (2) Sweep Line Algorithm
```python
"""
Definition of Interval:
class Interval(object):
    def __init__(self, start, end):
        self.start = start
        self.end = end
"""

class Solution:
    def minMeetingRooms(self, intervals: List[Interval]) -> int:
        mp = defaultdict(int)
        for i in intervals:
            mp[i.start] += 1
            mp[i.end] -= 1
        prev = 0
        res = 0
        for i in sorted(mp.keys()):
            prev += mp[i]
            res = max(res, prev)
        return res
```
- Time Complexity: $O(nlogn)$
- Space Complexity: $O(n)$
### (3) Two Pointers
```python
"""
Definition of Interval:
class Interval(object):
    def __init__(self, start, end):
        self.start = start
        self.end = end
"""

class Solution:
    def minMeetingRooms(self, intervals: List[Interval]) -> int:
        start = sorted([i.start for i in intervals])
        end = sorted([i.end for i in intervals])
        
        res = count = 0
        s = e = 0
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
Time Complexity: $O(nlogn)$
Space Complexity: $O(n)$
### (4) Greedy
```python
"""
Definition of Interval:
class Interval(object):
    def __init__(self, start, end):
        self.start = start
        self.end = end
"""

class Solution:
    def minMeetingRooms(self, intervals: List[Interval]) -> int:
        time = []
        for i in intervals:
            time.append((i.start, 1))
            time.append((i.end, -1))
        
        time.sort(key=lambda x: (x[0], x[1]))
        
        res = count = 0
        for t in time:
            count += t[1]
            res = max(res, count)
        return res
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(n)$
## References

[^1]: https://www.youtube.com/watch?v=FdzJmTCVyJU
[^2]: https://neetcode.io/solutions/meeting-rooms-ii