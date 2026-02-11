---
Source:
  - https://leetcode.com/problems/trapping-rain-water/
Reviewed: false
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
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def trap(self, height: List[int]) -> int:
        if not height:
            return 0
        n = len(height)
        res = 0

        for i in range(n):
            leftMax = rightMax = height[i]

            for j in range(i):
                leftMax = max(leftMax, height[j])
            for j in range(i + 1, n):
                rightMax = max(rightMax, height[j])
                
            res += min(leftMax, rightMax) - height[i]
        return res
```
Time Complexity: $O(n^2)$
Space Complexity: $O(1)$
### (2) Prefix & Suffix Array
```python
class Solution:
    def trap(self, height: List[int]) -> int:
        n = len(height)
        if n == 0:
            return 0
        
        leftMax = [0] * n
        rightMax = [0] * n
        
        leftMax[0] = height[0]
        for i in range(1, n):
            leftMax[i] = max(leftMax[i - 1], height[i])
        
        rightMax[n - 1] = height[n - 1]
        for i in range(n - 2, -1, -1):
            rightMax[i] = max(rightMax[i + 1], height[i])
        
        res = 0
        for i in range(n):
            res += min(leftMax[i], rightMax[i]) - height[i]
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$

### (3) Stack
```python
class Solution:
    def trap(self, height: List[int]) -> int:
        if not height:
            return 0
        stack = []
        res = 0

        for i in range(len(height)):
            while stack and height[i] >= height[stack[-1]]:
                mid = height[stack.pop()]
                if stack:
                    right = height[i]
                    left = height[stack[-1]]
                    h = min(right, left) - mid
                    w = i - stack[-1] - 1
                    res += h * w
            stack.append(i)
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$

### (4) Two Pointers
```python
class Solution:
    def trap(self, height: List[int]) -> int:
        if not height:
            return 0

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
Time Complexity: $O(n)$
Space Complexity: $O(1)$
## References

[^1]: [Trapping Rain Water - Google Interview Question - Leetcode 42](https://www.youtube.com/watch?v=ZI2z5pq0TqA)
[^2]: https://neetcode.io/solutions/trapping-rain-water