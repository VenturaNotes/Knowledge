---
Source:
  - https://leetcode.com/problems/target-sum/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-01 at 3.43.33 AM.png]]
- Brute force solution is $2^n$ 
- `t` is the sum of entire array if we perform caching using the pair of values `(index, total)`
	- Time complexity: $O(n*t)$
- Easy to implement caching when coded up recursive solution
```python
class Solution:
    def findTargetSumWays(self, nums: List[int], target: int) -> int:
        dp = {} # (index, total) -> # of ways

        def backtrack(i, total):
            if i == len(nums):
                return 1 if total == target else 0
            if (i, total) in dp:
                return dp[(i, total)]
            dp[(i, total)] = (backtrack(i + 1, total + nums[i]) + 
                                backtrack(i + 1, total - nums[i]))
            return dp[(i, total)]
        return backtrack(0, 0)
```
- Could use a [[ternary operator]] here
## References

[^1]: https://www.youtube.com/watch?v=g0npyaQtAQM