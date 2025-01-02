---
Source:
  - https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-01 at 3.02.16 AM.png]]
- Can solve this problem in linear time
- Height of tree we're making where $n$ is the size of the prices array and the number of decisions we can make is up to 2 giving a time complexity of $2^n$ 
- However, we can use a simple [[dynamic programming]] technique called [[caching]] so we could reduce the time complexity to $O(n)$
```python
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        # State: Buying or Selling?
        # If Buy -> i + 1
        # If Sell -> i + 2

        dp = {} # key=(i, buying) val=max_profit

        def dfs(i, buying):
            if i >= len(prices):
                return 0
            if (i, buying) in dp:
                return dp[(i, buying)]
            cooldown = dfs(i + 1, buying)
            if buying:
                buy = dfs(i + 1, not buying) - prices[i]
                dp[(i, buying)] = max(buy, cooldown)
            else:
                sell = dfs(i + 2, not buying) + prices[i]
                dp[(i, buying)] = max(sell, cooldown)
            return dp[(i, buying)]

        return dfs(0, True)
```
## References

[^1]: https://www.youtube.com/watch?v=I7j0F7AHpb8