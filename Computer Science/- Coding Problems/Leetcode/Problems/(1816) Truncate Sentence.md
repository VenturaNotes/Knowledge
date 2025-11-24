---
Source:
  - https://leetcode.com/problems/truncate-sentence/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def truncateSentence(self, s: str, k: int) -> str:
        copy = ""
        count = 0
        for i in s:
            if i == ' ':
                count += 1
                if count == k:
                    break
                copy += i
            else:
                copy += i
        return copy
```
## Source [^1]
- 
## References

[^1]: 