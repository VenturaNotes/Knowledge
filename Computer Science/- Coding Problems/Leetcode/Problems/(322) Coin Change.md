---
Source:
  - https://leetcode.com/problems/coin-change/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-29 at 6.27.48 PM.png]]
- Can we be greedy?
	- Can't just pick the biggest possible value first
	- A good counterexample would be given `[1, 3, 4, 5]`
		- 5 + 1 + 1 = 7 (which uses 3 coins) but 4+3 = 7 which only uses 2 coins
- Could try DFS - Backtracking solution
	- Negative value means to stop
	- Breaking it down into sub-problems
		- Don't have to compute again if you have a subproblem
- If we have a cache or DP, we don't have to repeat sub-problems
- Just solved this using [[top-down memoization]]
- Could actually solve this using a true [[dynamic programming]] solution which is bottom up
	- [[bottom-up dynamic programming]]
		- Instead of solving original problem where amount is 7, we begin to solve it in reverse order
		- We start with the smallest one which is 0
	- Could just do minimum number of coins to sum up to 1, 2, 3, etc.
```python
class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        dp = [amount + 1] * (amount + 1)
        dp[0] = 0

        for a in range(1, amount + 1):
            for c in coins:
                if a - c >= 0:
                    dp[a] = min(dp[a], 1 + dp[a - c])
        return dp[amount] if dp[amount] != amount + 1 else -1
```
- We did a [[recurrence relation]] above
- Time complexity: amount $*$ `len`(coins)
- Space complexity: amount
## Source[^2]
### (1) Recursion
```python
class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        
        def dfs(amount):
            if amount == 0:
                return 0
            
            res = 1e9
            for coin in coins:
                if amount - coin >= 0:
                    res = min(res, 1 + dfs(amount - coin))
            return res

        minCoins = dfs(amount)
        return -1 if minCoins >= 1e9 else minCoins
```
Time Complexity: $O(n^t)$
Space Complexity: $O(t)$
- Where $n$ is the length of the array $coins$ and $t$ is the given $amount$

### (2) Dynamic Programming (Top-Down)
```python
class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        memo = {}

        def dfs(amount):
            if amount == 0:
                return 0
            if amount in memo:
                return memo[amount]
            
            res = 1e9
            for coin in coins:
                if amount - coin >= 0:
                    res = min(res, 1 + dfs(amount - coin))
            
            memo[amount] = res
            return res
        
        minCoins = dfs(amount)
        return -1 if minCoins >= 1e9 else minCoins
```
Time Complexity: $O(n*t)$
Space Complexity: $O(t)$
- Where $n$ is the length of the array $coins$ and $t$ is the given $amount$
### (3) Dynamic Programming (Bottom-Up)
```python
class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        dp = [amount + 1] * (amount + 1)
        dp[0] = 0

        for a in range(1, amount + 1):
            for c in coins:
                if a - c >= 0:
                    dp[a] = min(dp[a], 1 + dp[a - c])
        return dp[amount] if dp[amount] != amount + 1 else -1
```
Time Complexity: $O(n*t)$
Space Complexity: $O(t)$
- Where $n$ is the length of the array $coins$ and $t$ is the given amount
### (4) Breadth First Search
```python
class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        if amount == 0:
            return 0

        q = deque([0])
        seen = [False] * (amount + 1)
        seen[0] = True
        res = 0  

        while q:
            res += 1
            for _ in range(len(q)):
                cur = q.popleft()
                for coin in coins:
                    nxt = cur + coin
                    if nxt == amount:
                        return res
                    if nxt > amount or seen[nxt]:
                        continue
                    seen[nxt] = True
                    q.append(nxt)

        return -1
```
Time Complexity: $O(n*t)$
Space Complexity: $O(t)$
- Where $n$ is the length of the array $coins$ and $t$ is the given $amount$ 
## References

[^1]: https://www.youtube.com/watch?v=H9bfqozjoqs
[^2]: https://neetcode.io/solutions/coin-change