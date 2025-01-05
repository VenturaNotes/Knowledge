---
Source:
  - https://leetcode.com/problems/binary-search/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-10-18 at 3.03.35 PM.png]]
- [[Binary Search]]
- Algorithm must be in O(logn) complexity to find a `target` within array `nums` and index must be returned
- $log_2n = x$
	- Finding how many times we can divide n by 2
	- Equivalent to saying $2^x = n$
	- It's a log base 2 algorithm which is much more efficient than O(n)
- `m = (l + r) // 2`
	- This might end up being a bug
	- We could calculate the midway point without adding them together potentially creating an overflow problem
	- Could just get the distance between them by doing `l-r`
		- `m = l + ((r -1) // 2)`
			- This will never overflow
```python
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        l, r = 0, len(nums) - 1

        while l <= r:
            # Or could do m = (l+r) // 2
            # with potential overflow error
            m = l + ((r-l) // 2)
            
            if nums[m] > target:
                r = m - 1
            elif nums[m] < target:
                l = m + 1
            else:
                return m
        return -1
```
- The `m = l + ((r-l) // 2)` seems like it won't break either
	- `[0, 1, 2, 3, 4, 5, 6]` if even
		- l = 0
		- r = 6
		- So 3 which works!
	- `[0, 1, 2, 3, 4, 5, 6, 7]` if odd
		- l = 0
		- r = 7
		- So 7-0 = 7 so middle = 3

## Source[^2]
### (1) Recursive Binary Search
```python
class Solution:
    def binary_search(self, l: int, r: int, nums: List[int], target: int) -> int:
        if l > r:
            return -1
        m = l + (r - l) // 2
        
        if nums[m] == target:
            return m
        if nums[m] < target:
            return self.binary_search(m + 1, r, nums, target)
        return self.binary_search(l, m - 1, nums, target)

    def search(self, nums: List[int], target: int) -> int:
        return self.binary_search(0, len(nums) - 1, nums, target)
```
Time Complexity: $O(logn)$
Space Complexity: $O(logn)$

### (2) Iterative Binary Search
```python
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        l, r = 0, len(nums) - 1

        while l <= r:
            # (l + r) // 2 can lead to overflow
            m = l + ((r - l) // 2)  

            if nums[m] > target:
                r = m - 1
            elif nums[m] < target:
                l = m + 1
            else:
                return m
        return -1
```
Time Complexity: $O(logn)$
Space Complexity: $O(1)$

### (3) Upper Bound
```python
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        l, r = 0, len(nums)

        while l < r:
            m = l + ((r - l) // 2)  
            if nums[m] > target:
                r = m
            elif nums[m] <= target:
                l = m + 1
        return l - 1 if (l and nums[l - 1] == target) else -1
```
Time Complexity: $O(logn)$
Space Complexity: $O(1)$

### (4) Lower Bound
```python
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        l, r = 0, len(nums)

        while l < r:
            m = l + ((r - l) // 2)  
            if nums[m] >= target:
                r = m
            elif nums[m] < target:
                l = m + 1
        return l if (l < len(nums) and nums[l] == target) else -1
```
Time Complexity: $O(logn)$
Space Complexity: $O(1)$

### (5) Built-In Function
```python
import bisect
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        index = bisect.bisect_left(nums, target)
        return index if index < len(nums) and nums[index] == target else -1
```
Time Complexity: $O(logn)$
Space Complexity: $O(1)$
## References

[^1]: https://www.youtube.com/watch?v=s4DPM8ct1pI
[^2]: https://neetcode.io/solutions/binary-search