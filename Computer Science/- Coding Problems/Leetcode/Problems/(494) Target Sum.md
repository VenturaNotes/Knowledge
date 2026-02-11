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
## Source[^2]
### (1) Recursion
```python
class Solution:
    def findTargetSumWays(self, nums: List[int], target: int) -> int:
        
        def backtrack(i, total):
            if i ==len(nums):
                return  total == target
            
            return (backtrack(i + 1, total + nums[i]) + 
                    backtrack(i + 1, total - nums[i]))
                
        return backtrack(0, 0)
```
Time Complexity: $O(2^n)$
Space Complexity: $O(n)$
### (2) Dynamic Programming (Top-Down)
```python
class Solution:
    def findTargetSumWays(self, nums: List[int], target: int) -> int:
        dp = {}  # (index, total) -> # of ways

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
Time Complexity: $O(n*m)$
Space Complexity: $O(n*m)$
- Where $n$ is the length of the array $nums$ and $m$ is the sum of all the elements in the array
### (3) Dynamic Programming (Bottom-Up)
```python
class Solution:
    def findTargetSumWays(self, nums: List[int], target: int) -> int:
        n = len(nums)
        dp = [defaultdict(int) for _ in range(n + 1)]
        dp[0][0] = 1

        for i in range(n):
            for total, count in dp[i].items():
                dp[i + 1][total + nums[i]] += count
                dp[i + 1][total - nums[i]] += count

        return dp[n][target]
```
Time Complexity: $O(n*m)$
Space Complexity: $O(n*m)$
- Where $n$ is the length of the array $nums$ and $m$ is the sum of all the elements in the array
### (4) Dynamic Programming (Space Optimized)
```python
class Solution:
    def findTargetSumWays(self, nums: List[int], target: int) -> int:
        dp = defaultdict(int)
        dp[0] = 1

        for num in nums:
            next_dp = defaultdict(int)
            for total, count in dp.items():
                next_dp[total + num] += count
                next_dp[total - num] += count
            dp = next_dp
            
        return dp[target]
```
Time Complexity: $O(n*m)$
Space Complexity: $O(m)$
- Where $n$ is the length of the array $nums$ and $m$ is the sum of all the elements in the array
## References

[^1]: [Target Sum - Dynamic Programming - Leetcode 494 - Python](https://www.youtube.com/watch?v=g0npyaQtAQM)
[^2]: https://neetcode.io/solutions/target-sum