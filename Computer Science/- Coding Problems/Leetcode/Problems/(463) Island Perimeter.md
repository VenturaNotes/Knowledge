---
Source:
  - https://leetcode.com/problems/island-perimeter/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def islandPerimeter(self, grid: List[List[int]]) -> int:
        count = 0
        for i in range(len(grid)):
            for j in range(len(grid[i])):
                if grid[i][j] == 1:
                    value = 4
                    # Checking left
                    if j > 0 and grid[i][j-1] == 1:
                        value -= 1
                        
                    # Checking right
                    if j < len(grid[i])-1 and grid[i][j+1] == 1:
                        value -= 1
                        
                    # Check up (only if i is > 0)
                    if i > 0 and grid[i-1][j] == 1:
                        value -=1
                    
                    # Check down (only when grid length > i)
                    if i < len(grid)-1 and grid[i+1][j] == 1:
                        value -=1
                    
                    count+= value
        return count

        
"""
How to check for neighbors
7 squares in given example

So take existing #
7*4 = 28 
Then subtract by number touching?
1, 1, 4, 1, 2, 2, 1

Gives 16
"""
```
## Source [^1]
- 
## References

[^1]: [Island Perimeter - Graph - Leetcode 463](https://www.youtube.com/watch?v=fISIuAFRM2s)