---
Source:
  - https://leetcode.com/problems/number-of-lines-to-write-string/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def numberOfLines(self, widths: List[int], s: str) -> List[int]:
        count = 0
        rows = 1

        print(ord('a')-ord('a'))

        for i in s:
            if count + widths[ord(i)-ord('a')] > 100:
                count = widths[ord(i)-ord('a')]
                rows += 1
            else:
                count += widths[ord(i)-ord('a')]

        return [rows, count]
"""
string s: lowercase
widths: Denotes how many pixels wide each lowercase English letter is
"""
```
## Source [^1]
- 
## References

[^1]: 