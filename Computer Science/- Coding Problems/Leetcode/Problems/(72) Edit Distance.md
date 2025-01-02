---
Source:
  - https://leetcode.com/problems/edit-distance/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-01 at 4.28.16 AM.png]]
- Similar to longest common subsequence (LCS)
- This is a [[dynamic programming]] problem
```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        cache = [[float("inf")]*(len(word2) + 1) for i in range(len(word1) + 1)]
        
        for j in range(len(word2)+1):
            cache[len(word1)][j] = len(word2) - j
        for i in range(len(word1) + 1):
            cache[i][len(word2)] = len(word1) - i
        
        for i in range(len(word1) - 1, -1, -1):
            for j in range(len(word2)- 1, -1, -1):
                if word1[i] == word2[j]:
                    cache[i][j] = cache[i + 1][j + 1]
                else:
                    cache[i][j] = 1 + min(cache[i + 1][j], cache[i][j+1], cache[i+1][j+1])
        return cache[0][0]
```
## References

[^1]: https://www.youtube.com/watch?v=XYi2-LPrwm4