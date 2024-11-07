---
Source:
  - https://leetcode.com/problems/largest-rectangle-in-histogram/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-10-18 at 2.22.01 PM.png]]
- Want to find area of largest rectangle in histogram
- Current heights are in increasing order. If heights aren't in increasing order, they will be popped.
- Overall time complexity is O(n)
- Memory is O(n)
```python
class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        maxArea = 0
        stack = [] # pair: (index, height)

        for i, h in enumerate(heights):
            start = i
            while stack and stack[-1][1] > h:
                index, height = stack.pop()
                maxArea = max(maxArea, height * (i-index))
                start = index
            stack.append((start,h))
        for i, h in stack:
            maxArea = max(maxArea, h * (len(heights) - i))
        return maxArea
```
## References

[^1]: https://www.youtube.com/watch?v=zx5Sw9130L0