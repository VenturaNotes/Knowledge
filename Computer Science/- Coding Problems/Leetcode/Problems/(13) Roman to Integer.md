---
Source:
  - https://leetcode.com/problems/roman-to-integer
Reviewed: false
tags:
  - in-progress
---
## Synthesis
### My Solution
```python
class Solution:
    def romanToInt(self, s: str) -> int:
        i = 0
        x = 0
        while i < len(s):
            
            if s[i] == "I":
                if i+1 < len(s):
                    if s[i + 1] == "V":
                        x+=4
                        i+=2
                        continue
                    elif s[i + 1] == "X":
                        x+=9
                        i+=2
                        continue
                    else:
                        x+=1
                else:
                    x+=1

            if s[i] == "V":
                x+= 5

            if s[i] == "X":
                if i+1 < len(s):
                    if s[i + 1] == "L":
                        x+=40
                        i+=2
                        continue
                    elif s[i + 1] == "C":
                        x+=90
                        i+=2
                        continue
                    else:
                        x+=10
                else:
                    x+=10

            if s[i] == "L":
                x+= 50

            if s[i] == "C":
                if i+1 < len(s):
                    if s[i + 1] == "D":
                        x+=400
                        i+=2
                        continue
                    elif s[i + 1] == "M":
                        x+=900
                        i+=2
                        continue
                    else:
                        x+=100
                else:
                    x+=100

            if  s[i] == "D":
                x+= 500

            if s[i] == "M":
                x+= 1000

            i+=1
        return x
```
- I just created a while loop to go through the string and check to see if an index ahead is a special character. Checked for 6 cases.
## Source[^1]
- 
## References
[^1]: 