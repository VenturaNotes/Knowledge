---
Source:
  - https://leetcode.com/problems/binary-search/
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

## References

[^1]: https://www.youtube.com/watch?v=s4DPM8ct1pI