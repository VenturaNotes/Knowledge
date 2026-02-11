---
Source:
  - https://leetcode.com/problems/partition-equal-subset-sum/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-29 at 9.39.49 PM.png]]
- Since every level of our [[decision tree]] we have 2 choices and the height of the decision tree is going to be for every single element. 
	- Therefore, the time complexity will be $2^n$ for the brute force method
- If we did a DFS solution with a cache like a backtracking solution with a cache,
	- The time and memory complexity would be $O(n*sum(nums))$ 
		- Sum would be dimensions of cache
- With DP, could improve memory complexity
- Trying to show a [[recurrence relation]]
- As long as set contains 11, we return true. If it doesn't, that means it's impossible to sum to target
	- Size of set would be about the same size of cache in memoization technique
	- Size of cache is going to be limited to size of target which is basically limited by sum of `nums` input array
		- Memory complexity: $O(sum(nums))$ 
		- Time complexity same as DFS solution
- Going through the brute force to the caching to the dynamic programming solution is the best thoughts process to arrive to this optimal solution
```python
class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        if sum(nums) % 2:
            return False
        
        dp = set()
        dp.add(0)
        target = sum(nums) // 2

        for i in range(len(nums) - 1, -1, -1):
            nextDP = set()
            for t in dp:
                if (t + nums[i]) == target:
                    return True
                nextDP.add(t + nums[i])
                nextDP.add(t)
            dp = nextDP
        return True if target in dp else False
```
- `if (t + nums[i]) == target:` might be an optimization that your interviewer may like but the time complexity is still the same
## Source[^2]
### (1) Recursion
```python
class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        if sum(nums) % 2:
            return False
        
        def dfs(i, target):
            if i >= len(nums):
                return target == 0
            if target < 0:
                return False
            
            return dfs(i + 1, target) or dfs(i + 1, target - nums[i])
        
        return dfs(0, sum(nums) // 2)
```
Time Complexity: $O(2^n)$
Space Complexity: $O(n)$
### (2) Dynamic Programming (Top-Down)
```python
class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        if sum(nums) % 2:
            return False
        
        def dfs(i, target):
            if i >= len(nums):
                return target == 0
            if target < 0:
                return False
            
            return dfs(i + 1, target) or dfs(i + 1, target - nums[i])
        
        return dfs(0, sum(nums) // 2)
```
Time Complexity: $O(n*target)$
Space Complexity: $O(n*target)$
- Where $n$ is the length of the array $nums$ and $target$ is the sum of array elements divided by 2.
### (3) Dynamic Programming (Bottom-Up)
```python
class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        total = sum(nums)
        if total % 2 != 0:
            return False

        target = total // 2
        n = len(nums)
        dp = [[False] * (target + 1) for _ in range(n + 1)]

        for i in range(n + 1):
            dp[i][0] = True

        for i in range(1, n + 1):
            for j in range(1, target + 1):
                if nums[i - 1] <= j:
                    dp[i][j] = (dp[i - 1][j] or 
                                dp[i - 1][j - nums[i - 1]])
                else:
                    dp[i][j] = dp[i - 1][j]

        return dp[n][target]
```
Time Complexity: $O(n*target)$
Space Complexity: $O(n*target)$
- Where $n$ is the length of the array $nums$ and $target$ is the sum of array elements divided by 2.
### (4) Dynamic Programming (Space Optimized)
```python
class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        if sum(nums) % 2:
            return False

        target = sum(nums) // 2
        dp = [False] * (target + 1)
        nextDp = [False] * (target + 1)

        dp[0] = True 
        for i in range(len(nums)):
            for j in range(1, target + 1):
                if j >= nums[i]:
                    nextDp[j] = dp[j] or dp[j - nums[i]]
                else:
                    nextDp[j] = dp[j]
            dp, nextDp = nextDp, dp
            
        return dp[target]
```
Time Complexity: $O(n*target)$
Space Complexity: $O(target)$
- Where $n$ is the length of the array $nums$ and $target$ is the sum of array elements divided by 2.
### (5) Dynamic Programming (Hash Set)
```python
class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        if sum(nums) % 2:
            return False

        dp = set()
        dp.add(0)
        target = sum(nums) // 2

        for i in range(len(nums) - 1, -1, -1):
            nextDP = set()
            for t in dp:
                if (t + nums[i]) == target:
                    return True
                nextDP.add(t + nums[i])
                nextDP.add(t)
            dp = nextDP
        return False
```
Time Complexity: $O(n*target)$
Space Complexity: $O(target)$
- Where $n$ is the length of the array $nums$ and $target$ is the sum of array elements divided by 2.

### (6) Dynamic Programming (Optimal)
```python
class Solution:
    def canPartition(self, nums: list[int]) -> bool:
        if sum(nums) % 2:
            return False

        target = sum(nums) // 2
        dp = [False] * (target + 1)

        dp[0] = True
        for num in nums:
            for j in range(target, num - 1, -1):
                dp[j] = dp[j] or dp[j - num]
                
        return dp[target]
```
Time Complexity: $O(n*target)$
Space Complexity: $O(target)$
- Where $n$ is the length of the array $nums$ and $target$ is the sum of array elements divided by 2.
### (7) Dynamic Programming (Bitset)
```python
class Solution:
    def canPartition(self, nums: list[int]) -> bool:
        total = sum(nums)
        if total % 2 != 0:
            return False

        target = total // 2
        dp = 1 << 0
        
        for num in nums:
            dp |= dp << num
            
        return (dp & (1 << target)) != 0
```
Time Complexity: $O(n*target)$
Space Complexity: $O(target)$
- Where $n$ is the length of the array $nums$ and $target$ is the sum of array elements divided by 2.
## References

[^1]: [Partition Equal Subset Sum - Dynamic Programming - Leetcode 416 - Python](https://www.youtube.com/watch?v=IsvocB5BJhw)
[^2]: https://neetcode.io/solutions/partition-equal-subset-sum