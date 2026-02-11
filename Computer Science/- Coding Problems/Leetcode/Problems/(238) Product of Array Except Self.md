---
Source:
  - https://leetcode.com/problems/product-of-array-except-self/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-10-09 at 5.41.22 AM.png]]
- Problem is asking to find the product of all the numbers within `nums` without multiplying the number in `nums[i]`. For example, given `[1, 2, 3, 4]`, `answer[0]` should be 24 because `2*3*4 = 24`. Then for `answer[1]`, we would have `1*3*4 = 12`. and so on until `answer[3]`
- Condition is that we most solve in O(n) time and we can't use division.
- Could compute the prefix product and postfix product in O(n) time.
- The output array does not count as extra memory. 
	- Using the prefix and postfix arrays would cause O(n) memory. However, could just store in output array.
- Will do two passes on input array `nums`
	- First pass will go from beginning to end for prefix
	- Second pass will go from end to beginning for postfix
- Can solve the problem with O(n) time complexity and O(1) memory complexity
	- In terms of the memory complexity, it's for the context of this problem
```python
class Solution:
	def productExceptSelf(self, nums: List[int]) -> List[int]:
		res = [1] * (len(nums))

		prefix = 1
		for i in range(len(nums)):
			res[i] = prefix
			prefix *= nums[i]
		postfix = 1
		for i in range(len(nums) - 1, -1, -1):
			res[i] *= postfix
			postfix *= nums[i]
		return res
```
- Algorithm example:
	- Given `[1, 2, 3, 4]`, get the multiplication output
	- `res = [1, 1, 1, 1]`
	- First for loop
		- First iteration
			- `res = [1, 1, 1, 1]`
			- `prefix = 1`
		- Second iteration
			- `res = [1, 1, 1, 1]`
			- `prefix = 2`
		- Third iteration
			- `res = [1, 1, 2, 1`
			- `prefix = 6`
		- Fourth iteration
			- `res = [1, 1, 2, 6]`
			- `prefix = 24` (but ignored)
	- Second for loop
		-  First iteration
			- `res = [1, 1, 2, 6]`
			- `postfix = 4`
		- Second iteration
			- `res = [1, 1, 8, 6]`
			- `postfix = 12`
		- Third iteration
			- `res = [1, 12, 8, 6]`
			- `postfix = 24`
		- Fourth iteration
			- `res = [24, 12, 8, 6]`
			- `postfix = 24` (but ignored)

## Sources[^2]
### (1) Brute Force
```python
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        res = [0] * n

        for i in range(n):
            prod = 1
            for j in range(n):
                if i == j:
                    continue    
                prod *= nums[j]
            
            res[i] = prod
        return res
```
Time Complexity: $O(n^2)$
Space Complexity: $O(1)$ since the output array is excluded from space analysis
### (2) Division
```python
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        prod, zero_cnt = 1, 0
        for num in nums:
            if num:
                prod *= num
            else:
                zero_cnt +=  1
        if zero_cnt > 1: return [0] * len(nums)

        res = [0] * len(nums)
        for i, c in enumerate(nums):
            if zero_cnt: res[i] = 0 if c else prod
            else: res[i] = prod // c
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$ since the output array is excluded from space analysis

### (3) Prefix & Suffix
```python
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        res = [0] * n
        pref = [0] * n
        suff = [0] * n

        pref[0] = suff[n - 1] = 1
        for i in range(1, n):
            pref[i] = nums[i - 1] * pref[i - 1]
        for i in range(n - 2, -1, -1):
            suff[i] = nums[i + 1] * suff[i + 1]
        for i in range(n):
            res[i] = pref[i] * suff[i] 
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$

### (4) Prefix & Suffix (Optimal)
```python
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        res = [1] * (len(nums))

        prefix = 1
        for i in range(len(nums)):
            res[i] = prefix
            prefix *= nums[i]
        postfix = 1
        for i in range(len(nums) - 1, -1, -1):
            res[i] *= postfix
            postfix *= nums[i]
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$ since the output array is excluded from space analysis
## References

[^1]: [Product of Array Except Self - Leetcode 238 - Python](https://www.youtube.com/watch?v=bNvIQI2wAjk)
[^2]: https://neetcode.io/solutions/product-of-array-except-self