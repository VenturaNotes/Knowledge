---
Source:
  - https://leetcode.com/problems/reverse-integer
Reviewed: false
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
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def reverse(self, x: int) -> int:
        org = x
        x = abs(x)
        res = int(str(x)[::-1])
        if org < 0:
            res *= -1
        if res < -(1 << 31) or res > (1 << 31) - 1:
            return 0
        return res
```
Time Complexity: $O(1)$
Space Complexity: $O(1)$
### (2) Recursion
```python
class Solution:
    def reverse(self, x: int) -> int:
        def rec(n: int, rev: int) -> int:
            if n == 0:
                return rev
            
            rev = rev * 10 + n % 10
            return rec(n // 10, rev)
        
        sign = -1 if x < 0 else 1
        x = abs(x)        
        reversed_num = rec(x, 0)
        reversed_num *= sign        
        if reversed_num < -(1 << 31) or reversed_num > (1 << 31) - 1:
            return 0
            
        return reversed_num
```
Time Complexity: $O(1)$
Space Complexity: $O(1)$
### (3) Iteration
```python
class Solution:
    def reverse(self, x: int) -> int:
        MIN = -2147483648  # -2^31,
        MAX = 2147483647  #  2^31 - 1

        res = 0
        while x:
            digit = int(math.fmod(x, 10))
            x = int(x / 10)

            if res > MAX // 10 or (res == MAX // 10 and digit > MAX % 10):
                return 0
            if res < MIN // 10 or (res == MIN // 10 and digit < MIN % 10):
                return 0
            res = (res * 10) + digit

        return res
```
Time Complexity: $O(1)$
Space Complexity: $O(1)$
## References

[^1]: https://www.youtube.com/watch?v=HAgLH58IgJQ
[^2]: https://neetcode.io/solutions/reverse-integer