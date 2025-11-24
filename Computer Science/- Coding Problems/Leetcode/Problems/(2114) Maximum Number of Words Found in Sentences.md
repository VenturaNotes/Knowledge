---
Source:
  - https://leetcode.com/problems/maximum-number-of-words-found-in-sentences/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def mostWordsFound(self, sentences: List[str]) -> int:
        
        max_value = 0
        for i in sentences:
            if i.count(' ') > max_value:
                max_value = i.count(' ')
        return max_value + 1
```
## Source [^1]
- 
## References

[^1]: 