---
Source:
  - https://leetcode.com/problems/subsets-ii/
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
## References

[^1]: https://www.youtube.com/watch?v=Vn2v6ajA7U0