---
Source:
  - https://leetcode.com/problems/check-if-two-string-arrays-are-equivalent/
Reviewed: false
tags:
  - leetcode/solved
---
## Synthesis
### My Solution
```python
class Solution:
    def arrayStringsAreEqual(self, word1: List[str], word2: List[str]) -> bool:
        string1 = ''
        string2 = ''

        for i in word1:
            string1 += i
        for i in word2:
            string2 += i
        
        return string1 == string2
```
## Source [^1]
- 
## References

[^1]: 