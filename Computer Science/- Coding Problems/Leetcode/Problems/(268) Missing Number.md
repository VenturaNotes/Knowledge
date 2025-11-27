---
Source:
  - https://leetcode.com/problems/missing-number/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        my_sum = sum(nums)
        
        # Don't need -1 because sum of natural numbers doesn't include 0
        length = len(nums)
        return ((length*(length+1))//2) - my_sum
```
- I used a formula to calculate the sum of the first `n` natural numbers
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
## Source[^2]
### (1) Sorting
```python
class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        n = len(nums)
        nums.sort()
        for i in range(n):
            if nums[i] != i:
                return i
        return n
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(1)$ or $O(n)$ depending on the sorting algorithm
### (2) Hash Set
```python
class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        num_set = set(nums)
        n = len(nums)
        for i in range(n + 1):
            if i not in num_set:
                return i
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
### (3) Bitwise XOR
```python
class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        n = len(nums)
        xorr = n  
        for i in range(n):
            xorr ^= i ^ nums[i]
        return xorr
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$
### (4) Math
```python
class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        res = len(nums)

        for i in range(len(nums)):
            res += i - nums[i]
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$
## References

[^1]: https://www.youtube.com/watch?v=WnPLSRLSANE
[^2]: https://neetcode.io/solutions/missing-number