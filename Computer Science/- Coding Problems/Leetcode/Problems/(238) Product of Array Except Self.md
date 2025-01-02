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
## References

[^1]: https://www.youtube.com/watch?v=bNvIQI2wAjk