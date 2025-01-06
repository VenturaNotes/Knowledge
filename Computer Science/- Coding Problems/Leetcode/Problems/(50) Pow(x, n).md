---
Source:
  - https://leetcode.com/problems/powx-n/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-23 at 7.35.20 PM.png|400]]
- There is a [[divide and conquer]] way to solve this problem
- Time complexity is $O(log_2n)$ 
- The divide and conquer approach will lend itself to recursion
- Just two base cases to consider
	- n = 0, ret 1
	- x = 0, ret 0
```python
class Solution:
    def myPow(self, x: float, n: int) -> float:
        # x^-n = 1 / x^n
        def helper(x, n):
            if x == 0: return 0
            if n == 0: return 1

            res = helper(x, n // 2)
            res = res * res
            return x * res if n % 2 else res
        
        res = helper(x, abs(n))
        return res if n >= 0 else 1 / res 
```
- Ever so slightly more efficient `x*x`
```python
class Solution:
    def myPow(self, x: float, n: int) -> float:
        # x^-n = 1 / x^n
        def helper(x, n):
            if x == 0: return 0
            if n == 0: return 1

            res = helper(x*x, n // 2) # silghtly more efficient
            return x * res if n % 2 else res
        
        res = helper(x, abs(n))
        return res if n >= 0 else 1 / res
```
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def myPow(self, x: float, n: int) -> float:
        if x == 0:
            return 0
        if n == 0:
            return 1

        res = 1
        for i in range(abs(n)):
            res *= x
        return res if n >= 0 else 1 / res
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$
### (2) Binary Exponentiation (Recursive)
```python
class Solution:
    def myPow(self, x: float, n: int) -> float:
        def helper(x, n):
            if x == 0:
                return 0
            if n == 0:
                return 1

            res = helper(x * x, n // 2)
            return x * res if n % 2 else res

        res = helper(x, abs(n))
        return res if n >= 0 else 1 / res
```
Time Complexity: $O(logn)$
Space Complexity: $O(logn)$
### (3) Binary Exponentiation (Iterative)
```python
class Solution:
    def myPow(self, x: float, n: int) -> float:
        if x == 0:
            return 0
        if n == 0:
            return 1
        
        res = 1
        power = abs(n)
        
        while power:
            if power & 1:
                res *= x
            x *= x
            power >>= 1
        
        return res if n >= 0 else 1 / res
```
Time Complexity: $O(logn)$
Space Complexity: $O(1)$
## References

[^1]: https://www.youtube.com/watch?v=g9YQyYi4IQQ
[^2]: https://neetcode.io/solutions/powx-n