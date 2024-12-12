---
Source:
  - https://leetcode.com/problems/spiral-matrix/
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
## References

[^1]: https://www.youtube.com/watch?v=BJnMZNwUk1M