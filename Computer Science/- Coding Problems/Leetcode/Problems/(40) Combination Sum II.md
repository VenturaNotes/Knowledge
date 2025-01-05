---
Source:
  - https://leetcode.com/problems/combination-sum-ii/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-21 at 9.31.34 PM.png]]
- 3 sum is part of the Neetcode 150 list
- Don't want duplicate combinations in solution set
- Can't use the same number an unlimited number of times
	- We can use it multiple times though if it shows up multiple times in the input
- Sort input array first (which will be positive anyway)
- Overall time complexity is $O(n2^n)$ 
	- When adding to result, will create a copy of every single array
- Can't apply dynamic programming to this
- Overall memory is O(n) for any individual combination or for the size of the recursive call stack
```python
class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        res = []
        candidates.sort()

        def dfs(i, cur, total):
            if total == target:
                    res.append(cur.copy())
                    return
            if total > target or i == len(candidates):
                return
            
            # include candidates[i]
            cur.append(candidates[i])
            dfs(i + 1, cur, total + candidates[i])
            cur.pop()

            # skip candidates[i]
            # [1, 1, 1, 1, 1]
            while i + 1 < len(candidates) and candidates[i] == candidates[i+1]:
                i += 1
            dfs(i + 1, cur, total)
        dfs(0, [], 0)
        return res

```
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def combinationSum2(self, candidates, target):
        res = set()
        candidates.sort()

        def generate_subsets(i, cur, total):
            if total == target:
                res.add(tuple(cur))  
                return
            if total > target or i == len(candidates):
                return

            cur.append(candidates[i])
            generate_subsets(i + 1, cur, total + candidates[i])
            cur.pop()

            generate_subsets(i + 1, cur, total)

        generate_subsets(0, [], 0)
        return [list(combination) for combination in res]
```
Time Complexity: $O(n*2^n)$
Space Complexity: $O(n*2^n)$

### (2) Backtracking
```python
class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        res = []
        candidates.sort()

        def dfs(i, cur, total):
            if total == target:
                res.append(cur.copy())
                return
            if total > target or i == len(candidates):
                return
            
            cur.append(candidates[i])
            dfs(i + 1, cur, total + candidates[i])
            cur.pop()

            
            while i + 1 < len(candidates) and candidates[i] == candidates[i+1]:
                i += 1
            dfs(i + 1, cur, total)
            
        dfs(0, [], 0)
        return res
```
Time Complexity: $O(n*2^n)$
Space Complexity: $O(n)$

### (3) Backtracking (Hash Map)
```python
class Solution:
    def combinationSum2(self, nums, target):
        self.res = []
        self.count = defaultdict(int)
        cur = []
        A = []
        
        for num in nums:
            if self.count[num] == 0:
                A.append(num)
            self.count[num] += 1
        self.backtrack(A, target, cur, 0)
        return self.res

    def backtrack(self, nums, target, cur, i):
        if target == 0:
            self.res.append(cur.copy())
            return
        if target < 0 or i >= len(nums):
            return
        
        if self.count[nums[i]] > 0:
            cur.append(nums[i])
            self.count[nums[i]] -= 1
            self.backtrack(nums, target - nums[i], cur, i)
            self.count[nums[i]] += 1
            cur.pop()

        self.backtrack(nums, target, cur, i + 1)
```
Time Complexity: $O(n*2^n)$
Space Complexity: $O(n)$

### (4) Backtracking (Optimal)
```python
class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        res = []
        candidates.sort()

        def dfs(idx, path, cur):
            if cur == target:
                res.append(path.copy())
                return
            for i in range(idx, len(candidates)):
                if i > idx and candidates[i] == candidates[i - 1]:
                    continue
                if cur + candidates[i] > target:
                    break

                path.append(candidates[i])
                dfs(i + 1, path, cur + candidates[i])
                path.pop()

        dfs(0, [], 0)
        return res
```
Time Complexity: $O(n*2^n)$
Space Complexity: $O(n)$
## References

[^1]: https://www.youtube.com/watch?v=FOyRpNUSFeA
[^2]: https://neetcode.io/solutions/combination-sum-ii