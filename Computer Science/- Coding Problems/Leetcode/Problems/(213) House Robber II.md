---
Source:
  - https://leetcode.com/problems/house-robber-ii/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-24 at 2.48.47 AM.png]]
- Maximizing amount that we can rob. Only catch is that we can't rob two houses adjacent to each other. The houses are arranged in a circle here.
- Have to run the helper function twice on different subarrays of our input array because we're not allowed to rob the first and last house together.
	- Then all you have to do is call the helper function twice on the two subarrays
	- Whichever the one is the max is the value we will return
- Time complexity is $O(n)$ and memory complexity is $O(1)$ because we don't really need any extra data structures for the most part
```python
class Solution:
    def rob(self, nums: List[int]) -> int:
        # skipping first and last index
        # If we only have 1 house, need to include nums[0]
        return max(nums[0], self.helper(nums[1:]), self.helper(nums[:-1]))
        
    
    # in functions in python, you have to put self as one of the first
    # parameters
    def helper(self, nums):
        rob1, rob2 = 0, 0

        for n in nums:
            newRob = max(rob1 + n, rob2)
            rob1 = rob2
            rob2 = newRob
        return rob2
```
## Source[^2]
### (1) Recursion
```python
class Solution:
    def rob(self, nums: List[int]) -> int:
        if len(nums) == 1:
            return nums[0]
        def dfs(i, flag):
            if i >= len(nums) or (flag and i == len(nums) - 1):
                return 0
            
            return max(dfs(i + 1, flag), 
                       nums[i] + dfs(i + 2, flag or i == 0))
        return max(dfs(0, True), dfs(1, False))
```
Time Complexity: $O(2^n)$
Space Complexity: $O(n)$
### (2) Dynamic Programming (Top-Down)
```python
class Solution:
    def rob(self, nums: List[int]) -> int:
        if len(nums) == 1:
            return nums[0]

        memo = [[-1] * 2 for _ in range(len(nums))]

        def dfs(i, flag):
            if i >= len(nums) or (flag and i == len(nums) - 1):
                return 0
            if memo[i][flag] != -1:
                return memo[i][flag]
            memo[i][flag] = max(dfs(i + 1, flag), 
                            nums[i] + dfs(i + 2, flag or (i == 0)))
            return memo[i][flag]

        return max(dfs(0, True), dfs(1, False))
```
- Time Complexity: $O(n)$
- Space Complexity: $O(n)$
### (3) Dynamic Programming (Bottom-Up)
```python
class Solution:
    def rob(self, nums: List[int]) -> int:
        if len(nums) == 1:
            return nums[0]
        return max(self.helper(nums[1:]), 
                   self.helper(nums[:-1]))
    
    def helper(self, nums: List[int]) -> int:
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
        return max(nums[0], self.helper(nums[1:]), 
                            self.helper(nums[:-1]))

    def helper(self, nums):
        rob1, rob2 = 0, 0

        for num in nums:
            newRob = max(rob1 + num, rob2)
            rob1 = rob2
            rob2 = newRob
        return rob2
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$
## References

[^1]: [House Robber II - Dynamic Programming - Leetcode 213](https://www.youtube.com/watch?v=rWAJCfYYOvM)
[^2]: https://neetcode.io/solutions/house-robber-ii