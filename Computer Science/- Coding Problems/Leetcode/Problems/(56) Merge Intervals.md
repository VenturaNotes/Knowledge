---
Source:
  - https://leetcode.com/problems/merge-intervals/
Reviewed: false
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
## Source[^2]
### (1) Sorting
```python
class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        intervals.sort(key=lambda pair: pair[0])
        output = [intervals[0]]

        for start, end in intervals:
            lastEnd = output[-1][1]

            if start <= lastEnd:
                output[-1][1] = max(lastEnd, end)
            else:
                output.append([start, end])
        return output
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(1)$ or $O(n)$ depending on the sorting algorithms.
### (2) Sweep Line Algorithm
```python
class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        mp = defaultdict(int)
        for start, end in intervals:
            mp[start] += 1
            mp[end] -= 1

        res = []
        interval = []
        have = 0
        for i in sorted(mp):
            if not interval:
                interval.append(i)
            have += mp[i]
            if have == 0:
                interval.append(i)
                res.append(interval)
                interval = []
        return res
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(n)$
### (3) Greedy
```python
class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        max_val = max(interval[0] for interval in intervals)
        
        mp = [0] * (max_val + 1)
        for start, end in intervals:
            mp[start] = max(end + 1, mp[start])

        res = []
        have = -1
        interval_start = -1
        for i in range(len(mp)):
            if mp[i] != 0:
                if interval_start == -1:
                    interval_start = i
                have = max(mp[i] - 1, have)
            if have == i:
                res.append([interval_start, have])
                have = -1
                interval_start = -1

        if interval_start != -1:
            res.append([interval_start, have])

        return res
```
Time Complexity: $O(n+m)$
Space Complexity: $O(n)$
- Where $n$ is the length of the array and $m$ is the maximum start value among all the intervals.
## References

[^1]: [Merge Intervals - Sorting - Leetcode 56](https://www.youtube.com/watch?v=44H3cEC2fFM)
[^2]: https://neetcode.io/solutions/merge-intervals