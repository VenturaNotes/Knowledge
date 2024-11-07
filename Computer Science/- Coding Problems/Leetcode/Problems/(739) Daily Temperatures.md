---
Source:
  - https://leetcode.com/problems/daily-temperatures/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-10-18 at 12.57.08 PM.png]]
- Would be O(n^2) time complexity if you scanned through the whole list
- Monotonic Decreasing Order type of stack problem
	- Monotonic Decreasing stack problem
		- What this means is that our stack is going to be in decreasing order. That's what monotonic means. It's always in decreasing order.
		- Not strictly decreasing but could be equal as well
		- [[Monotonic Stack]]
- #question why is stack better here than basic array? 
- Can get output in Linear time using a stock O(n)
- Monotonically decreasing stack gives O(n) time and O(n) memory
- Enumerate means you get the value and index at the same time
```python
class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        # Initializes array of length of temperature with 0
        # in each index
        res = [0] * len(temperatures)
        stack = []

		# "i" is the index while "t" is the value
        for i, t in enumerate(temperatures):
	        # If stack is not empty, it will return True
	        # Checks if current value of index is greater than last value 
	        # first element of stack
            while stack and t > stack[-1][0]:
                stackT, stackInd = stack.pop()
                res[stackInd] = (i - stackInd)
            # [value, index]
            stack.append([t, i])
        return res
        
```
- ![[Screenshot 2024-10-18 at 1.09.57 PM.png]]
- Example
	- temperatures = `[80, 74, 75, 71, 69, 72, 76, 73]`
	- Solution = `[0, 1, 4, 2, 1, 1, 0, 0]`
## References

[^1]: https://www.youtube.com/watch?v=cTBiBSnjO3c