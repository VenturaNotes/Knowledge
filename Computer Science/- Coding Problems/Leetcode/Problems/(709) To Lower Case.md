---
Source:
  - https://leetcode.com/problems/to-lower-case/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def toLowerCase(self, s: str) -> str:
        new_string = ""
        for i in s:
            new_string += i.lower()
        return new_string
```
- Below also works
```python
class Solution:
    def toLowerCase(self, s: str) -> str:
        return s.lower()
```
## Source [^1]
- 
## References

[^1]: 