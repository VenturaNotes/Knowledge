---
Source:
  - https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
Reviewed: false
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
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        res = 0
        for i in range(len(prices)):
            buy = prices[i]
            for j in range(i + 1, len(prices)):
                sell  = prices[j]
                res = max(res, sell - buy)
        return res
```
Time Complexity: $O(n^2)$
Space Complexity: $O(1)$

### (2) Two Pointers
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
                l = r
            r += 1
        return maxP
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$

### (3) Dynamic Programming
```python
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        maxP = 0
        minBuy = prices[0]

        for sell in prices:
            maxP = max(maxP, sell - minBuy)
            minBuy = min(minBuy, sell)
        return maxP
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$
## References

[^1]: [Sliding Window: Best Time to Buy and Sell Stock - Leetcode 121 - Python](https://www.youtube.com/watch?v=1pkOgXD63yU)
[^2]: https://neetcode.io/solutions/best-time-to-buy-and-sell-stock