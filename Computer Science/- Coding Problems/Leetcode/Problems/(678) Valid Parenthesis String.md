---
Source:
  - https://leetcode.com/problems/valid-parenthesis-string/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-30 at 4.27.23 AM.png|500]]
- Brute force would be decision tree
- Could use dynamic programming, memoization solution
- Brute force solution would be $3^n$ (n would be size of string)
- With memoization, time complexity is $n^3$ 
- Greedy solution difficult to come up with
	- $O(n)$ linear time
- leftMin can never be negative
- If 0 falls in range, our leftMin is exactly 0 so we can return true
- If maximum negative, impossible
- Time complexity: $O(n)$
- Space complexity: $O(1)$ 
```python
class Solution:
    def checkValidString(self, s: str) -> bool:
        leftMin, leftMax = 0, 0

        for c in s:
            if c == "(":
                leftMin, leftMax = leftMin + 1, leftMax + 1
            elif c == ")":
                leftMin, leftMax = leftMin - 1, leftMax - 1
            else:
                leftMin, leftMax = leftMin - 1, leftMax + 1
            if leftMax < 0:
                return False
            if leftMin < 0: # s = (*) ()
                leftMin = 0
        return leftMin == 0
```
## References

[^1]: https://www.youtube.com/watch?v=QhPdNS143Qg