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
## References

[^1]: https://www.youtube.com/watch?v=Sx9NNgInc3A