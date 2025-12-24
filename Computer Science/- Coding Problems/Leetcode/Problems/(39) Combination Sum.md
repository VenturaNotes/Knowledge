---
Source:
  - https://leetcode.com/problems/combination-sum/
Reviewed: false
tags:
  - in-progress
---
## Synthesis
- This is a classic backtracking / DFS search tree problem
	- #question Is there a difference between both or are they just the same names in this case?
- Thought Process: Every number can be either
	- Chosen again (same index due to unlimited use)
		- Since we are given `distinct` integers in `candidates`, each element is already unique within it. 
		- #question Is it already ordered though?
	- Skipped (moving to next index)
- So essentially the search tree tries all the paths until the sum hits or exceeds the target
- Drawing solution to example #1
	- ![[Screenshot 2025-12-03 at 3.58.20 AM.png]]
### Backtracking Solution
```python
class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        # Storing Results 
        res = []

        """ Recursion Method
        i: index of candidates
        current: combination of candidates to reach target
        total: Sum of current to compare to target
        """
        def backtrack(i, current, total):
            # If 
            if total == target:
	            #question Do we need the copy here?
                res.append(current.copy())
                return
                # Can't replace with continue because continue
                # requires a loop
            if i >= len(candidates) or total > target:
                return
                # Why would we check if i >= len(candidates)? 
                # Probably otherwise
                # Lets dryrun this program.

            # Option 1: include candidates[i]
            current.append(candidates[i])
            backtrack(i, current, total + candidates[i])
            current.pop()

            # Option 2: skip candidates[i]
            backtrack(i + 1, current, total)

        # initializing loop
        backtrack(0, [], 0)
        return res
        
        
"""
candidates gives distinct integers

So how would I even approach this? 

"""
```
- The order of the input does not matter either
	- #question Why? Need to test this out as well.
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
## Source[^2]
### (1) Backtracking
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
Time Complexity: $O(2\frac tm)$
Space Complexity: $O(\frac tm)$
- Where $t$ is the given $target$ and $m$ is the minimum value in $nums$

### (2) Backtracking (Optimal)
```python
class Solution:
    def combinationSum(self, nums: List[int], target: int) -> List[List[int]]:
        res = []
        nums.sort()

        def dfs(i, cur, total):
            if total == target:
                res.append(cur.copy())
                return
            
            for j in range(i, len(nums)):
                if total + nums[j] > target:
                    return
                cur.append(nums[j])
                dfs(j, cur, total + nums[j])
                cur.pop()
        
        dfs(0, [], 0)
        return res
```
Time Complexity: $O(2\frac tm)$
Space Complexity: $O(\frac tm)$
- Where $t$ is the given $target$ and $m$ is the minimum value in $nums$
## References

[^1]: https://www.youtube.com/watch?v=GBKI9VSKdGg
[^2]: https://neetcode.io/solutions/combination-sum