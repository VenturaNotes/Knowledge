---
Source:
  - https://leetcode.com/problems/happy-number/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-23 at 7.25.16 PM.png]]
- If happy, return true. Otherwise, false. 
- Can use [[HashSet]] to use if a number occurs twice
	- Can instantly know in constant speed if we found a number twice
```python
class Solution:
    def isHappy(self, n: int) -> bool:
        visit = set() # MEMORY O(n)

        while n not in visit:
            visit.add(n)
            n = self.sumOfSquares(n)

            if n == 1:
                return True
        return False
    
    def sumOfSquares(self, n: int) -> int:
        output = 0

        while n:
            digit = n % 10
            digit = digit ** 2
            output += digit
            n = n // 10
        return output
```
## Source[^2]
### (1) Hash Set
```python
class Solution:
    def isHappy(self, n: int) -> bool:
        visit = set()

        while n not in visit:
            visit.add(n)
            n = self.sumOfSquares(n)
            if n == 1:
                return True
        return False

    def sumOfSquares(self, n: int) -> int:
        output = 0

        while n:
            digit = n % 10
            digit = digit ** 2
            output += digit
            n = n // 10
        return output
```
Time Complexity: $O(logn)$
Space Complexity: $O(logn)$
### (2) Fast And Slow Pointers - I
```python
class Solution:
    def isHappy(self, n: int) -> bool:
        slow, fast = n, self.sumOfSquares(n)

        while slow != fast:
            fast = self.sumOfSquares(fast)
            fast = self.sumOfSquares(fast)
            slow = self.sumOfSquares(slow)
        return True if fast == 1 else False
    
    def sumOfSquares(self, n: int) -> int:
        output = 0

        while n:
            digit = n % 10
            digit = digit ** 2
            output += digit
            n = n // 10
        return output
```
Time Complexity: $O(logn)$
Space Complexity: $O(1)$
### (3) Fast And Slow Pointers - II
```python
class Solution:
    def isHappy(self, n: int) -> bool:
        slow, fast = n, self.sumOfSquares(n)
        power = lam = 1
        
        while slow != fast:
            if power == lam:
                slow = fast
                power *= 2
                lam = 0
            fast = self.sumOfSquares(fast)
            lam += 1
        return True if fast == 1 else False
    
    def sumOfSquares(self, n: int) -> int:
        output = 0

        while n:
            digit = n % 10
            digit = digit ** 2
            output += digit
            n = n // 10
        return output
```
Time Complexity: $O(logn)$
Space Complexity: $O(1)$
## References

[^1]: https://www.youtube.com/watch?v=ljz85bxOYJ0
[^2]: https://neetcode.io/solutions/happy-number