---
Source:
  - https://leetcode.com/problems/percentage-of-letter-in-string/
Reviewed: false
Approaches: "1"
---
## Synthesis

### My Solution
```python
class Solution:
    def percentageLetter(self, s: str, letter: str) -> int:
        
        count = 0
        for i in s:
            if letter in i:
                count+=1
        
        return int((count/len(s))*100)
```