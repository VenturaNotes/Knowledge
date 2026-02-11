---
Source:
  - https://leetcode.com/problems/non-overlapping-intervals/
Reviewed: false
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
## Source[^2]
### (1) Recursion
```python
class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        intervals.sort()
        
        def dfs(i, prev):
            if i == len(intervals):
                return 0
            res = dfs(i + 1, prev)
            if prev == -1 or intervals[prev][1] <= intervals[i][0]:
                res = max(res, 1 + dfs(i + 1, i))
            return res
        
        return len(intervals) - dfs(0, -1)
```
Time Complexity: $O(2^n)$
Space Complexity: $O(n)$
### (2) Dynamic Programming (Top-Down)
```python
class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        intervals.sort(key = lambda x: x[1])
        n = len(intervals)
        memo = {}

        def dfs(i):
            if i in memo:
                return memo[i]

            res = 1
            for j in range(i + 1, n):
                if intervals[i][1] <= intervals[j][0]:
                    res = max(res, 1 + dfs(j))
            memo[i] = res
            return res

        return n - dfs(0)
```
Time Complexity: $O(n^2)$
Space Complexity: $O(n)$
### (3) Dynamic Programming (Bottom-Up)
```python
class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        intervals.sort(key=lambda x: x[1])
        n = len(intervals)
        dp = [0] * n  

        for i in range(n):
            dp[i] = 1 
            for j in range(i):
                if intervals[j][1] <= intervals[i][0]:  
                    dp[i] = max(dp[i], 1 + dp[j])

        max_non_overlapping = max(dp)  
        return n - max_non_overlapping
```
Time Complexity: $O(n^2)$
Space Complexity: $O(n)$

### (4) Dynamic Programming (Binary Search)
```python
class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        intervals.sort(key=lambda x: x[1])
        n = len(intervals)
        dp = [0] * n
        dp[0] = 1

        def bs(r, target):
            l = 0
            while l < r:
                m = (l + r) >> 1
                if intervals[m][1] <= target:
                    l = m + 1
                else:
                    r = m
            return l

        for i in range(1, n):
            idx = bs(i, intervals[i][0])
            if idx == 0:
                dp[i] = dp[i - 1]
            else:
                dp[i] = max(dp[i - 1], 1 + dp[idx - 1])
        return n - dp[n - 1]
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(n)$

### (5) Greedy (Sort By Start)
```python
class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
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
Time Complexity: $O(nlogn)$
Space Complexity: $O(1)$ or $O(n)$ depending on the sorting algorithm
### (6) Greedy (Sort By End)
```python
class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        intervals.sort(key = lambda pair: pair[1])
        prevEnd = intervals[0][1]
        res = 0

        for i in range(1, len(intervals)):
            if prevEnd > intervals[i][0]:
                res += 1
            else:
                prevEnd = intervals[i][1]

        
        return res
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(1)$ or $O(n)$ depending on the sorting algorithm
## References

[^1]: [Non-Overlapping Intervals - Leetcode 435 - Python](https://www.youtube.com/watch?v=nONCGxWoUfM)
[^2]: https://neetcode.io/solutions/non-overlapping-intervals