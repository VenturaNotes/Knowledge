---
Source:
  - https://leetcode.com/problems/valid-parenthesis-string/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-30 at 4.27.23 AM.png|500]]
- Brute force would be decision tree
- Could use dynamic programming, memoization solution
- Brute force solution would be $3^n$ (n would be size of string)
- With memoization, time complexity is $n^3$ 
- Greedy solution difficult to come up with
	- $O(n)$ linear time
- leftMin can never be negative
- If 0 falls in range, our leftMin is exactly 0 so we can return true
- If maximum negative, impossible
- Time complexity: $O(n)$
- Space complexity: $O(1)$ 
```python
class Solution:
    def checkValidString(self, s: str) -> bool:
        leftMin, leftMax = 0, 0

        for c in s:
            if c == "(":
                leftMin, leftMax = leftMin + 1, leftMax + 1
            elif c == ")":
                leftMin, leftMax = leftMin - 1, leftMax - 1
            else:
                leftMin, leftMax = leftMin - 1, leftMax + 1
            if leftMax < 0:
                return False
            if leftMin < 0: # s = (*) ()
                leftMin = 0
        return leftMin == 0
```
## Sources
### (1) Recursion
```python
class Solution:
    def checkValidString(self, s: str) -> bool:
        
        def dfs(i, open):
            if open < 0:
                return False
            if i == len(s):
                return open == 0
            
            if s[i] == '(':
                return dfs(i + 1, open + 1)
            elif s[i] == ')':
                return dfs(i + 1, open - 1)
            else:
                return (dfs(i + 1, open) or
                        dfs(i + 1, open + 1) or
                        dfs(i + 1, open - 1))
        return dfs(0, 0)
```
Time Complexity: $O(3^n)$
Space Complexity: $O(n)$

### (2) Dynamic Programming (Top-Down)
```python
class Solution:
    def checkValidString(self, s: str) -> bool:
        n = len(s)
        memo = [[None] * (n + 1) for _ in range(n + 1)]

        def dfs(i, open):
            if open < 0:
                return False
            if i == n:
                return open == 0
            if memo[i][open] is not None:
                return memo[i][open]
            
            if s[i] == '(':
                result = dfs(i + 1, open + 1)
            elif s[i] == ')':
                result = dfs(i + 1, open - 1)
            else:
                result = (dfs(i + 1, open) or 
                          dfs(i + 1, open + 1) or 
                          dfs(i + 1, open - 1))
            
            memo[i][open] = result
            return result

        return dfs(0, 0)
```
Time Complexity: $O(n^2)$
Space Complexity: $O(n^2)$

### (3) Dynamic Programming (Bottom-Up)
```python
class Solution:
    def checkValidString(self, s: str) -> bool:
        n = len(s)
        dp = [[False] * (n + 1) for _ in range(n + 1)]
        dp[n][0] = True

        for i in range(n - 1, -1, -1):
            for open in range(n):
                res = False
                if s[i] == '*':
                    res |= dp[i + 1][open + 1]
                    if open > 0:
                        res |= dp[i + 1][open - 1]
                    res |= dp[i + 1][open]
                else:
                    if s[i] == '(':
                        res |= dp[i + 1][open + 1]
                    elif open > 0:
                        res |= dp[i + 1][open - 1]
                dp[i][open] = res

        return dp[0][0]
```
Time Complexity: $O(n^2)$
Space Complexity: $O(n^2)$

### (4) Dynamic Programming (Space Optimized)
```python
class Solution:
    def checkValidString(self, s: str) -> bool:
        n = len(s)
        dp = [False] * (n + 1)
        dp[0] = True

        for i in range(n - 1, -1, -1):
            new_dp = [False] * (n + 1)
            for open in range(n):
                if s[i] == '*':
                    new_dp[open] = (dp[open + 1] or 
                                    (open > 0 and dp[open - 1]) or 
                                    dp[open])
                elif s[i] == '(':
                    new_dp[open] = dp[open + 1]
                elif open > 0:
                    new_dp[open] = dp[open - 1]
            dp = new_dp

        return dp[0]
```
Time Complexity: $O(n^2)$
Space Complexity: $O(n)$
### (5) Stack
```python
class Solution:
    def checkValidString(self, s: str) -> bool:
        left = []
        star = []
        for i, ch in enumerate(s):
            if ch == '(':
                left.append(i)
            elif ch == '*':
                star.append(i)
            else:
                if not left and not star:
                    return False
                if left:
                    left.pop()
                else:
                    star.pop()
        
        while left and star:
            if left.pop() > star.pop():
                return False
        return not left
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$

### (6) Greedy
```python
class Solution:
    def checkValidString(self, s: str) -> bool:
        leftMin, leftMax = 0, 0

        for c in s:
            if c == "(":
                leftMin, leftMax = leftMin + 1, leftMax + 1
            elif c == ")":
                leftMin, leftMax = leftMin - 1, leftMax - 1
            else:
                leftMin, leftMax = leftMin - 1, leftMax + 1
            if leftMax < 0:
                return False
            if leftMin < 0:
                leftMin = 0
        return leftMin == 0
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$
## References

[^1]: https://www.youtube.com/watch?v=QhPdNS143Qg