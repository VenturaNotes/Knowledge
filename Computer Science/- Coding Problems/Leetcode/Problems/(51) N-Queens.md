---
Source:
  - https://leetcode.com/problems/n-queens/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-22 at 12.37.23 AM.png]]
- A famous [[backtracking]] problem
	- It's basically the brute force method for this
- Need to keep track of columns, positive diagonals and negative diagonals for where the queen will be placed.
- For negative diagonal
	- row - column will stay constant
- For positive diagonal
	- r + c is constant
```python
class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        col = set()
        posDiag = set()
        negDiag = set()

        res = []
        board = [["."] * n for i in range(n)]

        def backtrack(r):
            if r == n:
                copy = ["".join(row) for row in board]
                res.append(copy)
                return
            
            for c in range(n):
                if c in col or (r + c) in posDiag or (r - c) in negDiag:
                    continue
            
                col.add(c)
                posDiag.add(r + c)
                negDiag.add(r - c)
                board[r][c] = "Q"

                backtrack(r + 1)

                col.remove(c)
                posDiag.remove(r + c)
                negDiag.remove(r - c)
                board[r][c] = "."
        backtrack(0)
        return res
```
## References

[^1]: https://www.youtube.com/watch?v=Ph95IHmRp5M