---
Source:
  - https://leetcode.com/problems/reverse-bits/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-08 at 10.06.24 PM.png|400]]
- Good idea to refresh yourself on the bit manipulation operations
	- #question do some research on this
- Reverse bits of a given 32 bits [[unsigned integer]]
- Could use logic & for this.
- For `01 << 1 = 10`
	- This is a [[bit shift]] operation
- Can use logic `or`
```python
class Solution:
    def reverseBits(self, n: int) -> int:
        res = 0

        for i in range(32):
            bit = (n >> i) & 1
            res = res | (bit << (31-i))
        return res
```
- O(1) time and space solution
## References

[^1]: https://www.youtube.com/watch?v=UcoN6UjAI64