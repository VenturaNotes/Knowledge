---
Source:
  - https://leetcode.com/problems/jump-game/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-30 at 2.54.44 AM.png]]
- Popular dynamic programming problem but could also have a greedy solution
- Brute force solution is $O(n^n)$ where `n` is the length of input array
	- If we cache this, we actually make this a $O(n^2)$ solution but need a little extra memory for that
- Greedy solution is $O(n)$ 
	- This is when we use a [[greedy algorithms|greedy algorithm]]
	- Shifting goal post for this problem
```python
class Solution:
    def canJump(self, nums: List[int]) -> bool:
        goal = len(nums) - 1
        
        for i in range(len(nums) - 1, -1, -1):
            if i + nums[i] >= goal:
                goal = i
        return True if goal == 0 else False
```
## References

[^1]: https://www.youtube.com/watch?v=Yan0cv2cLy8