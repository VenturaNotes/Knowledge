---
Source:
  - https://leetcode.com/problems/spiral-matrix/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-11 at 10.46.55 PM.png]]
- Return all elements of the matrix in spiral order
- When top and bottom boundary are equal or left and right boundary are equal, we know to stop the code 
```python
class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        res = []
        left, right = 0, len(matrix[0])
        top, bottom = 0, len(matrix)

        while left < right and top < bottom:
            # get every i in the top row
            for i in range(left, right):
                res.append(matrix[top][i])
            top += 1

            # get every i in the right col
            for i in range(top, bottom):
                res.append(matrix[i][right-1])
            right -= 1

            if not (left < right and top < bottom):
                break
            
            # get every i in the bottom row
            for i in range(right - 1, left - 1, -1):
                res.append(matrix[bottom-1][i])
            bottom -= 1

            # get every i in the left col
            for i in range(bottom - 1, top - 1, -1):
                res.append(matrix[i][left])
            left += 1
        return res
```
- Time complexity is $O(m*n)$ which is the dimension of the matrix
- Memory complexity is O(1) because we are not saving extra memory. Just running the code
	- And if you don't count the output as extra memory
## Source[^2]
### (1) Recursion
```python
class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        m, n = len(matrix), len(matrix[0])
        res = []

        # append all the elements in the given direction
        def dfs(row, col, r, c, dr, dc):
            if row == 0 or col == 0:
                return
            
            for i in range(col):
                r += dr
                c += dc
                res.append(matrix[r][c])

            # sub-problem
            dfs(col, row - 1, r, c, dc, -dr)
        
        # start by going to the right
        dfs(m, n, 0, -1, 0, 1)
        return res
```
Time Complexity: $O(m*n)$
Space Complexity: $O(min(m,n))$
- Where $m$ is the number of rows and $n$ is the number of columns
### (2) Iteration
```python
class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        res = []
        left, right = 0, len(matrix[0])
        top, bottom = 0, len(matrix)

        while left < right and top < bottom:
            for i in range(left, right):
                res.append(matrix[top][i])
            top += 1
            for i in range(top, bottom):
                res.append(matrix[i][right - 1])
            right -= 1
            if not (left < right and top < bottom):
                break
            for i in range(right - 1, left - 1, -1):
                res.append(matrix[bottom - 1][i])
            bottom -= 1
            for i in range(bottom - 1, top - 1, -1):
                res.append(matrix[i][left])
            left += 1

        return res
```
Time Complexity: $O(m*n)$
Space Complexity: $O(1)$
- Where $m$ is the number of rows and $n$ is the number of columns.
### (3) Iteration (Optimal)
```python
class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        res = []
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        steps = [len(matrix[0]), len(matrix) - 1]

        r, c, d = 0, -1, 0
        while steps[d & 1]:
            for i in range(steps[d & 1]):
                r += directions[d][0]
                c += directions[d][1]
                res.append(matrix[r][c])
            steps[d & 1] -= 1
            d += 1
            d %= 4
        return res
```
Time Complexity: $O(m*n)$
Space Complexity: $O(1)$
- Where $m$ is the number of rows and $n$ is the number of columns
## References

[^1]: https://www.youtube.com/watch?v=BJnMZNwUk1M
[^2]: https://neetcode.io/solutions/spiral-matrix