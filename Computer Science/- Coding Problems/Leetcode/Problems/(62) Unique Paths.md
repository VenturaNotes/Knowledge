---
Source:
  - https://leetcode.com/problems/unique-paths/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-01 at 2.42.44 AM.png]]
- [[Dynamic programming]] problem
- Finding how many possible unique paths are there?
	- Can only go down or right.
- When doing DFS, could have a cache so that for every row, column position, we can cache the result.
	- The sum we're looking for is R + D
- There are 28 unique paths to get to the result
	- When you look at the picture, it actually looks more like a math problem than a coding problem
	- You can actually calculate the number of ways from the top-left in constant time if you have a math equation. So we're just going to stick to dynamic programming solution for this
```python
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        row = [1]*n

        for i in range(m-1):
            newRow = [1]*n
            for j in range(n-2, -1, -1):
                newRow[j] = newRow[j + 1] + row[j]
            row = newRow
        return row[0]
```
- Time Complexity: $O(n*m)$
- Memory Complexity: $O(n)$ `length of row`
## References

[^1]: https://www.youtube.com/watch?v=IlEsdxuD4lY