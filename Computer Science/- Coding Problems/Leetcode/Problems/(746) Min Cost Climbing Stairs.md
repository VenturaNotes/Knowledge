---
Source:
  - https://leetcode.com/problems/min-cost-climbing-stairs/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-24 at 2.18.19 AM.png]]
- Can't be greedy with this problem
- [[decision tree]] great to draw when brute forcing
- The max height of this tree is `n = length of cost array`
	- And we know that we could have 2 branches for every single node
	- So time complexity comes to $O(2^n)$ 
- We could get time complexity to $O(n)$ due to repeated work
- Can [[cache]] the recursive solution to get an iterative solution with same time and memory complexity
- Will also be $O(n)$ complexity for memory
- We can only start at index 0 or index 1. Can't start at index 2 or top of stair case
	- Could use memory complexity of $O(1)$ 
```python
class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        cost.append(0)

        for i in range(len(cost) - 3, -1, -1):
            cost[i] += min(cost[i+1], cost[i+2])
        
        # Guaranteed that cost array has at least 2 values
        return min(cost[0], cost[1])
```
## Source[^2]
### (1) Recursion
```python
class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        
        def dfs(i):
            if i >= len(cost):
                return 0
            return cost[i] + min(dfs(i + 1), dfs(i + 2))
        
        return min(dfs(0), dfs(1))
```
Time Complexity: $O(2^n)$
Space Complexity: $O(n)$

### (2) Dynamic Programming (Top-Down)
```python
class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        memo = [-1] * len(cost)
        
        def dfs(i):
            if i >= len(cost):
                return 0
            if memo[i] != -1:
                return memo[i]
            memo[i] = cost[i] + min(dfs(i + 1), dfs(i + 2))
            return memo[i]
        
        return min(dfs(0), dfs(1))
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
### (3) Dynamic Programming (Bottom-Up)
```python
class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        n = len(cost)
        dp = [0] * (n + 1)
        
        for i in range(2, n + 1):
            dp[i] = min(dp[i - 1] + cost[i - 1],
                        dp[i - 2] + cost[i - 2])
        
        return dp[n]
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
### (4) Dynamic Programming (Space Optimized)
```python
class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        for i in range(len(cost) - 3, -1, -1):
            cost[i] += min(cost[i + 1], cost[i + 2])

        return min(cost[0], cost[1])
```
- Time Complexity: $O(n)$
- Space Complexity: $O(1)$
## References

[^1]: [Min Cost Climbing Stairs - Dynamic Programming - Leetcode 746 - Python](https://www.youtube.com/watch?v=ktmzAZWkEZ0)
[^2]: https://neetcode.io/solutions/min-cost-climbing-stairs