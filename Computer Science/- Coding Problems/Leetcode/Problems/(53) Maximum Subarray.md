---
Source:
  - https://leetcode.com/problems/maximum-subarray/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-30 at 2.44.50 AM.png]]
- Brute force solution is $O(n^3)$ 
- $O(n^2)$ is an optimization
- Any time we think of a negative prefix, we remove it
	- Helps to think of this problem as a [[sliding window]]
	- Time complexity: $O(n)$
```python
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        maxSub = nums[0]
        curSum = 0

        for n in nums:
            if curSum < 0:
                curSum = 0
            curSum += n
            maxSub = max(maxSub, curSum)
        return maxSub
```
## References

[^1]: https://www.youtube.com/watch?v=5WZl3MMT0Eg