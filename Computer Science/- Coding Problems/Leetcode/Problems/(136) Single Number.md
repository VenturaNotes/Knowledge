---
Source:
  - https://leetcode.com/problems/single-number/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-05 at 10.27.00 PM.png]]
- Goal is to find the element in the array that does not repeat
- Could use a [[HashSet]] for this problem if allowed to use extra space
- Showing the [[binary representation]] of a number
- Will use the [[binary operation]] [[exclusive or]] (xor)
	- If two [[bits]] are the exact same = 0
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
## References

[^1]: https://www.youtube.com/watch?v=qMPX1AOa83k