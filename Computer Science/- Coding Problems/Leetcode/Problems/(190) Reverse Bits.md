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
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def reverseBits(self, n: int) -> int:
        binary = ""
        for i in range(32):
            if n & (1 << i):
                binary += "1"
            else:
                binary += "0"
                
        res = 0
        for i, bit in enumerate(binary[::-1]):
            if bit == "1":
                res |= (1 << i)
                
        return res
```
Time Complexity: $O(1)$
Space Complexity: $O(1)$

### (2) Bit Manipulation
```python
class Solution:
    def reverseBits(self, n: int) -> int:
        res = 0
        for i in range(32):
            bit = (n >> i) & 1
            res += (bit << (31 - i))
        return res
```
Time Complexity: $O(1)$
Space Complexity: $O(1)$

### (3) Bit Manipulation (Optimal)
```python
class Solution:
    def reverseBits(self, n: int) -> int:
        res = n
        res = (res >> 16) | (res << 16) & 0xFFFFFFFF
        res = ((res & 0xff00ff00) >> 8) | ((res & 0x00ff00ff) << 8)
        res = ((res & 0xf0f0f0f0) >> 4) | ((res & 0x0f0f0f0f) << 4)
        res = ((res & 0xcccccccc) >> 2) | ((res & 0x33333333) << 2)
        res = ((res & 0xaaaaaaaa) >> 1) | ((res & 0x55555555) << 1)
        return res & 0xFFFFFFFF
```
Time Complexity: $O(1)$
Space Complexity: $O(1)$
## References

[^1]: [Reverse Bits - Binary - Leetcode 190 - Python](https://www.youtube.com/watch?v=UcoN6UjAI64)
[^2]: https://neetcode.io/solutions/reverse-bits