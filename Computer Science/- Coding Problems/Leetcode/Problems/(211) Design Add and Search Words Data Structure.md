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
## Source[^2]
### (1) Brute Force
```python
class WordDictionary:

    def __init__(self):
        self.store = []

    def addWord(self, word: str) -> None:
        self.store.append(word)

    def search(self, word: str) -> bool:
        for w in self.store:
            if len(w) != len(word):
                continue
            i = 0
            while i < len(w):
                if w[i] == word[i] or word[i] == '.':
                    i += 1
                else:
                    break
            if i == len(w):
                return True
        return False
```
Time Complexity: $O(1)$ for $addWord()$, or $O(m*n)$ for $search()$
Space complexity: $O(m*n)$
- Where $m$ is the number of words added and $n$ is the length of the string
### (2) Depth First Search (Trie)
```python
class TrieNode:
    def __init__(self):
        self.children = {}
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
                        if dfs(i + 1, child):
                            return True
                    return False
                else:
                    if c not in cur.children:
                        return False
                    cur = cur.children[c]
            return cur.word

        return dfs(0, self.root)
```
Time Complexity: $O(n)$ for $addWord()$, $O(n)$ for $search()$
Space Complexity: $O(t + n)$
- Where $n$ is the length of the string and $t$ is the total number of TrieNodes created in the Trie
## References

[^1]: [Design Add and Search Words Data Structure - Leetcode 211 - Python](https://www.youtube.com/watch?v=BTf05gs_8iU)
[^2]: https://neetcode.io/solutions/design-add-and-search-words-data-structure