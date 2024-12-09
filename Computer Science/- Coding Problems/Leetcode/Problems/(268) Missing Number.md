---
Source:
  - https://leetcode.com/problems/missing-number/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-08 at 10.15.30 PM.png]]
- Return the only number in the range that is missing from the array
	- Example: If you have a range of `[0, 3]` and you're given the numbers `[3, 0, 1]`, you know that 2 is missing from the array as `n = 3`
- Could use hashing for this problem as it takes O(n) extra memory
	- #question is runtime complexity the same as time complexity?
- Will use the [[exclusive or|xor]] operator
	- The symbol used for this is `^`
	- Need to be different (so 0,1 or 1, 0)
- It's a linear time function $O(2n)$ 
- Could subtract the sum of one array by the sum of the other array
	- Don't even need to calculate sum, could do it in O(1) time using [[Gauss's Formula]] which is extra for this problem
```python
class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        res = len(nums)
        
        for i in range(len(nums)):
            res += (i - nums[i])

        return res
```
## References

[^1]: https://www.youtube.com/watch?v=WnPLSRLSANE