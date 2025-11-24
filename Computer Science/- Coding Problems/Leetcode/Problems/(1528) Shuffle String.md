---
Source:
  - https://leetcode.com/problems/shuffle-string/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def restoreString(self, s: str, indices: List[int]) -> str:
        shuffle = ['']*len(indices)
        shuffle_string = ""

        for i in range(len(s)):
            shuffle[indices[i]] = s[i]
        
        for i in shuffle:
            shuffle_string += i
        
        return shuffle_string
```
## Source [^1]
- 
## References

[^1]: 