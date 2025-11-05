---
Source:
  - https://leetcode.com/problems/richest-customer-wealth/
Reviewed: false
---
## Synthesis
### My Solution
```python
class Solution:
    def maximumWealth(self, accounts: List[List[int]]) -> int:
        mylist = []
        for i in accounts:
            mylist.append(sum(i))
        return max(mylist)
```
## Source [^1]
- 
## References

[^1]: 