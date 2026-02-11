---
Source:
  - https://leetcode.com/problems/plus-one/
Reviewed: false
Approaches: "1"
---
## Synthesis

### My Solution
```python
class Solution:
    def plusOne(self, digits: List[int]) -> List[int]:
        value = 0
        length = len(digits)
        for i in range(len(digits)):
            value += digits[i] * pow(10,length-i-1)
        value += 1

        my_list = []

        for digit_char in str(value):
	        my_list.append(int(digit_char))
        return my_list

"""
len([1, 2, 3]) = 3
index = 0 (so we want to multiply by 100)
3-0 - 1 = 10^2 power!
10^0 = 1 as well
So 10^2 power would be good

 my_int = 12345
    for digit_char in str(my_int):
        digit_int = int(digit_char)
        print(digit_int)

"""
```
- Iterate through each element in the list. Find its place-value by comparing it to the length of the list. Then add 1 to the digit. Then convert new integer back into list.
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
## Source[^2]
### (1) Recursion
```python
class Solution:
    def plusOne(self, digits: List[int]) -> List[int]:
        if not digits:
            return [1]

        if digits[-1] < 9:
            digits[-1] += 1
            return digits
        else:
            return self.plusOne(digits[:-1]) + [0]
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
### (2) Iteration
```python
class Solution:
    def plusOne(self, digits: List[int]) -> List[int]:
        one = 1
        i = 0
        digits = digits[::-1]

        while one:
            if i < len(digits):
                if digits[i] == 9:
                    digits[i] = 0
                else:
                    digits[i] += 1
                    one = 0
            else:
                digits.append(one)
                one = 0
            i += 1
        return digits[::-1]
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$
### (3) Iteration (Optimal)
```python
class Solution:
    def plusOne(self, digits: List[int]) -> List[int]:
        n = len(digits)
        for i in range(n - 1, -1, -1):
            if digits[i] < 9:
                digits[i] += 1
                return digits
            digits[i] = 0
        
        return [1] + digits
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$
## References

[^1]: [Plus One - Leetcode 66 - Python](https://www.youtube.com/watch?v=jIaA8boiG1s)
[^2]: https://neetcode.io/solutions/plus-one