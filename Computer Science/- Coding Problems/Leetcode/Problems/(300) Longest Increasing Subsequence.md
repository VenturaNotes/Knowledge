---
Source:
  - https://leetcode.com/problems/longest-increasing-subsequence/
Reviewed: false
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
## Source[^2]
### (1) Recursion
```python
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        
        def dfs(i, j):
            if i == len(nums):
                return 0
            
            LIS = dfs(i + 1, j) # not include

            if j == -1 or nums[j] < nums[i]:
                LIS = max(LIS, 1 + dfs(i + 1, i)) # include
            
            return LIS

        return dfs(0, -1)
```
Time Complexity: $O(2^n)$
Space Complexity: $O(n)$
### (2) Dynamic Programming (Top-Down)
```python
class Solution:
    def lengthOfLIS(self, nums):
        n = len(nums)
        memo = [[-1] * (n + 1) for _ in range(n)]  

        def dfs(i, j):
            if i == n:
                return 0
            if memo[i][j + 1] != -1:
                return memo[i][j + 1]

            LIS = dfs(i + 1, j)

            if j == -1 or nums[j] < nums[i]:
                LIS = max(LIS, 1 + dfs(i + 1, i))

            memo[i][j + 1] = LIS
            return LIS

        return dfs(0, -1)
```
Time Complexity: $O(n^2)$
Space Complexity: $O(n^2)$

### (3) Dynamic Programming (Bottom-Up)
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
Time Complexity: $O(n^2)$
Space Complexity: $O(n)$
### (4) Segment Tree
```python
from bisect import bisect_left
class SegmentTree:
    def __init__(self, N):
        self.n = N
        while (self.n & (self.n - 1)) != 0:
            self.n += 1
        self.tree = [0] * (2 * self.n)

    def update(self, i, val):
        self.tree[self.n + i] = val
        j = (self.n + i) >> 1
        while j >= 1:
            self.tree[j] = max(self.tree[j << 1], self.tree[j << 1 | 1])
            j >>= 1

    def query(self, l, r):
        if l > r:
            return 0
        res = float('-inf')
        l += self.n
        r += self.n + 1
        while l < r:
            if l & 1:
                res = max(res, self.tree[l])
                l += 1
            if r & 1:
                r -= 1
                res = max(res, self.tree[r])
            l >>= 1
            r >>= 1
        return res

class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        def compress(arr):
            sortedArr = sorted(set(arr))
            order = []
            for num in arr:
                order.append(bisect_left(sortedArr, num))
            return order
        
        nums = compress(nums)
        n = len(nums)
        segTree = SegmentTree(n)

        LIS = 0
        for num in nums:
            curLIS = segTree.query(0, num - 1) + 1
            segTree.update(num, curLIS)
            LIS = max(LIS, curLIS)
        return LIS
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(n)$
### (5) Binary Search
```python
from bisect import bisect_left
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        dp = []
        dp.append(nums[0])

        LIS = 1
        for i in range(1, len(nums)):
            if dp[-1] < nums[i]: 
                dp.append(nums[i])
                LIS += 1
                continue

            idx = bisect_left(dp, nums[i])
            dp[idx] = nums[i] 

        return LIS
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(n)$
## References

[^1]: [Longest Increasing Subsequence - Dynamic Programming - Leetcode 300](https://www.youtube.com/watch?v=cjWnW0hdF1Y)
[^2]: https://neetcode.io/solutions/longest-increasing-subsequence