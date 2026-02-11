---
Source:
  - https://leetcode.com/problems/word-break/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-29 at 6.47.11 PM.png]]
- The max size of `wordDict` will be smaller than max size of `s` so $(n*m)$ would be more efficient (although the proper would be $O(n*m*n$ ))
- Will do decision tree $\to$ cache $\to$ DP
```python
class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        dp = [False]*(len(s) + 1)
        dp[len(s)] = True

        for i in range(len(s) - 1, -1, -1):
            for w in wordDict:
                if (i + len(w)) <= len(s) and s[i : i + len(w)] == w:
                    dp[i] = dp[i + len(w)]
                if dp[i]:
                    break
        return dp[0]
```
## Source[^2]
### (1) Recursion
```python
class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:

        def dfs(i):
            if i == len(s):
                return True
            
            for w in wordDict:
                if ((i + len(w)) <= len(s) and 
                     s[i : i + len(w)] == w
                ):
                    if dfs(i + len(w)):
                        return True
            return False
        
        return dfs(0)
```
Time Complexity: $O(t*m^n)$
Space Complexity: $O(n)$
- Where $n$ is the length of the string $s$, $m$ is the number of words in $wordDict$ and $t$ is the maximum length of any word in $wordDict$.
### (2) Recursion (Hash Set)
```python
class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        wordSet = set(wordDict)

        def dfs(i):
            if i == len(s):
                return True
            
            for j in range(i, len(s)):
                if s[i : j + 1] in wordSet:
                    if dfs(j + 1):
                        return True
            return False
        
        return dfs(0)
```
Time Complexity: $O((n*2^n)+m)$
Space Complexity: $O(n+(m*t))$
- Where $n$ is the length of the string $s$ and $m$ is the number of words in $wordDict$
### (3) Dynamic Programming (Top-Down)
```python
class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        memo = {len(s) : True}
        def dfs(i):
            if i in memo:
                return memo[i]
            
            for w in wordDict:
                if ((i + len(w)) <= len(s) and 
                     s[i : i + len(w)] == w
                ):
                    if dfs(i + len(w)):
                        memo[i] = True
                        return True
            memo[i] = False
            return False
        
        return dfs(0)
```
Time Complexity: $O(n*m*t)$
Space Complexity: $O(n)$
- Where $n$ is the length of the string $s$, $m$ is the number of words in $wordDict$ and $t$ is the maximum length of any word in $wordDict$
### (4) Dynamic Programming (Hash Set)
```python
class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        wordSet = set(wordDict)
        t = 0
        for w in wordDict:
            t = max(t, len(w))

        memo = {}
        def dfs(i):
            if i in memo:
                return memo[i]
            if i == len(s):
                return True
            for j in range(i, min(len(s), i + t)):
                if s[i : j + 1] in wordSet:
                    if dfs(j + 1):
                        memo[i] = True
                        return True
            memo[i] = False
            return False
        
        return dfs(0)
```
Time Complexity: $O((t^2*n)+m)$
Space Complexity: $O(n+(m*t))$
- Where $n$ is the length of the string $s$, $m$ is the number of words in $wordDict$ and $t$ is the maximum length of any word in $wordDict$
### (5) Dynamic Programming (Bottom-Up)
```python
class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        dp = [False] * (len(s) + 1)
        dp[len(s)] = True

        for i in range(len(s) - 1, -1, -1):
            for w in wordDict:
                if (i + len(w)) <= len(s) and s[i : i + len(w)] == w:
                    dp[i] = dp[i + len(w)]
                if dp[i]:
                    break

        return dp[0]
```
Time Complexity: $O(n*m*t)$
Space Complexity: $O(n)$
- Where $n$ is the length of the string $s$, $m$ is the number of words in $wordDict$ and $t$ is the maximum length of any word in $wordDict$
### (6) Dynamic Programming (Trie)
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_word = True

    def search(self, s, i, j):
        node = self.root
        for idx in range(i, j + 1):
            if s[idx] not in node.children:
                return False
            node = node.children[s[idx]]
        return node.is_word

class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        trie = Trie()
        for word in wordDict:
            trie.insert(word)

        dp = [False] * (len(s) + 1)
        dp[len(s)] = True

        t = 0
        for w in wordDict:
            t = max(t, len(w))
        
        for i in range(len(s), -1, -1):
            for j in range(i, min(len(s), i + t)):
                if trie.search(s, i, j):
                    dp[i] = dp[j + 1]
                    if dp[i]:
                        break

        return dp[0]
```
Time Complexity: $O((n*t^2)+m)$
Space Complexity: $O(n+(m*t))$
- Where $n$ is the length of the string $s$, $m$ is the number of words in $wordDict$ and $t$ is the maximum length of any word in $wordDict$ 
## References

[^1]: [Word Break - Dynamic Programming - Leetcode 139 - Python](https://www.youtube.com/watch?v=Sx9NNgInc3A)
[^2]: https://neetcode.io/solutions/word-break