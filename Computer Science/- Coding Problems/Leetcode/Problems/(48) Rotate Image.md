---
Source:
  - https://leetcode.com/problems/rotate-image/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-08 at 11.07.58 PM.png]]
- We have to rotate image in-place meaning that we can't just allocate more memory
- Don't always need to make temporary variables (just need one for the rotations)
- Time complexity of $n^2$ and memory complexity of $O(1)$ 
```python
class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        """
        Do not return anything, modify matrix in-place instead
        """
        l, r = 0, len(matrix) - 1

        while l < r:
            for i in range(r-l):
                top, bottom = l, r

                # save the topLeft
                topLeft = matrix[top][l+i]

                # move bottom Left into top Left
                matrix[top][l+i] = matrix[bottom-i][l]

                # move bottom right into bottom left
                matrix[bottom-i][l] = matrix[bottom][r-i]

                # move top right into bottom right
                matrix[bottom][r-i] = matrix[top+i][r]

                # move top Left into top right
                matrix[top+i][r] = topLeft
            r -= 1
            l += 1
```
## References

[^1]: https://www.youtube.com/watch?v=fMSJSS7eO1w