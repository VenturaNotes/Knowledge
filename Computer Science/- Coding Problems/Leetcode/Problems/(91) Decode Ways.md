---
Source:
  - https://leetcode.com/problems/decode-ways/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- Can't have a string start with 0
- Brute force approach
- Given the [[decision tree]] the time complexity is $O(2^n)$ 
- The dimension of our cache is going to be `n`
- The size of time complexity and memory is O(n)
	- In the actual dynamic programming solution, it can be solved with $O(1)$ memory
	- Similar to house robber problem or fibonacci sequence problem

This is the recursive caching solution, the O(n) time memory solution
```python
 class Solution:
    def numDecodings(self, s: str) -> int:
        dp = {len(s) : 1}

        def dfs(i):
            if i in dp:
                return dp[i]
            if s[i] == "0":
                return 0
            
            res = dfs(i + 1)
            if (i + 1 < len(s) and (s[i] == "1" or 
                s[i] == "2" and s[i + 1] in "0123456")):
                res += dfs(i + 2)
            dp[i] = res
            return res
        return dfs(0)
```

This is the actual dynamic programming solution. Doing bottom-up
```python
class Solution:
    def numDecodings(self, s: str) -> int:
        dp = {len(s) : 1}

        for i in range(len(s) - 1, -1, -1):
            if s[i] == "0":
                dp[i] = 0
            else:
                dp[i] = dp[i + 1]
            
            if (i + 1 < len(s) and (s[i] == "1" or 
                s[i] == "2" and s[i + 1] in "0123456")):
                    dp[i] += dp[i+2]
        return dp[0]
```
- Memory is $O(n)$ here
## Source[^2]
### (1) Recursion
```python
class Solution:
    def numDecodings(self, s: str) -> int:
        
        def dfs(i):
            if i == len(s):
                return 1
            if s[i] == '0':
                return 0

            res = dfs(i + 1)
            if i < len(s) - 1:
                if (s[i] == '1' or 
                   (s[i] == '2' and s[i + 1] < '7')):
                    res += dfs(i + 2)

            return res

        return dfs(0)
```
Time Complexity: $O(2^n)$
Space Complexity: $O(n)$
### (2) Dynamic Programming (Top-Down)
```python
class Solution:
    def numDecodings(self, s: str) -> int:
        dp = {len(s) : 1}

        def dfs(i):
            if i in dp:
                return dp[i]
            if s[i] == "0":
                return 0

            res = dfs(i + 1)
            if i + 1 < len(s) and (
                s[i] == "1" or s[i] == "2" and
                s[i + 1] in "0123456"
            ):
                res += dfs(i + 2)
            dp[i] = res
            return res

        return dfs(0)
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
### (3) Dynamic Programming (Bottom-Up)
```python
class Solution:
    def numDecodings(self, s: str) -> int:
        dp = {len(s): 1}
        for i in range(len(s) - 1, -1, -1):
            if s[i] == "0":
                dp[i] = 0
            else:
                dp[i] = dp[i + 1]

            if i + 1 < len(s) and (s[i] == "1" or
               s[i] == "2" and s[i + 1] in "0123456"
            ):
                dp[i] += dp[i + 2]
        return dp[0]
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
### (4) Dynamic Programming (Space Optimized)
```python
class Solution:
    def numDecodings(self, s: str) -> int:
        dp = dp2 = 0
        dp1 = 1
        for i in range(len(s) - 1, -1, -1):
            if s[i] == "0":
                dp = 0
            else:
                dp = dp1

            if i + 1 < len(s) and (s[i] == "1" or
               s[i] == "2" and s[i + 1] in "0123456"
            ):
                dp += dp2
            dp, dp1, dp2 = 0, dp, dp1
        return dp1
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$
## References

[^1]: https://www.youtube.com/watch?v=6aEyTjOwlJU
[^2]: https://neetcode.io/solutions/decode-ways