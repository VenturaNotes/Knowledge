---
Source:
  - https://leetcode.com/problems/jump-game/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-30 at 2.54.44 AM.png]]
- Popular dynamic programming problem but could also have a greedy solution
- Brute force solution is $O(n^n)$ where `n` is the length of input array
	- If we cache this, we actually make this a $O(n^2)$ solution but need a little extra memory for that
- Greedy solution is $O(n)$ 
	- This is when we use a [[greedy algorithms|greedy algorithm]]
	- Shifting goal post for this problem
```python
class Solution:
    def canJump(self, nums: List[int]) -> bool:
        goal = len(nums) - 1
        
        for i in range(len(nums) - 1, -1, -1):
            if i + nums[i] >= goal:
                goal = i
        return True if goal == 0 else False
```
## Source[^2]
### (1) Recursion
```python
class Solution:
    def canJump(self, nums: List[int]) -> bool:
        def dfs(i):
            if i == len(nums) - 1:
                return True
            end = min(len(nums) - 1, i + nums[i])
            for j in range(i + 1, end + 1):
                if dfs(j):
                    return True
            return False

        return dfs(0)
```
Time Complexity: $O(n!)$
Space Complexity: $O(n)$

### (2) Dynamic Programming (Top-Down)
```python
class Solution:
    def canJump(self, nums: List[int]) -> bool:
        memo = {}

        def dfs(i):
            if i in memo:
                return memo[i]
            if i == len(nums) - 1:
                return True
            if nums[i] == 0:
                return False
            
            end = min(len(nums), i + nums[i] + 1)
            for j in range(i + 1, end):
                if dfs(j):
                    memo[i] = True
                    return True
            memo[i] = False
            return False

        return dfs(0)
```
Time Complexity: $O(n^2)$
Space Complexity: $O(n)$

### (3) Dynamic Programming (Bottom-Up)
```python
class Solution:
    def canJump(self, nums: List[int]) -> bool:
        n = len(nums)
        dp = [False] * n
        dp[-1] = True

        for i in range(n - 2, -1, -1):
            end = min(n, i + nums[i] + 1)
            for j in range(i + 1, end):
                if dp[j]:
                    dp[i] = True
                    break
        return dp[0]
```
Time Complexity: $O(n^2)$
Space Complexity: $O(n)$

### (4) Greedy
```python
class Solution:
    def canJump(self, nums: List[int]) -> bool:
        goal = len(nums) - 1

        for i in range(len(nums) - 2, -1, -1):
            if i + nums[i] >= goal:
                goal = i
        return goal == 0
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$
## References

[^1]: [Jump Game - Greedy - Leetcode 55](https://www.youtube.com/watch?v=Yan0cv2cLy8)
[^2]: https://neetcode.io/solutions/jump-game