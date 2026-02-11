---
Source:
  - https://leetcode.com/problems/length-of-last-word/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def lengthOfLastWord(self, s: str) -> int:
        test = s.split()
        return len(test[-1])
```
- Turns the string into a list by creating elements that are separated by whitespaces
## Source [^1]
- 
## References

[^1]: [Length of Last Word - Leetcode 58 - Python](https://www.youtube.com/watch?v=KT9rltZTybQ)