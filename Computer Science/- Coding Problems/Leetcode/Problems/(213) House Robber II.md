---
Source:
  - https://leetcode.com/problems/house-robber-ii/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-24 at 2.48.47 AM.png]]
- Maximizing amount that we can rob. Only catch is that we can't rob two houses adjacent to each other. The houses are arranged in a circle here.
- Have to run the helper function twice on different subarrays of our input array because we're not allowed to rob the first and last house together.
	- Then all you have to do is call the helper function twice on the two subarrays
	- Whichever the one is the max is the value we will return
- Time complexity is $O(n)$ and memory complexity is $O(1)$ because we don't really need any extra data structures for the most part
```python
class Solution:
    def rob(self, nums: List[int]) -> int:
        # skipping first and last index
        # If we only have 1 house, need to include nums[0]
        return max(nums[0], self.helper(nums[1:]), self.helper(nums[:-1]))
        
    
    # in functions in python, you have to put self as one of the first
    # parameters
    def helper(self, nums):
        rob1, rob2 = 0, 0

        for n in nums:
            newRob = max(rob1 + n, rob2)
            rob1 = rob2
            rob2 = newRob
        return rob2
```
## References

[^1]: https://www.youtube.com/watch?v=rWAJCfYYOvM