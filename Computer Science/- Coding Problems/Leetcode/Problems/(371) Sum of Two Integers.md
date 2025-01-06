---
Source:
  - https://leetcode.com/problems/sum-of-two-integers/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-08 at 10.44.39 PM.png]]
- Must return the sum of two integers without using the `+` and `-` [[operator|operators]]
- Need to use [[bit manipulation]] for this
- Will use [[exclusive or|xor]] operation
- Will use & operator if you have a carry
- Time complexity is O(1) as the integers `a,b` will be between -1000 and 1000
- Negative numbers handles themselves
- In python, their integers are arbitrarily large, they're not 32 bit. So it might run into problems with this algorithm
```java
class Solution {
    public int getSum(int a, int b) {
        while (b != 0) {
            int tmp = (a & b) << 1;
            a = a ^ b;
            b = tmp;
        }
        return a;
    }
}
```
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def getSum(self, a: int, b: int) -> int:
        return a + b
```
Time Complexity: $O(1)$
Space Complexity: $O(1)$

### (2) Bit Manipulation
```python
class Solution:
    def getSum(self, a: int, b: int) -> int:
        carry = 0
        res = 0
        mask = 0xFFFFFFFF

        for i in range(32):
            a_bit = (a >> i) & 1
            b_bit = (b >> i) & 1
            cur_bit = a_bit ^ b_bit ^ carry
            carry = (a_bit + b_bit + carry) >= 2
            if cur_bit:
                res |= (1 << i)

        if res > 0x7FFFFFFF:
            res = ~(res ^ mask)
            
        return res
```
Time Complexity: $O(1)$
Space Complexity: $O(1)$

### (3) Bit Manipulation (Optimal)
```python
class Solution:
    def getSum(self, a: int, b: int) -> int:
        mask = 0xFFFFFFFF
        max_int = 0x7FFFFFFF

        while b != 0:
            carry = (a & b) << 1
            a = (a ^ b) & mask
            b = carry & mask

        return a if a <= max_int else ~(a ^ mask)
```
Time Complexity: $O(1)$
Space Complexity: $O(1)$
## References

[^1]: https://www.youtube.com/watch?v=gVUrDV4tZfY
[^2]: https://neetcode.io/solutions/sum-of-two-integers