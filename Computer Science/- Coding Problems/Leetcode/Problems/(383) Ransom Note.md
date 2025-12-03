---
Source:
  - https://leetcode.com/problems/ransom-note/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def canConstruct(self, ransomNote: str, magazine: str) -> bool:
        test = list(magazine)
        for i in ransomNote:
            if i in test:
                test.remove(i)
            else:
                return False
        return True
```
## Source [^1]
- 
## References

[^1]: 