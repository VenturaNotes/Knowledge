---
Source:
  - https://leetcode.com/problems/container-with-most-water
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- Brute force solution is $O(n^2)$ using the left and right pointers
- Given all the different heights, we want to find the maximum area that can hold a container of water

### Solution 1 (Brute Force)

```python
class Solution:
	def maxArea(self, height: List[int]) -> int:
	# BRUTE FORCE
	res = 0

	for l in range(len(height)):
		for r in range(l + 1, len(height)):
			area = (r-1) * min(height[l], height[r])
			res = max(res, area)
	return res
```
- Limit time will be exceeded for this solution

### Solution 2 (Linear Time: O(n))
- ![[Screenshot 2024-10-16 at 2.09.52 PM.png]]
```python
class Solution:
    def maxArea(self, heights: List[int]) -> int:
        # Linear Time Solution: O(n)
        res = 0
        l, r = 0, len(heights) - 1

        while l < r:
            area = (r-l) * min(heights[l], heights[r])
            res = max(res, area)

            if heights[l] < heights[r]:
                l += 1
            else:
                r -= 1
        return res
        
```
- #question why does this work though? Wish there was a proof for it
	- Like how do we know this always works?
	- [Proof?](https://leimao.github.io/blog/Proof-Container-With-Most-Water-Problem/)
- Minimum height is the limiting factor
- Solution might not work?
- You can shift either one, it doesn't matter.
## References

[^1]: https://www.youtube.com/watch?v=UuiTKBwPgAo