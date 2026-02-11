---
Source:
  - https://leetcode.com/problems/word-ladder/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-24 at 1.34.53 AM.png]]
- Given a `beginWord`, `endword`, and `wordList`
- Every adjacent pair of words differs by a single letter
- In example: `hit` can be connected to any of the words in the word list where it has a single character difference
	- Some constraints we're given is that `len(w) <= 10` and `len(list) <= 5000`
- The naive solution to create the adjacency list would be $O(n^2m)$ where you loop through the list `n` and the number of characters for each string will be `m`
	- Unfortunately, this won't pass on LeetCode
- Will use [[Breadth First Search|BFS]] to find shortest path.
- Will use $O(n*m^2)$ to generate adjacency list.
	- And then use BFS with the time complexity of $O(n^2*m)$ 
```python
class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        if endWord not in wordList:
            return 0
        
        nei = collections.defaultdict(list)
        wordList.append(beginWord)
        for word in wordList:
            for j in range(len(word)):
                pattern = word[:j] + "*" + word[j + 1:]
                nei[pattern].append(word)
        
        visit = set([beginWord])
        q = deque([beginWord])
        res = 1
        while q:
            for i in range(len(q)):
                word = q.popleft()
                if word == endWord:
                    return res
                for j in range(len(word)):
                    pattern = word[:j] + "*" + word[j + 1:]
                    for neiWord in nei[pattern]:
                        if neiWord not in visit:
                            visit.add(neiWord)
                            q.append(neiWord)
            res += 1
        return 0
```
## Source[^2]
## (1) Breadth First Search - I
```python
class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        if (endWord not in wordList) or (beginWord == endWord):
            return 0
        
        n, m = len(wordList), len(wordList[0])
        adj = [[] for _ in range(n)]
        mp = {}
        for i in range(n):
            mp[wordList[i]] = i

        for i in range(n):
            for j in range(i + 1, n):
                cnt = 0
                for k in range(m):
                    if wordList[i][k] != wordList[j][k]:
                        cnt += 1
                if cnt == 1:
                    adj[i].append(j)
                    adj[j].append(i)
        
        q, res = deque(), 1
        visit = set()
        for i in range(m):
            for c in range(97, 123):
                if chr(c) == beginWord[i]:
                    continue
                word = beginWord[:i] + chr(c) + beginWord[i + 1:]
                if word in mp and mp[word] not in visit:
                    q.append(mp[word])
                    visit.add(mp[word])
        
        while q:
            res += 1
            for i in range(len(q)):
                node = q.popleft()
                if wordList[node] == endWord:
                    return res
                for nei in adj[node]:
                    if nei not in visit:
                        visit.add(nei)
                        q.append(nei)
            
        return 0
```
Time Complexity: $O(n^2*m)$
Space Complexity: $O(n^2)$
- Where $n$ is the number of words and $m$ is the length of the word.
### (2) Breadth First Search - II
```python
class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        if (endWord not in wordList) or (beginWord == endWord):
            return 0
        words, res = set(wordList), 0
        q = deque([beginWord])
        while q:
            res += 1
            for _ in range(len(q)):
                node = q.popleft()
                if node == endWord:
                    return res
                for i in range(len(node)):
                    for c in range(97, 123):
                        if chr(c) == node[i]:
                            continue
                        nei = node[:i] + chr(c) + node[i + 1:]
                        if nei in words:
                            q.append(nei)
                            words.remove(nei)
        return 0
```
Time Complexity: $O(m^2*n)$
Space Complexity: $O(m^2*n)$
- Where $n$ is the number of words and $m$ is the length of the word
### (3) Breadth First Search - III
```python
class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        if endWord not in wordList:
            return 0

        nei = collections.defaultdict(list)
        wordList.append(beginWord)
        for word in wordList:
            for j in range(len(word)):
                pattern = word[:j] + "*" + word[j + 1 :]
                nei[pattern].append(word)

        visit = set([beginWord])
        q = deque([beginWord])
        res = 1
        while q:
            for i in range(len(q)):
                word = q.popleft()
                if word == endWord:
                    return res
                for j in range(len(word)):
                    pattern = word[:j] + "*" + word[j + 1 :]
                    for neiWord in nei[pattern]:
                        if neiWord not in visit:
                            visit.add(neiWord)
                            q.append(neiWord)
            res += 1
        return 0
```
Time Complexity: $O(m^2*n)$
Space Complexity: $O(m^2*n)$
- Where $n$ is the number of words and $m$ is the length of the word
### (4) Meet in The Middle (BFS)
```python
class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        if endWord not in wordList or beginWord == endWord:
            return 0
        m = len(wordList[0])
        wordSet = set(wordList)
        qb, qe = deque([beginWord]), deque([endWord])
        fromBegin, fromEnd = {beginWord: 1}, {endWord: 1}
        
        while qb and qe:
            if len(qb) > len(qe):
                qb, qe = qe, qb
                fromBegin, fromEnd = fromEnd, fromBegin
            for _ in range(len(qb)):
                word = qb.popleft()
                steps = fromBegin[word]
                for i in range(m):
                    for c in range(97, 123):
                        if chr(c) == word[i]:
                            continue
                        nei = word[:i] + chr(c) + word[i + 1:]
                        if nei not in wordSet:
                            continue
                        if nei in fromEnd:
                            return steps + fromEnd[nei]
                        if nei not in fromBegin:
                            fromBegin[nei] = steps + 1
                            qb.append(nei)
        return 0
```
Time Complexity: $O(m^2*n)$
Space Complexity: $O(m^2*n)$
- Where $n$ is the number of words and $m$ is the length of the word
## References

[^1]: [Word Ladder - Breadth First Search - Leetcode 127 - Python](https://www.youtube.com/watch?v=h9iTnkgv05E)
[^2]: https://neetcode.io/solutions/word-ladder