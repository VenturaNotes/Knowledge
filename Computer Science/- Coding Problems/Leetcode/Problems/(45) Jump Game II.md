---
Source:
  - https://leetcode.com/problems/jump-game-ii/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-30 at 2.59.48 AM.png]]
- Now need to find minimum number of jumps to reach last index
- Has a dynamic programming solution $O(n^2)$ and a greedy solution $O(n)$ 
- Similar to a BFS
- Levels tells us minimum number of steps to reach cells
- Will have pointers for window
```python
class Solution:
    def jump(self, nums: List[int]) -> int:
        res = 0
        l = r = 0

        while r < len(nums) - 1:
            farthest = 0
            for i in range(l, r+1):
                farthest = max(farthest, i + nums[i])
            l = r + 1
            r = farthest
            res += 1
        return res
```
## References

[^1]: https://www.youtube.com/watch?v=dJ7sWiOoK7g