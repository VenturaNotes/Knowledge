---
Source:
  - https://leetcode.com/problems/happy-number/
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
## References

[^1]: https://www.youtube.com/watch?v=ljz85bxOYJ0