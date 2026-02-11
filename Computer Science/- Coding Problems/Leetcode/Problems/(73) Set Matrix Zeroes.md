---
Source:
  - https://leetcode.com/problems/set-matrix-zeroes/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-23 at 6.23.27 PM.png]]
- Given an $m \times n$ matrix. If an element is 0, set its entire row and column to 0, Do it in-place
- Could start off with a copy
	- It takes $O(m *n)$ memory and also not most time efficient algorithm either
- Will figure out how to prevent this repeated work.
- New memory complexity is $O(m + n)$
	- Time complexity $O(m*n)$ since we're iterating over the matrix at most 3 times
		- One where we iterate through each position
		- One where we fill in the columns
		- One where we fill in the rows
	- Creating the copy will actually have a greater time complexity
- Now can we get $O(1)$ memory complexity?
	- We know that time complexity is $O(m*n)$ as we do need to iterate through every single position in the matrix
	- We do need one more cell or variable which is O(1)
```python
class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        # O(1)
        ROWS, COLS = len(matrix), len(matrix[0])
        rowZero = False

        # determine which rows/cols need to be zero
        for r in range(ROWS):
            for c in range(COLS):
                if matrix[r][c] == 0:
                    matrix[0][c] = 0
                    if r > 0:
                        matrix[r][0] = 0
                    else:
                        rowZero = True
        
        for r in range(1, ROWS):
            for c in range(1, COLS):
                if matrix[0][c] == 0 or matrix[r][0] == 0:
                    matrix[r][c] = 0
        
        if matrix[0][0] == 0:
            for r in range(ROWS):
                matrix[r][0] = 0
        if rowZero:
            for c in range(COLS):
                matrix[0][c] = 0
```
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        ROWS, COLS = len(matrix), len(matrix[0])
        mark = [[matrix[r][c] for c in range(COLS)] for r in range(ROWS)]

        for r in range(ROWS):
            for c in range(COLS):
                if matrix[r][c] == 0:
                    for col in range(COLS):
                        mark[r][col] = 0
                    for row in range(ROWS):
                        mark[row][c] = 0

        for r in range(ROWS):
            for c in range(COLS):
                matrix[r][c] = mark[r][c]
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m*n)$
- Where $m$ is the number of rows and $n$ is the number of columns.
### (2) Iteration
```python
class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        ROWS, COLS = len(matrix), len(matrix[0])
        rows, cols = [False] * ROWS, [False] * COLS

        for r in range(ROWS):
            for c in range(COLS):
                if matrix[r][c] == 0:
                    rows[r] = True
                    cols[c] = True

        for r in range(ROWS):
            for c in range(COLS):
                if rows[r] or cols[c]:
                    matrix[r][c] = 0
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m+n)$
- Where $m$ is the number of rows and $n$ is the number of columns
### (3) Iteration (Space Optimized)
```python
class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        ROWS, COLS = len(matrix), len(matrix[0])
        rows, cols = [False] * ROWS, [False] * COLS

        for r in range(ROWS):
            for c in range(COLS):
                if matrix[r][c] == 0:
                    rows[r] = True
                    cols[c] = True

        for r in range(ROWS):
            for c in range(COLS):
                if rows[r] or cols[c]:
                    matrix[r][c] = 0
```
Time Complexity: $O(m*n)$
Space Complexity: $O(1)$
- Where $m$ is the number of rows and $n$ is the number of columns.
## References

[^1]: [Set Matrix Zeroes - In-place - Leetcode 73](https://www.youtube.com/watch?v=T41rL0L3Pnw)
[^2]: https://neetcode.io/solutions/set-matrix-zeroes