---
Source:
  - https://leetcode.com/problems/trapping-rain-water/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-10-16 at 3.08.00 PM.png]]
- What's the maximum amount of rain water that the structure can trap?
- Take max height on left and max height on right and then get the minimum of those two
- Both solutions to this problem are linear time solutions
	- First solution will require O(n) of memory
		- With the two pointer solution, could reduce memory complexity from linear memory to constant memory O(1)
- First solution is O(n) of memory
- Second solution is O(1) of memory
	- Code solution written below
- Always shifting the minimum height

```python
class Solution:
    def trap(self, height: List[int]) -> int:
        if not height: return 0

        l, r = 0, len(height) - 1
        leftMax, rightMax = height[l], height[r]
        res = 0

        while l < r:
            if leftMax < rightMax:
                l += 1
                leftMax = max(leftMax, height[l])
                res += leftMax - height[l]
            else:
                r -= 1
                rightMax = max(rightMax, height[r])
                res += rightMax - height[r]
        return res
```
- #question How do we know that `res += leftMax - height[l]` is not going to be negative? 
- Done in linear time and constant memory complexity
## References

[^1]: https://www.youtube.com/watch?v=ZI2z5pq0TqA