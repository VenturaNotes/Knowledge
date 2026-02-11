---
Source:
  - https://leetcode.com/problems/word-search-ii/
Reviewed: false
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
## Source[^2]
### (1) Backtracking
```python
class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        ROWS, COLS = len(board), len(board[0])
        res = []

        def backtrack(r, c, i):
            if i == len(word):
                return True
            if (r < 0 or c < 0 or r >= ROWS or 
                c >= COLS or board[r][c] != word[i]
            ):
                return False

            board[r][c] = '*'
            ret = (backtrack(r + 1, c, i + 1) or
                   backtrack(r - 1, c, i + 1) or
                   backtrack(r, c + 1, i + 1) or
                   backtrack(r, c - 1, i + 1))
            board[r][c] = word[i]
            return ret

        for word in words:
            flag = False
            for r in range(ROWS):
                if flag:
                    break
                for c in range(COLS):
                    if board[r][c] != word[0]:
                        continue
                    if backtrack(r, c, 0):
                        res.append(word)
                        flag = True
                        break
        return res
```
Time Complexity: $O(m*n*4^t+s)$
Space Complexity: $O(t)$
- Where $m$ is the number of rows, $n$ is the number of columns, $t$ is the maximum length of any word in the array $words$ and $s$ is the sum of the lengths of all the words

### (2) Backtracking (Trie + Hash Set)
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
            if (r < 0 or c < 0 or r >= ROWS or 
                c >= COLS or (r, c) in visit or 
                board[r][c] not in node.children
            ):
                return

            visit.add((r, c))
            node = node.children[board[r][c]]
            word += board[r][c]
            if node.isWord:
                res.add(word)

            dfs(r + 1, c, node, word)
            dfs(r - 1, c, node, word)
            dfs(r, c + 1, node, word)
            dfs(r, c - 1, node, word)
            visit.remove((r, c))

        for r in range(ROWS):
            for c in range(COLS):
                dfs(r, c, root, "")

        return list(res)
```
Time Complexity: $O(m*n*4*3^{t-1}+s)$
Space Complexity: $O(s)$
- Where $m$ is the number of rows, $n$ is the number of columns, $t$ is the maximum length of any word in the array $words$ and $s$ is the sum of the lengths of all the words

### (3) Backtracking (Trie)
```python
class TrieNode:
    def __init__(self):
        self.children = [None] * 26
        self.idx = -1
        self.refs = 0

    def addWord(self, word, i):
        cur = self
        cur.refs += 1
        for c in word:
            index = ord(c) - ord('a')
            if not cur.children[index]:
                cur.children[index] = TrieNode()
            cur = cur.children[index]
            cur.refs += 1
        cur.idx = i

class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        root = TrieNode()
        for i in range(len(words)):
            root.addWord(words[i], i)

        ROWS, COLS = len(board), len(board[0])
        res = []

        def getIndex(c):
            index = ord(c) - ord('a')
            return index

        def dfs(r, c, node):
            if (r < 0 or c < 0 or r >= ROWS or 
                c >= COLS or board[r][c] == '*' or 
                not node.children[getIndex(board[r][c])]):
                return
            
            tmp = board[r][c]
            board[r][c] = '*'
            prev = node
            node = node.children[getIndex(tmp)]
            if node.idx != -1:
                res.append(words[node.idx])
                node.idx = -1
                node.refs -= 1
                if not node.refs:
                    prev.children[getIndex(tmp)] = None
                    node = None
                    board[r][c] = tmp
                    return

            dfs(r + 1, c, node)
            dfs(r - 1, c, node)
            dfs(r, c + 1, node)
            dfs(r, c - 1, node)

            board[r][c] = tmp

        for r in range(ROWS):
            for c in range(COLS):
                dfs(r, c, root)

        return res
```
Time Complexity: $O(m*n*4*3^{t-1}+s)$
Space Complexity: $O(s)$
- Where $m$ is the number of rows, $n$ is the number of columns, $t$ is the maximum length of any word in the array $words$ and $s$ is the sum of the lengths of all the words
## References

[^1]: [Word Search II - Backtracking Trie - Leetcode 212 - Python](https://www.youtube.com/watch?v=asbcE9mZz_U)
[^2]: https://neetcode.io/solutions/word-search-ii