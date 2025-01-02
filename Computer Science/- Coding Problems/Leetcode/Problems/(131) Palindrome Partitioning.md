---
Source:
  - https://leetcode.com/problems/palindrome-partitioning/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-22 at 12.20.37 AM.png]]
- Want to partition `s` so that every single substring of the partition is a [[Palindromes|palindrome]]. Return all possible palindrome partitioning of `s`
	- A palindrome string is a string that reads the same backward as forward
- The brute force way to solve this problem also happens to be the main way to solve this problem
	- Will use [[backtracking]]
- Time complexity is $O(2^n)$
```python
class Solution:
    def partition(self, s: str) -> List[List[str]]:
        res = []
        part = []

        def dfs(i):
            if i >= len(s):
                res.append(part.copy())
                return
            for j in range(i, len(s)):
                if self.isPali(s, i, j):
                    part.append(s[i:j+1])
                    dfs(j + 1)
                    part.pop()
        dfs(0)
        return res
    def isPali(self, s, l, r):
        while l < r:
            if s[l] != s[r]:
                return False
            l, r = l + 1, r - 1
        return True
```
## References

[^1]: https://www.youtube.com/watch?v=3jvWodd7ht0