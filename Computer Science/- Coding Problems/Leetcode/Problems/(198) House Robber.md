---
Source:
  - https://leetcode.com/problems/house-robber/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-24 at 2.42.57 AM.png]]
- [[Google]] likes asking dynamic programming problems
- [[dynamic programming]] problem
- [[Decision tree]]
- `rob = max(arr[0] + rob[2:n], rob[1:n])`
	- This is the [[recurrence relationship]]
		- It's a way of breaking up dynamic programming problems
```python
class Solution:
    def rob(self, nums: List[int]) -> int:
        rob1, rob2 = 0, 0

        for n in nums:
            temp = max(n + rob1, rob2)
            rob1 = rob2
            rob2 = temp
        return rob2
```
## References

[^1]: https://www.youtube.com/watch?v=73r3KWiEvyk