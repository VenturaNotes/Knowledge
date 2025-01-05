---
Source:
  - https://leetcode.com/problems/house-robber/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-24 at 2.42.57 AM.png]]
- [[Google]] likes asking dynamic programming problems
- [[dynamic programming]] problem
- [[Decision tree]]
- `rob = max(arr[0] + rob[2:n], rob[1:n])`
	- This is the [[recurrence relationship]]
		- It's a way of breaking up dynamic programming problems
```python
class Solution:
    def rob(self, nums: List[int]) -> int:
        rob1, rob2 = 0, 0

        for n in nums:
            temp = max(n + rob1, rob2)
            rob1 = rob2
            rob2 = temp
        return rob2
```

## Source[^2]
### (1) Recursion
```python
class Solution:
    def rob(self, nums: List[int]) -> int:
        
        def dfs(i):
            if i >= len(nums):
                return 0
            return max(dfs(i + 1),
                       nums[i] + dfs(i + 2))
        
        return dfs(0)
```
Time Complexity: $O(2^n)$
Space Complexity: $O(n)$

### (2) Dynamic Programming (Top-Down)
```python
class Solution:
    def rob(self, nums: List[int]) -> int:
        memo = [-1] * len(nums)

        def dfs(i):
            if i >= len(nums):
                return 0
            if memo[i] != -1:
                return memo[i]
            memo[i] = max(dfs(i + 1), nums[i] + dfs(i + 2))
            return memo[i]
        
        return dfs(0)
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$

### (3) Dynamic Programming (Bottom-Up)
```python
class Solution:
    def rob(self, nums: List[int]) -> int:
        if not nums:
            return 0
        if len(nums) == 1:
            return nums[0]
        
        dp = [0] * len(nums)
        dp[0] = nums[0]
        dp[1] = max(nums[0], nums[1])
        
        for i in range(2, len(nums)):
            dp[i] = max(dp[i - 1], nums[i] + dp[i - 2])
        
        return dp[-1]
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$

### (4) Dynamic Programming (Space Optimized)
```python
class Solution:
    def rob(self, nums: List[int]) -> int:
        rob1, rob2 = 0, 0

        for num in nums:
            temp = max(num + rob1, rob2)
            rob1 = rob2
            rob2 = temp
        return rob2
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$
## References

[^1]: https://www.youtube.com/watch?v=73r3KWiEvyk
[^2]: https://neetcode.io/solutions/house-robber