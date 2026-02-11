---
Source:
  - https://leetcode.com/problems/implement-trie-prefix-tree/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-21 at 8.08.19 PM.png]]
- [[Trie]] (or prefix tree)
	- A tree data structure used to efficiently store and retrieve keys in a dataset of strings
	- There are various applications of this data structure, such as autocomplete and spellchecker
- Implement the Trie class:
	- `Trie()` Initializes the trie object
	- `void insert (String word)` Inserts the string `word` into the `trie`
	- `boolean search(String word)` Returns `true` if the string `word` is in the trie (i.e., was inserted before), and `false` otherwise
	- `boolean startsWith(String prefix)` Returns `true` if there is a previously inserted string `word` that has the prefix `prefix`, and `false` otherwise
- Will only have 26 lowercase characters to worry about
- Root will have no character. Basically a placeholder here.
- If a letter is not marked blue, then it is not a word inserted.
- This StartsWith function is the main reason we're even implementing a trie in the first place
	- This is because if we want to insert words and search for words exist, could just use a HashMaps or HashSets as it can do both of those things in O(1) time 
		- #question is there a difference between HashMap and HashSet?
- The StartsWith function is going to be much more efficient compared to other data structures
	- O(26) is basically O(1) so it's a super efficient way to check prefixes which is why it's called a prefix tree
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.endOfWord = False

class PrefixTree:

    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        cur = self.root

        for c in word:
            if c not in cur.children:
                cur.children[c] = TrieNode()
            cur = cur.children[c]
        cur.endOfWord = True

    def search(self, word: str) -> bool:
        cur = self.root

        for c in word:
            if c not in cur.children:
                return False
            cur = cur.children[c]
        return cur.endOfWord
        

    def startsWith(self, prefix: str) -> bool:
        cur = self.root

        for c in prefix:
            if c not in cur.children:
                return False
            cur = cur.children[c]
        return True
```
## Source[^2]
### (1) Prefix Tree (Array)
```python
class TrieNode:
    def __init__(self):
        self.children = [None] * 26
        self.endOfWord = False

class PrefixTree:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        cur = self.root
        for c in word:
            i = ord(c) - ord("a")
            if cur.children[i] == None:
                cur.children[i] = TrieNode()
            cur = cur.children[i]
        cur.endOfWord = True

    def search(self, word: str) -> bool:
        cur = self.root
        for c in word:
            i = ord(c) - ord("a")
            if cur.children[i] == None:
                return False
            cur = cur.children[i]
        return cur.endOfWord

    def startsWith(self, prefix: str) -> bool:
        cur = self.root
        for c in prefix:
            i = ord(c) - ord("a")
            if cur.children[i] == None:
                return False
            cur = cur.children[i]
        return True
```
Time Complexity: $O(n)$ for each function call
Space Complexity: $O(t)$
- Where $n$ is the length of the string and $t$ is the total number of TrieNodes created in the Trie

### (2) Prefix Tree (Hash Map)
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.endOfWord = False

class PrefixTree:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        cur = self.root
        for c in word:
            if c not in cur.children:
                cur.children[c] = TrieNode()
            cur = cur.children[c]
        cur.endOfWord = True

    def search(self, word: str) -> bool:
        cur = self.root
        for c in word:
            if c not in cur.children:
                return False
            cur = cur.children[c]
        return cur.endOfWord

    def startsWith(self, prefix: str) -> bool:
        cur = self.root
        for c in prefix:
            if c not in cur.children:
                return False
            cur = cur.children[c]
        return True
```
Time Complexity: $O(n)$ for each function call.
Space Complexity: $O(t)$
- Where $n$ is the length of the string and $t$ is the total number of TrieNodes created in the Trie.
## References

[^1]: [Implement Trie (Prefix Tree) - Leetcode 208](https://www.youtube.com/watch?v=oobqoCJlHA0)
[^2]: https://neetcode.io/solutions/implement-trie-prefix-tree