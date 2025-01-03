---
Source:
  - https://leetcode.com/problems/multiply-strings/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2025-01-02 at 11.56.45 PM.png]]
- Need to multiply two numbers that are strings without converting the inputs to integers directly
- Time complexity: $O(n*m)$ where
	- `n` is number of digits in first value and `m` is number of digits in second value
- Memory complexity: $O(n+m)$
	- Will have additional array to have all the output digits inside of it and then convert it to string in end
```python
class Solution:
    def multiply(self, num1: str, num2: str) -> str:
        if "0" in [num1, num2]:
            return "0"
        res = [0] * (len(num1) + len(num2))
        num1, num2 = num1[::-1], num2[::-1]

        for i1 in range(len(num1)):
            for i2 in range(len(num2)):
                digit = int(num1[i1]) * int(num2[i2])
                res [i1 + i2] += digit
                res[i1 + i2 + 1] += (res[i1 + i2] // 10)
                res[i1 + i2] = res[i1 + i2] % 10
        res, beg = res[::-1], 0
        while beg < len(res) and res[beg] == 0:
            beg += 1
        
        res = map(str, res[beg:])
        return "".join(res)
```
## References

[^1]: https://www.youtube.com/watch?v=1vZswirL8Y8