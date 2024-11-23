---
Source:
  - https://leetcode.com/problems/word-search-ii/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-21 at 8.28.43 PM.png]]
- Return all words on the board
- Words must be constructed from letters of sequentially adjacent cells
	- Adjacent cells are horizontally or vertically neighboring
	- Same letter cell may not be used more than once in a word
- If using DFS, time complexity could be $wmn*4^{mn}$ 
- Will use the [[trie]] data structure
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.isWord = False
    
    def addWord(self, word):
        cur = self
        for c in word:
            if c not in cur.children:
                cur.children[c] = TrieNode()
            cur = cur.children[c]
        cur.isWord = True

class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        root = TrieNode()
        for w in words:
            root.addWord(w)
        
        ROWS, COLS = len(board), len(board[0])
        res, visit = set(), set()

        def dfs(r, c, node, word):
            if (r < 0 or c < 0 or r == ROWS or c == COLS
                or (r,c) in visit or board[r][c] not in node.children):
                return
            visit.add((r,c))
            node = node.children[board[r][c]]
            word += board[r][c]
            if node.isWord:
                res.add(word)
            
            dfs(r - 1, c, node, word)
            dfs(r + 1, c, node, word)
            dfs(r, c - 1, node, word)
            dfs(r, c+1, node, word)
            visit.remove((r,c))
        for r in range(ROWS):
            for c in range(COLS):
                dfs(r, c, root,"")
        
        return list(res)
```
- A slight optimization (even though it wouldn't improve the overall time complexity), but once you find a word in the trie, you can basically remove it if it's a leaf node from the trie. So you don't have to search for the same word twice.
## References

[^1]: https://www.youtube.com/watch?v=asbcE9mZz_U