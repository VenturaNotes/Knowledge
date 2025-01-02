---
Source:
  - https://leetcode.com/problems/combination-sum-ii/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-21 at 9.31.34 PM.png]]
- 3 sum is part of the Neetcode 150 list
- Don't want duplicate combinations in solution set
- Can't use the same number an unlimited number of times
	- We can use it multiple times though if it shows up multiple times in the input
- Sort input array first (which will be positive anyway)
- Overall time complexity is $O(n2^n)$ 
	- When adding to result, will create a copy of every single array
- Can't apply dynamic programming to this
- Overall memory is O(n) for any individual combination or for the size of the recursive call stack
```python
class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        res = []
        candidates.sort()

        def dfs(i, cur, total):
            if total == target:
                    res.append(cur.copy())
                    return
            if total > target or i == len(candidates):
                return
            
            # include candidates[i]
            cur.append(candidates[i])
            dfs(i + 1, cur, total + candidates[i])
            cur.pop()

            # skip candidates[i]
            # [1, 1, 1, 1, 1]
            while i + 1 < len(candidates) and candidates[i] == candidates[i+1]:
                i += 1
            dfs(i + 1, cur, total)
        dfs(0, [], 0)
        return res

```
## References

[^1]: https://www.youtube.com/watch?v=FOyRpNUSFeA