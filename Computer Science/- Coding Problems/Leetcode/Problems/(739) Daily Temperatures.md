---
Source:
  - https://leetcode.com/problems/daily-temperatures/
Reviewed: false
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
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        n = len(temperatures)
        res = []

        for i in range(n):
            count = 1
            j = i + 1
            while j < n:
                if temperatures[j] > temperatures[i]:
                    break
                j += 1
                count += 1
            count = 0 if j == n else count
            res.append(count)
        return res
```
Time Complexity: $O(n^2)$
Space Complexity: $O(1)$

### (2) Stack
```python
class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        res = [0] * len(temperatures)
        stack = []  # pair: [temp, index]

        for i, t in enumerate(temperatures):
            while stack and t > stack[-1][0]:
                stackT, stackInd = stack.pop()
                res[stackInd] = i - stackInd
            stack.append((t, i))
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
### (3) Dynamic Programming
```python
class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        n = len(temperatures)
        res = [0] * n

        for i in range(n - 2, -1, -1):
            j = i + 1
            while j < n and temperatures[j] <= temperatures[i]:
                if res[j] == 0:
                    j = n
                    break
                j += res[j]
            
            if j < n:
                res[i] = j - i
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$
## References

[^1]: [Daily Temperatures - Monotonic Stack - Leetcode 739 - Python](https://www.youtube.com/watch?v=cTBiBSnjO3c)
[^2]: https://neetcode.io/solutions/daily-temperatures