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
## Source[^2]
### (1) Multiplication & Addition
```python
class Solution:
    def multiply(self, num1: str, num2: str) -> str:
        if num1 == "0" or num2 == "0":
            return "0"
        
        if len(num1) < len(num2):
            return self.multiply(num2, num1)
        
        res, zero = "", 0
        for i in range(len(num2) - 1, -1, -1):
            cur = self.mul(num1, num2[i], zero)
            res = self.add(res, cur)
            zero += 1
        
        return res
    
    def mul(self, s: str, d: str, zero: int) -> str:
        i, carry = len(s) - 1, 0
        d = int(d)
        cur = []

        while i >= 0 or carry:
            n = int(s[i]) if i >= 0 else 0
            prod = n * d + carry
            cur.append(str(prod % 10))
            carry = prod // 10
            i -= 1
        
        return ''.join(cur[::-1]) + '0' * zero

    def add(self, num1: str, num2: str) -> str:
        i, j, carry = len(num1) - 1, len(num2) - 1, 0
        res = []

        while i >= 0 or j >= 0 or carry:
            n1 = int(num1[i]) if i >= 0 else 0
            n2 = int(num2[j]) if j >= 0 else 0
            total = n1 + n2 + carry
            res.append(str(total % 10))
            carry = total // 10
            i -= 1
            j -= 1
        
        return ''.join(res[::-1])
```
Time Complexity: $O(min(m,n)*(m+n))$
Space Complexity: $O(m+n)$
- Where $m$ is the length of the string $num1$ and $n$ is the length of the string $num2$
### (2) Multiplication
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
                res[i1 + i2] += digit
                res[i1 + i2 + 1] += res[i1 + i2] // 10
                res[i1 + i2] = res[i1 + i2] % 10

        res, beg = res[::-1], 0
        while beg < len(res) and res[beg] == 0:
            beg += 1
        res = map(str, res[beg:])
        return "".join(res)
```
Time Complexity: $O(m*n)$
Space Complexity: $O(m+n)$
- Where $m$ is the length of the string $num1$ and $n$ is the length of the string $num2$ 
## References

[^1]: https://www.youtube.com/watch?v=1vZswirL8Y8
[^2]: https://neetcode.io/solutions/multiply-strings