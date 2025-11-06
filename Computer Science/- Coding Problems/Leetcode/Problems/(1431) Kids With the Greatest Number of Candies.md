---
Source:
  - https://leetcode.com/problems/kids-with-the-greatest-number-of-candies/
Reviewed: false
tags:
  - leetcode/solved
---
## Synthesis
### My Solution
```python
class Solution:
    def kidsWithCandies(self, candies: List[int], extraCandies: int) -> List[bool]:
        valid = []

        for i in candies:
            if i + extraCandies >= max(candies):
                valid.append(True)
            else:
                valid.append(False)
        return valid

"""
This is a >= problem
Might be a heap type of problem

What is a way to instantly find the maximum in a list. Would I use a heap setup? 
"""
```
- I don't think I need a heap for this problem since the `candies` list is static and not dynamic.

### My Solution 2 (Improvement)
```python
class Solution:
    def kidsWithCandies(self, candies: List[int], extraCandies: int) -> List[bool]:
        valid = []
        max_value = max(candies)

        for i in candies:
            if i + extraCandies >= max_value:
                valid.append(True)
            else:
                valid.append(False)
        return valid
```
- I just calculated the maximum value once instead of every time in the for loop
## Source [^1]
- 
## References

[^1]: 