---
Source:
  - https://leetcode.com/problems/subsets-ii/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-21 at 9.18.00 PM.png]]
- The input array can contain duplicates, return all possible subsets (the power set)
- The solution set must not contain duplicate subsets. Return the solution in any order
- Can't really do dynamic programming for this problem since we have to create all of the subsets
- $2^n$ is how many subsets we'll have
	- How long will it be? At most length `n`
	- So time complexity is $O(n*2^n)$
	- It's a brute force solution so we'll be using [[backtracking]]
- The input representation may look simple, but not guaranteed that the input array is going to be sorted
	- So we need to sort it ourselves in $O(nlogn)$ time which is not a big deal because we already know the time complexity of the solution is $n*2^n$ anyway so the $O(nlogn)$ is pretty insignificant
- We are eliminating duplicates in this problem
	- So we won't have $2^n$ subsets, but we will have 12 for this example instead of 16
	- If there are no duplicates in the input, the worst case scenario will still be $n*2^n$ 
```python
class Solution:
    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:
        res = []
        nums.sort()

        def backtrack(i, subset):
            if i == len(nums):
                res.append(subset[::])
                return
            # All subsets that include nums[i]
            subset.append(nums[i])
            backtrack(i + 1, subset)
            subset.pop()

            # All subsets that don't include nums[i]
            while i + 1 < len(nums) and nums[i] == nums[i + 1]:
                i += 1
            backtrack(i + 1, subset)
        backtrack(0, [])
        return res
```
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:
        res = set()

        def backtrack(i, subset):
            if i == len(nums):
                res.add(tuple(subset))
                return

            subset.append(nums[i])
            backtrack(i + 1, subset)
            subset.pop()
            backtrack(i + 1, subset)

        nums.sort()
        backtrack(0, [])
        return [list(s) for s in res]
```
Time Complexity: $O(n*2^n)$
Space Complexity: $O(2^n)$

### (2) Backtracking (Pick / Not Pick)
```python
class Solution:
    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:
        res = []
        nums.sort()

        def backtrack(i, subset):
            if i == len(nums):
                res.append(subset[::])
                return

            subset.append(nums[i])
            backtrack(i + 1, subset)
            subset.pop()

            while i + 1 < len(nums) and nums[i] == nums[i + 1]:
                i += 1
            backtrack(i + 1, subset)

        backtrack(0, [])
        return res
```
Time Complexity: $O(n*2^n)$
Space Complexity: $O(n)$

### (3) Backtracking
```python
class Solution:
    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        res = []
        def backtrack(i, subset):
            res.append(subset[::])

            for j in range(i, len(nums)):
                if j > i and nums[j] == nums[j - 1]:
                    continue
                subset.append(nums[j])
                backtrack(j + 1, subset)
                subset.pop()

        backtrack(0, [])
        return res
```
Time Complexity: $O(n*2^n)$
Space Complexity: $O(n)$
### (4) Iteration
```python
class Solution:
    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        res = [[]]
        prev_Idx = idx = 0
        for i in range(len(nums)):
            idx = prev_idx if i >= 1 and nums[i] == nums[i - 1] else 0
            prev_idx = len(res)
            for j in range(idx, prev_idx):
                tmp = res[j].copy()
                tmp.append(nums[i])
                res.append(tmp)
        return res
```
Time Complexity: $O(n*2^n)$
Space Complexity: $O(1)$
## References

[^1]: [Subsets II - Backtracking - Leetcode 90 - Python](https://www.youtube.com/watch?v=Vn2v6ajA7U0)
[^2]: https://neetcode.io/solutions/subsets-ii