---
Source:
  - https://leetcode.com/problems/koko-eating-bananas/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-10-18 at 7.40.28 PM.png]]
- Brute force solution can easily become a binary search solution (which is the optimal solution for the problem)
- They guarantee us that `h` will be greater than or equal to the number of piles
- Minimum for this problem
- We want to know the minimum eating speed of Koko that she can eat all of the piles in exactly 5 hours
- Must eat all the piles in at most 8 hours or less (for one example problem)
- The improved time complexity is $O(log(max(p))*p)$
```python
class Solution:
    def minEatingSpeed(self, piles: List[int], h: int) -> int:
        l, r = 1, max(piles)
        res = r

        while l <= r:
            k = (l + r) // 2
            hours = 0
            for p in piles:
                hours += math.ceil(p / k)
            if hours <= h:
                res = min(res, k)
                r = k - 1
            else:
                l = k + 1
        return res
```
## References

[^1]: https://www.youtube.com/watch?v=U2SozAs9RzA