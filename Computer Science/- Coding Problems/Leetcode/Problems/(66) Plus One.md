---
Source:
  - https://leetcode.com/problems/plus-one/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-12-23 at 7.30.27 PM.png|300]]
- Decimal digit is any number between 0 and 9
- This is a linear algorithm
- Time complexity is O(n)
- Memory complexity is O(1)
```python
class Solution:
    def plusOne(self, digits: List[int]) -> List[int]:
        digits = digits[::-1]
        one, i = 1, 0
        while one:
            if i < len(digits):
                if digits[i] == 9:
                    digits[i] = 0
                else:
                    digits[i] += 1
                    one = 0
            else:
                digits.append(1)
                one = 0
            i += 1
        return digits[::-1]
```
## References

[^1]: https://www.youtube.com/watch?v=jIaA8boiG1s