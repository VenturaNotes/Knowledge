---
Source:
  - https://leetcode.com/problems/find-words-containing-character/description/
---
## Synthesis
### My Solution
```python
class Solution:
    def findWordsContaining(self, words: List[str], x: str) -> List[int]:
        arr = []
        for i in range(len(words)):
            if x in words[i]:
                arr.append(i)
        return arr
```
## Source [^1]
- 
## References

[^1]: 