---
Source:
  - https://leetcode.com/problems/jump-game-ii/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-30 at 2.59.48 AM.png]]
- Now need to find minimum number of jumps to reach last index
- Has a dynamic programming solution $O(n^2)$ and a greedy solution $O(n)$ 
- Similar to a BFS
- Levels tells us minimum number of steps to reach cells
- Will have pointers for window
```python
class Solution:
    def jump(self, nums: List[int]) -> int:
        res = 0
        l = r = 0

        while r < len(nums) - 1:
            farthest = 0
            for i in range(l, r+1):
                farthest = max(farthest, i + nums[i])
            l = r + 1
            r = farthest
            res += 1
        return res
```
## Source[^2]
### (1) Recursion
```python
class Solution:
    def jump(self, nums: List[int]) -> int:
        def dfs(i):
            if i == len(nums) - 1:
                return 0
            if nums[i] == 0:
                return float('inf')

            end = min(len(nums) - 1, i + nums[i])
            res = float('inf')
            for j in range(i + 1, end + 1):
                res = min(res, 1 + dfs(j))
            return res

        return dfs(0)
```
Time Complexity: $O(n!)$
Space Complexity: $O(n)$
### (2) Dynamic Programming (Top-Down)
```python
class Solution:
    def jump(self, nums: List[int]) -> int:
        memo = {}

        def dfs(i):
            if i in memo:
                return memo[i]
            if i == len(nums) - 1:
                return 0
            if nums[i] == 0:
                return 1000000
            
            res = 1000000
            end = min(len(nums), i + nums[i] + 1)
            for j in range(i + 1, end):
                res = min(res, 1 + dfs(j))
            memo[i] = res
            return res

        return dfs(0)
```
Time Complexity: $O(n^2)$
Space Complexity: $O(n)$

### (3) Dynamic Programming (Bottom-Up)
```python
class Solution:
    def jump(self, nums: List[int]) -> int:
        n = len(nums)
        dp = [1000000] * n
        dp[-1] = 0

        for i in range(n - 2, -1, -1):
            end = min(n, i + nums[i] + 1)
            for j in range(i + 1, end):
                dp[i] = min(dp[i], 1 + dp[j])
        return dp[0]
```
Time Complexity: $O(n^2)$
Space Complexity: $O(n)$

### (4) Breadth First Search (Greedy)
```python
class Solution:
    def jump(self, nums: List[int]) -> int:
        res = 0
        l = r = 0

        while r < len(nums) - 1:
            farthest = 0
            for i in range(l, r + 1):
                farthest = max(farthest, i + nums[i])
            l = r + 1
            r = farthest
            res += 1
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$ 
## References

[^1]: [Jump Game II - Greedy - Leetcode 45 - Python](https://www.youtube.com/watch?v=dJ7sWiOoK7g)
[^2]: https://neetcode.io/solutions/jump-game-ii