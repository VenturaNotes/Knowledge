---
Source:
  - https://leetcode.com/problems/coin-change/
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
## References

[^1]: https://www.youtube.com/watch?v=H9bfqozjoqs