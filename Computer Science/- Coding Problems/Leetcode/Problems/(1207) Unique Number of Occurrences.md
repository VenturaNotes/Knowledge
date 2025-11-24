---
Source:
  - https://leetcode.com/problems/unique-number-of-occurrences/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def uniqueOccurrences(self, arr: List[int]) -> bool:
        mydict = {}
        myset = set()

        for i in arr:
            mydict[i] = mydict.get(i,0)+1
        for value in mydict.values():
            myset.add(value)
        return len(myset) == len(mydict)
```
## Source [^1]
- 
## References

[^1]: 