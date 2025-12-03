---
Source:
  - https://leetcode.com/problems/keyboard-row/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def findWords(self, words: List[str]) -> List[str]:
        emptyList = []
        # Could turn these into sets for faster lookup time
        f_row = "qwertyuiopQWERTYUIOP"
        s_row = "asdfghjklASDFGHJKL"
        t_row = "zxcvbnmZXCVBNM"

        for i in words:
            v1, v2, v3 = True, True, True
            for j in i:
                print(j)
                if j not in f_row:
                    v1 = False
                if j not in s_row:
                    v2 = False
                if j not in t_row:
                    v3 = False
            if v1 or v2 or v3:
                emptyList.append(i)

        return emptyList
```
## Source [^1]
- 
## References

[^1]: 