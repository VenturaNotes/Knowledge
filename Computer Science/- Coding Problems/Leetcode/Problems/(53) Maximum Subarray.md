---
Source:
  - https://leetcode.com/problems/maximum-subarray/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-30 at 2.44.50 AM.png]]
- Brute force solution is $O(n^3)$ 
- $O(n^2)$ is an optimization
- Any time we think of a negative prefix, we remove it
	- Helps to think of this problem as a [[sliding window]]
	- Time complexity: $O(n)$
```python
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        maxSub = nums[0]
        curSum = 0

        for n in nums:
            if curSum < 0:
                curSum = 0
            curSum += n
            maxSub = max(maxSub, curSum)
        return maxSub
```
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        n, res = len(nums), nums[0]
        for i in range(n):
            cur = 0
            for j in range(i, n):
                cur += nums[j]
                res = max(res, cur)
        return res
```
Time Complexity: $O(n^2)$
Space Complexity: $O(1)$
### (2) Recursion
```python
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        def dfs(i, flag):
            if i == len(nums):
                return 0 if flag else -1e6
            if flag:
                return max(0, nums[i] + dfs(i + 1, True))
            return max(dfs(i + 1, False), nums[i] + dfs(i + 1, True))
        return dfs(0, False)
```
Time Complexity: $O(2^n)$
Space Complexity: $O(n)$
### (3) Dynamic Programming (Top-Down)
```python
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        memo = [[None] * 2 for _ in range(len(nums) + 1)]

        def dfs(i, flag):
            if i == len(nums):
                return 0 if flag else -1e6
            if memo[i][flag] is not None:
                return memo[i][flag]
            if flag:
                memo[i][flag] = max(0, nums[i] + dfs(i + 1, True))
            else:
                memo[i][flag] = max(dfs(i + 1, False), 
                                    nums[i] + dfs(i + 1, True))
            return memo[i][flag]

        return dfs(0, False)
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
### (4) Dynamic Programming (Bottom-Up)
```python
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        n = len(nums)
        dp = [[0] * 2 for _ in range(n)]
        dp[n - 1][1] = dp[n - 1][0] = nums[n - 1]
        for i in range(n - 2, -1, -1):
            dp[i][1] = max(nums[i], nums[i] + dp[i + 1][1])
            dp[i][0] = max(dp[i + 1][0], dp[i][1])
        
        return dp[0][0]
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$

### (5) Dynamic Programming (Space Optimized)
```python
class Solution:
    def maxSubArray(self, nums):
        dp = [*nums]
        for i in range(1, len(nums)):
            dp[i] = max(nums[i], nums[i] + dp[i - 1])
        return max(dp)
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$

### (6) Kadane's Algorithm
```python
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        maxSub, curSum = nums[0], 0
        for num in nums:
            if curSum < 0:
                curSum = 0
            curSum += num
            maxSub = max(maxSub, curSum)
        return maxSub
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$
### (7) Divide & Conquer
```python
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        def dfs(l, r):
            if l > r:
                return float("-inf")

            m = (l + r) >> 1
            leftSum = rightSum = curSum = 0
            for i in range(m - 1, l - 1, -1):
                curSum += nums[i]
                leftSum = max(leftSum, curSum)

            curSum = 0
            for i in range(m + 1, r + 1):
                curSum += nums[i]
                rightSum = max(rightSum, curSum)

            return (max(dfs(l, m - 1), 
                        dfs(m + 1, r), 
                        leftSum + nums[m] + rightSum))
                        
        return dfs(0, len(nums) - 1)
```
Time Complexity: $O(nlogn)$
Space Complexity $O(logn)$
## References

[^1]: https://www.youtube.com/watch?v=5WZl3MMT0Eg
[^2]: https://neetcode.io/solutions/maximum-subarray