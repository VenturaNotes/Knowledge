---
Source:
  - https://leetcode.com/problems/search-a-2d-matrix/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-10-18 at 4.09.18 PM.png]]
- Could do a [[binary search]] in O(logn) time
- So we could create an efficient algorithm in O(mlogn)
	- Useful for sorted arrays
- Could just do a $log(m)$ binary search
	- Will do $logm + logn$ 
	- Could just do a double binary search
```python
class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        ROWS, COLS = len(matrix), len(matrix[0])

        top, bot = 0, ROWS - 1
		# Finding row of matrix where the target is located
        while top <= bot:
            row = (top + bot) // 2
            if target > matrix[row][-1]:
                top = row + 1
            elif target < matrix[row][0]:
                bot = row - 1
            else:
                break
		
		# If there is not a row where the target is located
		# just return false
        if not (top <= bot):
            return False

        row = (top + bot) // 2
        l, r = 0, COLS - 1

		# Finding where the target is located within the row
        while l <= r:
            m = (l + r) // 2
            if target > matrix[row][m]:
                l = m + 1
            elif target < matrix[row][m]:
                r = m - 1
            else:
                return True
        return False
```
## References

[^1]: https://www.youtube.com/watch?v=Ber2pi2C0j0