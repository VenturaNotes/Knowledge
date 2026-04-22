---
Source:
  - https://leetcode.com/problems/count-submatrices-with-equal-frequency-of-x-and-y/?envType=daily-question&envId=2026-04-21
tags:
  - in-progress
Approaches: "0"
---
## Synthesis
### Problem
- `grid` = 2D character matrix
- `grid[i][j]` = `'X'`, `'Y'`, or `'.'`
- Return [[submatrix|submatrices]] which contains 
	- `grid[0][0]`
	- an **equal** frequency of `'X'` and `'Y'`.
	- **at least** one `'X'`.
		- which means a `Y` as well 
- Constraints
	- `1 <= grid.length, grid[i].length <= 1000`
	- `grid[i][j]` is either `'X'`, `'Y'`, or `'.'`.
### Examples

#### Example 1
- Input: grid = `[["X","Y","."],["Y",".","."]]`
- Output: 3
- ![[(3212) Count Submatrices With Equal Frequency of X and Y 2026-04-21 21.11.06.excalidraw|600]]
	- There are no other variations because `X` and `Y` must have an equal frequency
#### Example 2
- **Input:** grid = \[\["X","X"\],\["X","Y"\]\]
- **Output:** 0
	- No submatrix has an equal frequency of `'X'` and `'Y'`. 

#### Example 3
- Input: grid = \[\[".","."\],\[".","."\]\]
- Output: 0
- No submatrix has at least one `'X'`.

### Solution 1
```python
class Solution:
  def numberOfSubmatrices(self, grid: list[list[str]]) -> int:
    m = len(grid)
    n = len(grid[0])
    ans = 0
    # x[i][j] := the number of 'X' in grid[0..i)[0..j)
    x = [[0] * (n + 1) for _ in range(m + 1)]
    # y[i][j] := the number of 'Y' in grid[0..i)[0..j)
    y = [[0] * (n + 1) for _ in range(m + 1)]

    for i, row in enumerate(grid):
      for j, cell in enumerate(row):
        x[i + 1][j + 1] = (cell == 'X') + x[i][j + 1] + x[i + 1][j] - x[i][j]
        y[i + 1][j + 1] = (cell == 'Y') + y[i][j + 1] + y[i + 1][j] - y[i][j]
        if x[i + 1][j + 1] > 0 and x[i + 1][j + 1] == y[i + 1][j + 1]:
          ans += 1

    return ans
```
- Time: $O(mn)$
- Space: $O(mn)$
- #question How is prefix sum related to this?
	- What is prefix sum?

## Source [^1]
```python
class Solution:
  def numberOfSubmatrices(self, grid: list[list[str]]) -> int:
    m = len(grid)
    n = len(grid[0])
    ans = 0
    # x[i][j] := the number of 'X' in grid[0..i)[0..j)
    x = [[0] * (n + 1) for _ in range(m + 1)]
    # y[i][j] := the number of 'Y' in grid[0..i)[0..j)
    y = [[0] * (n + 1) for _ in range(m + 1)]

    for i, row in enumerate(grid):
      for j, cell in enumerate(row):
        x[i + 1][j + 1] = (cell == 'X') + x[i][j + 1] + x[i + 1][j] - x[i][j]
        y[i + 1][j + 1] = (cell == 'Y') + y[i][j + 1] + y[i + 1][j] - y[i][j]
        if x[i + 1][j + 1] > 0 and x[i + 1][j + 1] == y[i + 1][j + 1]:
          ans += 1

    return ans
```
- Array, matrix, prefix sum
- Time: $O(mn)$
- Space: $O(mn)$
## References

[^1]: https://walkccc.me/LeetCode/problems/3212/?h=3212#__tabbed_1_3