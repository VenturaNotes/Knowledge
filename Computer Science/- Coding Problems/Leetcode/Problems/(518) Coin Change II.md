---
Source:
  - https://leetcode.com/problems/coin-change-ii/
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
## References

[^1]: https://www.youtube.com/watch?v=Mjy4hd2xgrs