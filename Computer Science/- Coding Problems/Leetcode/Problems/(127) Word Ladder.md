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
## References

[^1]: https://www.youtube.com/watch?v=h9iTnkgv05E