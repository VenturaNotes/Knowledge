---
Source:
  - https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-16 at 12.30.47 AM.png]]
- Common saying in stock market is buy low and sell high.
- Each value in array represents price of particular stock on a particular day. 
- We just want one transaction that maximizes our profit
- Will use [[two pointer technique]] for this
	- We used pointers but no array so memory is O(1)
	- Time will be linear as it's a two pointer solution: o(n)
- Will use [[sliding window technique]] for this

```python
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        l, r = 0, 1
        maxP = 0

        while r < len(prices):
            if prices[l] < prices[r]:
                profit = prices[r] - prices[l]
                maxP = max(maxP, profit)
            else:
                l = r #want to shift all the way to the right
                # because we found a really low price. The lowest price
                # We want left pointer to be at minimum
            r+=1
        return maxP
```
## References

[^1]: https://www.youtube.com/watch?v=1pkOgXD63yU