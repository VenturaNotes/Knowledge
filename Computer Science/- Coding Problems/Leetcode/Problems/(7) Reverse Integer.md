---
Source:
  - https://leetcode.com/problems/reverse-integer
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-08 at 11.01.02 PM.png]]
- Assume the environment does not allow you to store 64-bit integers (signed or unsigned)
	- This is what makes the question difficult
- How to show if digits overflow
```python
class Solution:
    def reverse(self, x: int) -> int:
        # Integer.MAX_VALUE = 2147483647 (end with 7)
        # Integer.MIN_VALUE = -2147483648 (end with -8)

        MIN = -2147483648 # -2^31,
        MAX = 2147483647 # 2^31 - 1

        res = 0
        while x:
            digit = int(math.fmod(x, 10)) # (python dumb) - 1 % 10 = 9
            x = int(x / 10)               # (python dumb) -1 // 10 = -1

            if (res > MAX // 10 or
                (res == MAX // 10 and digit >= MAX % 10)):
                return 0
            if (res < MIN // 10 or
                (res == MIN // 10 and digit <= MIN % 10)):
                return 0
            res = (res * 10) + digit
        return res
        
```
- Pretty much as efficient as it can possibly be
## References

[^1]: https://www.youtube.com/watch?v=HAgLH58IgJQ