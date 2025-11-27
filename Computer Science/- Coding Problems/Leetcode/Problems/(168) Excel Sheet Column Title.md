---
Source:
  - https://leetcode.com/problems/excel-sheet-column-title/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def convertToTitle(self, columnNumber: int) -> str:
        result = []
        n = columnNumber
        
        while n > 0:
            # Need to subtract 1 because A starts at 1 meaning 1-indexed
            n -= 1

            # We find the remainder of n as its base-26 and use ord('A') for reference
            result.append(chr((n % 26) + ord('A')))

            # Able to floor this division because we took remainder above
            n //= 26 
        return "".join(reversed(result))

# Need ord value
# Need place value

"""
It is  base-26, but 1-indexed

ord("A") = 65 

so do ord - 65 
ord("Z") = 90

Examples:
A = 1
Z = 26

ZY = 27
26*26+25 = 701

731 = ABC 

So we know 
ZZ = 702 (which is 26*26 + 26)

AAA = 703 (So 1*26*26 + 1*26 + 1)? (yes)

704 = 

ABC

Need to subtract by 26. Know the right value, but that's it.

So if columnNumber = 1

701 / 26 = 26.96

ZY
"""
```
#### Convert Number to Column Title Test
```python
result = []
n = 731 # Enter any number here

while n > 0:
    n -= 1
    result.append(chr((n % 26) + ord('A')))
    n //= 26

print("".join(reversed(result)))
```

#### Dry Run
- ![[Screenshot 2025-11-26 at 5.15.48 AM.png]]
## Source [^1]
- 
## References

[^1]: 