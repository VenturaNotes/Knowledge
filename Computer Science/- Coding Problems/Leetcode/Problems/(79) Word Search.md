---
Source:
  - https://leetcode.com/problems/word-search/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-21 at 9.33.12 PM.png|300]]
- Will use [[backtracking]] brute force technique
- Doing recursive backtracking or doing this with DFS
- What's the time complexity of DFS?
	- The call stack is always the length of the word
	- Since calling 4 different times, it's $4^{len(word)}$ 
- Time complexity: $O(n*m*4^n)$ 
	- Not that efficient
```python
class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        ROWS, COLS = len(board), len(board[0])
        path = set()

        def dfs(r, c, i):
            if i == len(word):
                return True
            if (r < 0 or c < 0 or r >= ROWS or c >= COLS 
                or word[i] != board[r][c] or (r,c) in path):
                return False
            path.add((r,c))
            res = (dfs(r+1, c, i+1) or
                    dfs(r-1, c, i+1) or 
                    dfs(r, c+1, i+1) or
                    dfs(r, c-1, i+1))
            path.remove((r, c))
            return res
        for r in range(ROWS):
            for c in range(COLS):
                if dfs(r, c, 0): return True
        return False
```
## References

[^1]: https://www.youtube.com/watch?v=pfiQ_PS1g8E