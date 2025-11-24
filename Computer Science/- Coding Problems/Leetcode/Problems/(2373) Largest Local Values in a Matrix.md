---
Source:
  - https://leetcode.com/problems/largest-local-values-in-a-matrix/
Reviewed: false
Approaches: "1"
---
## Synthesis
- A contiguous 3x3 matrix simply refers to a 3-row by 3-column block of elements that are adjacent to each other within a larger matrix or grid of numbers
### My Solution
```python
class Solution:
    def largestLocal(self, grid: List[List[int]]) -> List[List[int]]:
        
        full_list = []
        row_list = []

        for row in range(len(grid) - 2):
            for column in range(len(grid) - 2):
                max_value = 0
                for i in range(row, row+3):
                    for j in range(column, column+3):
                        if grid[i][j] > max_value:
                            max_value = grid[i][j]
                row_list.append(max_value)
            full_list.append(list(row_list))
            row_list.clear()
        return full_list

'''
Okay, just need to see how to rotate through each matrix now

Example 1
First 3 elements of first 3 lists
First 3 elements + 1 of first 3 lists

First 3 elements of first 3 lists + 1
First 3 elements + 1 of frist 3 lists + 1

Example 2

## First Row
        grid[0][0]
        grid[0][1]
        grid[0][2]

        ## Second Row
        grid[1][0]
        grid[1][1]
        grid[1][2]
        
        ## Third Row
        grid[2][0]
        grid[2][1]
        grid[2][2]

        # Upper-right square (finding maximum)

        ## First Row
        grid[0][1]
        grid[0][2]
        grid[0][3]
        ## Second Row
        grid[1][1]
        grid[1][2]
        grid[1][3]
        ## Third Row
        grid[2][1]
        grid[2][2]
        grid[2][3]

        # Bottom-left square (finding maximum)

        ## First Row
        grid[1][0]
        grid[1][1]
        grid[1][2]

        ## Second Row
        grid[2][0]
        grid[2][1]
        grid[2][2]

        ## Third Row
        grid[3][0]
        grid[3][1]
        grid[3][2]

        # Bottom-right square (finding maximum)

        ## First Row
        grid[1][1]
        grid[1][2]
        grid[1][3]

        ## Second Row
        grid[2][1]
        grid[2][2]
        grid[2][3]

        ## Third Row
        grid[3][1]
        grid[3][2]
        grid[3][3]

'''
```
## Source [^1]
- 
## References

[^1]: 