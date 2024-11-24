---
Source:
  - https://leetcode.com/problems/decode-ways/
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
## References

[^1]: https://www.youtube.com/watch?v=6aEyTjOwlJU