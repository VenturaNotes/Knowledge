---
Source:
  - https://leetcode.com/problems/distinct-subsequences/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-01 at 4.14.36 AM.png]]
- Will solve with [[dynamic programming]]
	- Similar to longest common subsequence (LCS)
- Will do this recursively with DFS or backtracking (whatever you want to call it)
	- Will use [[cache]] so we don't repeat the same work twice
- Memory and runtime complexity of algorithm is $O(n*m)$ 
- Will use recursive approach for this (which is top-down)
```python
class Solution:
    def numDistinct(self, s: str, t: str) -> int:
        cache = {}

        def dfs(i, j):
            if j == len(t):
                return 1
            if i == len(s):
                return 0
            if (i, j) in cache:
                return cache[(i, j)]
            
            if s[i] == t[j]:
                cache[(i, j)] = dfs(i + 1, j + 1) + dfs(i + 1, j)
            else:
                cache[(i, j)] = dfs(i + 1, j)
            return cache[(i, j)]
        return dfs(0, 0)
```
- #comment Problem initially incorrect with `i+i` being added. Found solution in comment section though
## References

[^1]: https://www.youtube.com/watch?v=-RDzMJ33nx8