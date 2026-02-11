---
Source:
  - https://leetcode.com/problems/maximum-product-subarray/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-29 at 6.36.48 PM.png]]
- [[Dynamic programming]] problem
	- Largest contiguous subarray
- Brute force would be $n^2$ 
	- If we have positive numbers, product will always be increasing
	- All negative numbers, sign alternating
- Need to keep track of minimum product subarray 
- Given the edge case of 0, will reset everything to a neutral value like 1
```python
class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        res = max(nums)
        curMin, curMax = 1, 1

        for n in nums:
            if n == 0:
                curMin, curMax = 1, 1
                continue
            tmp = curMax * n
            curMax = max(n*curMax, n*curMin, n)
            curMin = min(tmp, n*curMin, n)
            res = max(res, curMax)
        return res
```
- The if-statement is completely unnecessary (but still works)
- By the time the `n` value is out of bounds, we will have current max and current min of entire array computed
- Time complexity: $O(n)$
- Memory Complexity: $O(1)$ 
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        res = nums[0]

        for i in range(len(nums)):
            cur = nums[i]
            res = max(res, cur)
            for j in range(i + 1, len(nums)):
                cur *= nums[j]
                res = max(res, cur)
                
        return res
```
Time Complexity: $O(n^2)$
Space Complexity: $O(1)$
### (2) Sliding Window
```python
class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        A = []
        cur = []
        res = float('-inf')

        for num in nums:
            res = max(res, num)
            if num == 0:
                if cur:
                    A.append(cur)
                cur = []
            else:
                cur.append(num)

        if cur:
            A.append(cur)

        for sub in A:
            negs = sum(1 for i in sub if i < 0)
            prod = 1
            need = negs if negs % 2 == 0 else negs - 1
            negs = 0
            j = 0

            for i in range(len(sub)):
                prod *= sub[i]
                if sub[i] < 0:
                    negs += 1
                    while negs > need:
                        prod //= sub[j]
                        if sub[j] < 0:
                            negs -= 1
                        j += 1
                if j <= i:
                    res = max(res, prod)

        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
### (3) Kadane's Algorithm
```python
class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        res = nums[0]
        curMin, curMax = 1, 1

        for num in nums:
            tmp = curMax * num
            curMax = max(num * curMax, num * curMin, num)
            curMin = min(tmp, num * curMin, num)
            res = max(res, curMax)
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$

### (4) Prefix & Suffix
```python
class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        n, res = len(nums), nums[0]
        prefix = suffix = 0

        for i in range(n):
            prefix = nums[i] * (prefix or 1)
            suffix = nums[n - 1 - i] * (suffix or 1)
            res = max(res, max(prefix, suffix))
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$
## References

[^1]: [Maximum Product Subarray - Dynamic Programming - Leetcode 152](https://www.youtube.com/watch?v=lXVy6YWFcRM)
[^2]: https://neetcode.io/solutions/maximum-product-subarray