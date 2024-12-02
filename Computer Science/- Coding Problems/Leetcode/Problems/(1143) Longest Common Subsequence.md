---
Source:
  - https://leetcode.com/problems/longest-common-subsequence/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-01 at 2.53.03 AM.png]]
- One of the most popular [[dynamic programming]] problems
- A [[subsequence]] of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters. (eg, "`ace`" is a subsequence of "`abcde`" while "`aec`"  is not). A [[common subsequence]] of two strings is a subsequence that is common to both strings. 
- This will be a 2-Dimensional dynamic programming solution
- We go diagonally when finding a match
- This will be a [[bottom-up dynamic programming]] solution
```python
class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        dp = [[0 for j in range(len(text2 )+1)] for i in range(len(text1) +1)]

        for i in range(len(text1) - 1, -1, -1):
            for j in range(len(text2) - 1, -1, -1):
                if text1[i] == text2[j]:
                    dp[i][j] = 1 + dp[i + 1][j+1]
                else:
                    dp[i][j] = max(dp[i][j+1], dp[i + 1][j])
        return dp[0][0]
```
- Using [[List comprehension (Python)|list comprehension]] in python here
- Time complexity: $O(n*m)$ as well as memory complexity
## References

[^1]: https://www.youtube.com/watch?v=Ua0GhsJSlWM