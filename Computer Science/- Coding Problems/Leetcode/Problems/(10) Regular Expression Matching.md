---
Source:
  - https://leetcode.com/problems/regular-expression-matching
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-01 at 4.53.53 AM.png]]
- Star is where the complexity mainly comes from
- This is a [[dynamic programming]] problem.
- Using a decision tree, the time complexity would be $2^n$. However, if we implement with a cache, we can get the time complexity down to $O(n^2)$ or $O(n*m)$ where `n` is the length of the input string and `m` is the length of the pattern
	- This is if we do [[top-down memoization]] with cache
	- Could also do [[bottom-up dynamic programming]] solution
	- Both have same time complexity
- If `j` is out of bounds, must return false. If `i` is out of bounds, do not need to return false as the `*` could make it so the next character does not need to be returned.
```python
class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        # TOP-Down Memoization
            
        def dfs(i, j):
            if i >= len(s) and j >= len(p):
                return True
            if j >= len(p):
                return False
            
            match = i < len(s) and (s[i] == p[j] or p[j] == ".")
            if (j + 1) < len(p) and p[j + 1] == "*":
                return (dfs(i, j + 2) or # don't use *
                        (match and dfs(i + 1, j))) # use *
            if match:
                return dfs(i + 1, j + 1)

            return False
        return dfs(0, 0)
```
- Above is solution without caching
```python
class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        # TOP-Down Memoization
        
        cache = {}

        def dfs(i, j):
            if (i, j) in cache:
                return cache[(i, j)]

            if i >= len(s) and j >= len(p):
                return True
            if j >= len(p):
                return False
            
            match = i < len(s) and (s[i] == p[j] or p[j] == ".")
            if (j + 1) < len(p) and p[j + 1] == "*":
                cache[(i, j)] = (dfs(i, j + 2) or # don't use *
                        (match and dfs(i + 1, j))) # use *
                return cache[(i, j)]
            if match:
                cache[(i, j)] = dfs(i + 1, j + 1)
                return cache[(i, j)]

            cache[(i, j)] = False
            return False
        return dfs(0, 0)        
```
- Above adds caching
## References

[^1]: https://www.youtube.com/watch?v=HAA8mgxlov8