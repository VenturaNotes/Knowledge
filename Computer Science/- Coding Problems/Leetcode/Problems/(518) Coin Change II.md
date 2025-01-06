---
Source:
  - https://leetcode.com/problems/coin-change-ii/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-01 at 3.17.57 AM.png]]
- This is an unbounded [[knapsack problem]]
- Exponential solution is $m^n$ but with memoization, can get time complexity is $m*n$ 
	- `m` is the number of decisions we make (number of coins)
	- `n` is the total amount (as this will determine height of tree)
- There is one optimization of memory complexity which is difficult to come up with
- Could draw a [[decision tree]]
- When moving into the [[memoization]] solution, we will be caching the repeated work
- Could use DFS
- [[Dynamic programming]] solution can reduce memory to $O(n)$
	- Can be more efficient than recursive memoization solution
```python
class Solution:
    def change(self, amount: int, coins: List[int]) -> int:
        cache = {}

        def dfs(i, a):
            if a == amount:
                return 1
            if a > amount:
                return 0
            if i == len(coins):
                return 0
            if (i, a) in cache:
                return cache[(i, a)]
            
            cache[(i, a)] = dfs(i, a + coins[i]) + dfs(i + 1, a)
            return cache[(i, a)]
        return dfs(0,0)
```
- Time and space complexity above is $O(n*m)$ 
```python
class Solution:
    def change(self, amount: int, coins: List[int]) -> int:
        dp = [[0] * (len(coins) + 1) for i in range(amount + 1)]
        dp[0] = [1] * (len(coins) + 1)

        for a in range(1, amount + 1):
            for i in range(len(coins) - 1, -1, -1):
                dp[a][i] = dp[a][i+1]
                if a - coins[i] >= 0:
                    dp[a][i] += dp[a - coins[i]][i]
        return dp[amount][0]
```
- Time and space complexity above is $O(n*m)$ 
	- #comment I think this is true?
```python
class Solution:
    def change(self, amount: int, coins: List[int]) -> int:
        dp = [0] * (amount + 1)
        dp[0] = 1

        for i in range(len(coins) - 1, -1, -1):
            nextDP = [0] * (amount + 1)
            nextDP[0] = 1

            for a in range(1, amount + 1):
                nextDP[a] = dp[a]
                if a - coins[i] >= 0:
                    nextDP[a] += nextDP[a - coins[i]]
            dp = nextDP
        return dp[amount]
```
- Time complexity above is $O(n*m)$
- Space complexity above is $O(n)$
## Source[^2]
### (1) Recursion
```python
class Solution:
    def change(self, amount: int, coins: List[int]) -> int:
        coins.sort()

        def dfs(i, a):
            if a == 0:
                return 1
            if i >= len(coins):
                return 0

            res = 0
            if a >= coins[i]:
                res = dfs(i + 1, a)
                res += dfs(i, a - coins[i])
            return res

        return dfs(0, amount)
```
Time Complexity: $O(2^{max(n,\frac am)})$
Space Complexity: $O(max(n, \frac am))$
- Where $n$ is the number of coins, $a$ is the given amount and $m$ is the minimum value among all the coins
### (2) Dynamic Programming (Top-Down)
```python
class Solution:
    def change(self, amount: int, coins: List[int]) -> int:
        coins.sort()
        memo = [[-1] * (amount + 1) for _ in range(len(coins) + 1)]

        def dfs(i, a):
            if a == 0:
                return 1
            if i >= len(coins):
                return 0
            if memo[i][a] != -1:
                return memo[i][a]
            
            res = 0
            if a >= coins[i]:
                res = dfs(i + 1, a)
                res += dfs(i, a - coins[i])

            memo[i][a] = res
            return res

        return dfs(0, amount)
```
Time Complexity: $O(n*a)$
Space Complexity: $O(n*a)$
- Where $n$ is the number of coins and $a$ is the given amount
### (3) Dynamic Programming (Bottom-Up)
```python
class Solution:
    def change(self, amount: int, coins: List[int]) -> int:
        n = len(coins)
        coins.sort()
        dp = [[0] * (amount + 1) for _ in range(n + 1)]
        
        for i in range(n + 1):
            dp[i][0] = 1
        
        for i in range(n - 1, -1, -1):
            for a in range(amount + 1):
                if a >= coins[i]:
                    dp[i][a] = dp[i + 1][a]  
                    dp[i][a] += dp[i][a - coins[i]]  

        return dp[0][amount]
```
Time Complexity: $O(n*a)$
Space Complexity: $O(n*a)$
- Where $n$ is the number of coins and $a$ is the given amount
### (4) Dynamic Programming (Space Optimized)
```python
class Solution:
    def change(self, amount: int, coins: List[int]) -> int:
        dp = [0] * (amount + 1)
        dp[0] = 1
        for i in range(len(coins) - 1, -1, -1):
            nextDP = [0] * (amount + 1)
            nextDP[0] = 1

            for a in range(1, amount + 1):
                nextDP[a] = dp[a]
                if a - coins[i] >= 0:
                    nextDP[a] += nextDP[a - coins[i]]
            dp = nextDP
        return dp[amount]
```
Time Complexity: $O(n*a)$
Space Complexity: $O(a)$
- Where $n$ is the number of coins and $a$ is the given amount
### (5) Dynamic Programming (Optimal)
```python
class Solution:
    def change(self, amount: int, coins: List[int]) -> int:
        dp = [0] * (amount + 1)
        dp[0] = 1
        for i in range(len(coins) - 1, -1, -1):
            for a in range(1, amount + 1):
                dp[a] += dp[a - coins[i]] if coins[i] <= a else 0
        return dp[amount]
```
Time Complexity: $O(n*a)$
Space Complexity: $O(a)$
- Where $n$ is the number of coins and $a$ is the given amount

## References

[^1]: https://www.youtube.com/watch?v=Mjy4hd2xgrs
[^2]: https://neetcode.io/solutions/coin-change-ii