---
Source:
  - https://leetcode.com/problems/longest-common-subsequence/
Reviewed: false
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

## Source[^2]
### (1) Recursion
```python
class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        
        def dfs(i, j):
            if i == len(text1) or j == len(text2):
                return 0
            if text1[i] == text2[j]:
                return 1 + dfs(i + 1, j + 1)
            return max(dfs(i + 1, j), dfs(i, j + 1))
        
        return dfs(0, 0)
```
Time complexity: $O(2^{m+n})$
Space Complexity: $O(m+n)$
- Where $m$ is the length of the string $text1$ and $n$ is the length of the string $text2$
### (2) Dynamic Programming (Top-Down)
```python
class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        memo = {}

        def dfs(i, j):
            if i == len(text1) or j == len(text2):
                return 0
            if (i, j) in memo:
                return memo[(i, j)]
            
            if text1[i] == text2[j]:
                memo[(i, j)] = 1 + dfs(i + 1, j + 1)
            else:
                memo[(i, j)] = max(dfs(i + 1, j), dfs(i, j + 1))
                
            return memo[(i, j)]
        
        return dfs(0, 0)
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m*n)$
### (3) Dynamic Programming (Bottom-Up)
```python
class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        dp = [[0 for j in range(len(text2) + 1)] 
                 for i in range(len(text1) + 1)]

        for i in range(len(text1) - 1, -1, -1):
            for j in range(len(text2) - 1, -1, -1):
                if text1[i] == text2[j]:
                    dp[i][j] = 1 + dp[i + 1][j + 1]
                else:
                    dp[i][j] = max(dp[i][j + 1], dp[i + 1][j])

        return dp[0][0]
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m*n)$
- Where $m$ is the length of the string $text1$ and $n$ is the length of the string $text2$
### (4) Dynamic Programming (Space Optimized)
```python
class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        if len(text1) < len(text2):
            text1, text2 = text2, text1
            
        prev = [0] * (len(text2) + 1)
        curr = [0] * (len(text2) + 1)

        for i in range(len(text1) - 1, -1, -1):
            for j in range(len(text2) - 1, -1, -1):
                if text1[i] == text2[j]:
                    curr[j] = 1 + prev[j + 1]
                else:
                    curr[j] = max(curr[j + 1], prev[j])
            prev, curr = curr, prev

        return prev[0]
```
Time Complexity: $O(m*n)$
Space Complexity: $O(min(m,n))$
- Where $m$ is the length of the string $text1$ and $n$ is the length of the string $text2$
### (5) Dynamic Programming (Optimal)
```python
class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        if len(text1) < len(text2):
            text1, text2 = text2, text1

        dp = [0] * (len(text2) + 1)

        for i in range(len(text1) - 1, -1, -1):
            prev = 0
            for j in range(len(text2) - 1, -1, -1):
                temp = dp[j]
                if text1[i] == text2[j]:
                    dp[j] = 1 + prev
                else:
                    dp[j] = max(dp[j], dp[j + 1])
                prev = temp

        return dp[0]
```
Time Complexity: $O(m*n)$
Space Complexity: $O(min(m,n))$
- Where $m$ is the length of the string $text1$ and $n$ is the length of the string $text2$
## References

[^1]: [Longest Common Subsequence - Dynamic Programming - Leetcode 1143](https://www.youtube.com/watch?v=Ua0GhsJSlWM)
[^2]: https://neetcode.io/solutions/longest-common-subsequence