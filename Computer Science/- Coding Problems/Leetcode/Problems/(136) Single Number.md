---
Source:
  - https://leetcode.com/problems/single-number/
Reviewed: false
---
## Synthesis

### My Solution
```python
class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        my_set = set()

        for i in nums:
            if i in my_set:
                my_set.remove(i)
            elif i not in my_set:
                my_set.add(i)
        for i in my_set:
            return i   
```
## Source [^1]
- ![[Screenshot 2024-12-05 at 10.27.00 PM.png]]
- Goal is to find the element in the array that does not repeat
- Could use a [[HashSet]] for this problem if allowed to use extra space
- Showing the [[binary representation]] of a number
- Will use the [[binary operation]] [[exclusive or]] (xor)
	- If two [[bit|bits]] are the exact same = 0
	- If two bits are different = 1
- If we xor together all of them, the result will be the single value
	- Order of xor operation is not important
```python
class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        res = 0 # n ^ 0 = n
        for n in nums:
            res = n ^ res
        return res
```
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        for i in range(len(nums)):
            flag = True
            for j in range(len(nums)):
                if i != j and nums[i] == nums[j]:
                    flag = False
                    break
            if flag:
                return nums[i]
```
Time Complexity: $O(n^2)$
Space Complexity: $O(1)$
### (2) Hash Set
```python
class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        seen = set()
        for num in nums:
            if num in seen:
                seen.remove(num)
            else:
                seen.add(num)
        return list(seen)[0]
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$

### (3) Sorting
```python
class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        nums.sort()
        i = 0
        while i < len(nums) - 1:
            if nums[i] == nums[i + 1]:
                i += 2
            else:
                return nums[i]
        return nums[i]
```
Time Complexity: $O(nlogn)$
Space Complexity: $O(1)$ or $O(n)$ depending on the sorting algorithm
### (4) Bit Manipulation
```python
class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        res = 0
        for num in nums:
            res = num ^ res
        return res
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$ 
## References

[^1]: https://www.youtube.com/watch?v=qMPX1AOa83k
[^2]: https://neetcode.io/solutions/single-number