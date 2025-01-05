---
Source:
  - https://leetcode.com/problems/subsets/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-21 at 8.41.16 PM.png]]
- Return all possible subsets (the [[power set]])
	- It is not a [[permutation]]. It is a [[subset]]
- Solution must not contain duplicate sets
- Worst Time complexity for this problem would be $O(n*2^n)$ 
- Can jump into [[backtracking]] which is the brute force way of solving this problem
- We have 8 unique subsets
- Can draw a [[decision tree]]
```python
class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        res = []

        subset = []
        def dfs(i):
            if i >= len(nums):
                res.append(subset.copy())
                return

            # decision to include nums[i]
            subset.append(nums[i])
            dfs(i + 1)

            # decision NOT to include nums[i]
            subset.pop()
            dfs(i + 1)
        
        dfs(0)
        return res
```
## Source[^2]
### (1) Backtracking
```python
class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        res = []

        subset = []

        def dfs(i):
            if i >= len(nums):
                res.append(subset.copy())
                return
            subset.append(nums[i])
            dfs(i + 1)
            subset.pop()
            dfs(i + 1)

        dfs(0)
        return res
```
Time Complexity: $O(n*2^n)$
Space Complexity: $O(n)$

### (2) Iteration
```python
class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        res = [[]]
        
        for num in nums:
            res += [subset + [num] for subset in res]
        
        return res
```
Time Complexity: $O(n*2^n)$
Space Complexity: $O(n)$

### (3) Bit Manipulation
```python
class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        n = len(nums)
        res = []
        for i in range(1 << n):
            subset = [nums[j] for j in range(n) if (i & (1 << j))]
            res.append(subset)
        return res
```
Time Complexity: $O(n*2^n)$
Space Complexity: $O(n)$
## References

[^1]: https://www.youtube.com/watch?v=REOH22Xwdkk
[^2]: https://neetcode.io/solutions/subsets