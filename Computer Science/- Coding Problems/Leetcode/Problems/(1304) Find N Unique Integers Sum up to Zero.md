---
Source:
  - https://leetcode.com/problems/find-n-unique-integers-sum-up-to-zero/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def sumZero(self, n: int) -> List[int]:
        my_list = []

        for i in range(int(n/-2),int((n/2)+1)):
            if i != 0:
                my_list.append(i)
        if n % 2 != 0:
            my_list.append(0)

        return my_list

"""
If you get n = 5 for example, you just
want the numbers within the list to add up
up to 5

So, if you have an even number, then just populate with positive
and negative number opposites
So you have -1, 1, -2, 2, etc.

If you have an odd number, that extra one will just be 0. 
"""
```
## Source [^1]
- 
## References

[^1]: 