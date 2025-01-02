---
Source:
  - https://leetcode.com/problems/maximum-product-subarray/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-29 at 6.36.48 PM.png]]
- [[Dynamic programming]] problem
	- Largest contiguous subarray
- Brute force would be $n^2$ 
	- If we have positive numbers, product will always be increasing
	- All negative numbers, sign alternating
- Need to keep track of minimum product subarray 
- Given the edge case of 0, will reset everything to a neutral value like 1
```python
class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        res = max(nums)
        curMin, curMax = 1, 1

        for n in nums:
            if n == 0:
                curMin, curMax = 1, 1
                continue
            tmp = curMax * n
            curMax = max(n*curMax, n*curMin, n)
            curMin = min(tmp, n*curMin, n)
            res = max(res, curMax)
        return res
```
- The if-statement is completely unnecessary (but still works)
- By the time the `n` value is out of bounds, we will have current max and current min of entire array computed
- Time complexity: $O(n)$
- Memory Complexity: $O(1)$ 
## References

[^1]: https://www.youtube.com/watch?v=lXVy6YWFcRM