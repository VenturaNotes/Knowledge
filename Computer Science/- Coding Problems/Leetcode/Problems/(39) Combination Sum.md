---
Source:
  - https://leetcode.com/problems/combination-sum/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-21 at 8.55.25 PM.png]]
- We want combinations and not permutations for this problem
- This is going to be a recursion tree
	- Each recursion step will make two decisions and it's pretty easy to code up
	- Time complexity $O(2^t)$ where t is the target value
		- Each value in array is going to be positive. It's going to be at least 1
		- So the height of the decision tree can be at most whatever the target value we're trying to make it.
- Can draw a [[decision tree]]
```python
class Solution:
    def combinationSum(self, nums: List[int], target: int) -> List[List[int]]:
        res = []
        
        def dfs(i, cur, total):
            if total == target:
                res.append(cur.copy())
                return
            if i >= len(nums) or total > target:
                return

            cur.append(nums[i])
            dfs(i, cur, total + nums[i])
            cur.pop()
            dfs(i + 1, cur, total)
        dfs(0, [], 0)
        return res

```
## References

[^1]: https://www.youtube.com/watch?v=GBKI9VSKdGg