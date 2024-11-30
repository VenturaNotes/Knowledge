---
Source:
  - https://leetcode.com/problems/partition-equal-subset-sum/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-29 at 9.39.49 PM.png]]
- Since every level of our [[decision tree]] we have 2 choices and the height of the decision tree is going to be for every single element. 
	- Therefore, the time complexity will be $2^n$ for the brute force method
- If we did a DFS solution with a cache like a backtracking solution with a cache,
	- The time and memory complexity would be $O(n*sum(nums))$ 
		- Sum would be dimensions of cache
- With DP, could improve memory complexity
- Trying to show a [[recurrence relation]]
- As long as set contains 11, we return true. If it doesn't, that means it's impossible to sum to target
	- Size of set would be about the same size of cache in memoization technique
	- Size of cache is going to be limited to size of target which is basically limited by sum of `nums` input array
		- Memory complexity: $O(sum(nums))$ 
		- Time complexity same as DFS solution
- Going through the brute force to the caching to the dynamic programming solution is the best thoughts process to arrive to this optimal solution
```python
class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        if sum(nums) % 2:
            return False
        
        dp = set()
        dp.add(0)
        target = sum(nums) // 2

        for i in range(len(nums) - 1, -1, -1):
            nextDP = set()
            for t in dp:
                if (t + nums[i]) == target:
                    return True
                nextDP.add(t + nums[i])
                nextDP.add(t)
            dp = nextDP
        return True if target in dp else False
```
- `if (t + nums[i]) == target:` might be an optimization that your interviewer may like but the time complexity is still the same
## References

[^1]: https://www.youtube.com/watch?v=IsvocB5BJhw