---
Source:
  - https://leetcode.com/problems/non-overlapping-intervals/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-29 at 10.19.39 PM.png]]
- Edge case
	- Given the intervals `[1, 2]` and `[2, 3]`, the point at position 2 is overlapping but technically the intervals are not considered overlapping 
		- If they have the same edge point, they do not count as overlapping
- If we have 2 choices for every single interval inside the list of intervals, then the time complexity to check every single possibility is $2^n$ where n is the size of the input
	- Not every efficient
	- We can do better, but it takes a greedy approach to solve this problem
- If the second one starts after the first one ends, then they're definitely not overlapping
	- If the second one starts before the first one ends, then they're definitely overlapping
	- Important to remove the interval that ends later
- Sort by start, then compare adjacent pairs and then use conditions mentioned
	- $O(nlogn)$ for sorting
```python
class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        #first will sort based on start value, and then sort on end value if tie
        intervals.sort()

        res = 0
        prevEnd = intervals[0][1]
        for start, end in intervals[1:]:
            if start >= prevEnd:
                prevEnd = end
            else:
                res += 1
                prevEnd = min(end, prevEnd)
        return res
```
## References

[^1]: https://www.youtube.com/watch?v=nONCGxWoUfM