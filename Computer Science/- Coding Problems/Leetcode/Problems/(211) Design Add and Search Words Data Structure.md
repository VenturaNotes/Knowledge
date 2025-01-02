---
Source:
  - https://leetcode.com/problems/design-add-and-search-words-data-structure/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-21 at 8.16.55 PM.png]]
- Word may contain `.` or `a-z`
- Will use a [[trie]] a data structure
- With searching `ab...`
	- We would do a brute force DFS backtracking type of approach
```python
class TrieNode:
    def __init__(self):
        self.children = {} # a : TrieNode
        self.word = False

class WordDictionary:

    def __init__(self):
        self.root = TrieNode()
        

    def addWord(self, word: str) -> None:
        cur = self.root

        for c in word:
            if c not in cur.children:
                cur.children[c] = TrieNode()
            cur = cur.children[c]
        cur.word = True

    def search(self, word: str) -> bool:
        def dfs(j, root):
            cur = root
            for i in range(j, len(word)):
                c = word[i]

                if c == ".":
                    for child in cur.children.values():
                        if dfs(i+1, child):
                            return True
                    return False
                else:
                    if c not in cur.children:
                        return False
                    cur = cur.children[c]
            return cur.word
        return dfs(0, self.root)
            

```
## References

[^1]: https://www.youtube.com/watch?v=BTf05gs_8iU