---
Source:
  - https://leetcode.com/problems/burst-balloons/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-01 at 4.38.51 AM.png]]
- [[dynamic programming]] problem with $O(n^3)$ time complexity
	- $O(n^2)$ memory complexity
- Brute force would be a [[decision tree]]
	- So time complexity would be $n^n$ which is not super efficient
- Creating a 2 dimensional [[cache]]
- Choosing which one to pop last
- Taking total number of subarray $n^2$ and multiplying by another $n$ because we have to iterate through every single value for a given subarray
	- $O(n^2*n) = O(n^3)$ 
```python
class Solution:
    def maxCoins(self, nums: List[int]) -> int:
        nums = [1] + nums + [1]
        dp = {}

        def dfs (l, r):
            if l > r:
                return 0
            if (l, r) in dp:
                return dp[(l, r)]
            
            dp[(l, r)] = 0
            for i in range(l, r + 1):
                coins = nums[l - 1] * nums[i] * nums[r + 1]
                coins += dfs(l, i - 1) + dfs(i + 1, r)
                dp[(l, r)] = max(dp[(l, r)], coins)
            return dp[(l, r)]

        return dfs(1, len(nums) - 2)
```
## References

[^1]: https://www.youtube.com/watch?v=VFskby7lUbw