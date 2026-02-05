---
Source:
  - https://leetcode.com/problems/search-a-2d-matrix/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-10-18 at 4.09.18 PM.png]]
- First watch
	- Could do a [[binary search]] in O(logn) time
	- So we could create an efficient algorithm in O(mlogn)
		- Useful for sorted arrays
	- Could just do a $log(m)$ binary search
		- Will do $logm + logn$ 
		- Could just do a double binary search
- Second watch
	- Need to find a value inside an $m \times n$ matrix that has sorted values
	- Brute force
		- Time Complexity: $O(m*n)$ 
		- Search every single value in input array
	- [[Binary Search]]
		- Time Complexity: $mlogn$
			- This is using the property that the integers in each row are sorted from left to right
	- Using a double binary search, we'd get the time complexity to be $logm$ + $logn$ 
		- $logm$ is binary search the which row to use
		- $logn$ is binary search the column of the row found
	- We'll have 2 pointers, left pointer and right pointer.
	- Using a double binary search.

```python
# For Leetcode
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

```python
# For Testing
def searchMatrix(matrix, target):
    ROWS, COLS = len(matrix), len(matrix[0])

    top, bot = 0, ROWS - 1
    while top <= bot:
        row = (top + bot) //2
        if target > matrix[row][-1]:
            top = row + 1
        elif target < matrix[row][0]:
            bot = row - 1
        else:
            break

    if not (top <= bot):
        return False
    row = (top + bot) // 2
    l, r = 0, COLS - 1
    while l <= r:
        m = (l + r) // 2
        if target > matrix[row][m]:
            l = m + 1
        elif target < matrix[row][m]:
            r = m - 1
        else:
            return True
    return False

print(searchMatrix([[1,3,5]], 4))
#Returns False
```
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        for r in range(len(matrix)):
            for c in range(len(matrix[0])):
                if matrix[r][c] == target:
                    return True
        return False
```
Time Complexity: $O(m*n)$
Space Complexity: $O(1)$
- Where $m$ is the number of rows and $n$ is the number of columns of matrix
### (2) Staircase Search
```python
class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        m, n = len(matrix), len(matrix[0])
        r, c = 0, n - 1

        while r < m and c >= 0:
            if matrix[r][c] > target:
                c -= 1
            elif matrix[r][c] < target:
                r += 1
            else:
                return True
        return False
```
Time Complexity: $O(m+n)$
Space Complexity: $O(1)$
- Where $m$ is the number of rows and $n$ is the number of columns of matrix

### (3) Binary Search
```python
class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        ROWS, COLS = len(matrix), len(matrix[0])

        top, bot = 0, ROWS - 1
        while top <= bot:
            row = (top + bot) // 2
            if target > matrix[row][-1]:
                top = row + 1
            elif target < matrix[row][0]:
                bot = row - 1
            else:
                break

        if not (top <= bot):
            return False
        row = (top + bot) // 2
        l, r = 0, COLS - 1
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
Time Complexity:$O(logm + logn)$ (which reduces to $O(log(m*n)))$
Space Complexity: $O(1)$
- Where $m$ is the number of rows and $n$ is the number of columns of matrix.

### (4) Binary Search (One Pass)
```python
class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        ROWS, COLS = len(matrix), len(matrix[0])

        l, r = 0, ROWS * COLS - 1
        while l <= r:
            m = l + (r - l) // 2
            row, col = m // COLS, m % COLS
            if target > matrix[row][col]:
                l = m + 1
            elif target < matrix[row][col]:
                r = m - 1
            else:
                return True
        return False
```
Time Complexity: $O(log(m*n))$
Space Complexity: $O(1)$
- Where $m$ is the number of rows and $n$ is the number of columns of matrix.
## References

[^1]: [Search a 2D Matrix - Leetcode 74 - Python](https://www.youtube.com/watch?v=Ber2pi2C0j0)
[^2]: https://neetcode.io/solutions/search-a-2d-matrix