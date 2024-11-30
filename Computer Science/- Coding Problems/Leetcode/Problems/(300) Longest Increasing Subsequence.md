---
Source:
  - https://leetcode.com/problems/longest-increasing-subsequence/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-29 at 6.56.32 PM.png]]
- It's a [[dynamic programming]] problem. Will be shown how to get from recursive solution to DP solution.
- Given an integer array of `nums`, return the length of the longest strictly increasing subsequence
- A [[subsequence]] is sequence that can be derived from an array by deleting some or no elements without changing the order of the remaining elements. For example, `[3, 6, 2, 7]` is a subsequence of the array `[0, 3, 1, 6, 2, 2, 7]`
- Brute Force - DFS
	- $2^n$ possible subsequence 
-  DFS - With Cache
- Seem to be using bottom-up dynamic programming for this problem
	- Time complexity is $O(n^2)$ 
		- There is a better solution of $O(nlogn)$ but we doubt interviewer will make you get this on your own
```python
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        LIS = [1] * len(nums)

        for i in range(len(nums) - 1, -1, -1):
            for j in range(i + 1, len(nums)):
                if nums[i] < nums[j]:
                    LIS[i] = max(LIS[i], 1 + LIS[j])
        return max(LIS)
```
## References

[^1]: https://www.youtube.com/watch?v=cjWnW0hdF1Y