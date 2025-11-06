---
Source:
  - https://leetcode.com/problems/find-first-palindromic-string-in-the-array/
Reviewed: false
tags:
  - leetcode/solved
---
## Synthesis

### My Solution
```python
class Solution:
    def firstPalindrome(self, words: List[str]) -> str:
        for i in words:
            f = 0
            l = len(i)-1

            for j in i:
                if i[f] == i[l]:
                    f+=1
                    l -=1
                    if f >= l:
                        return i 
                    continue
                else:
                    break
        return ""
                
"""
Left and right pointer solution

The palindrome doesn't necessarily have to be odd because you could have a word like 'hhhh' and while it's even, it is still written the same way forwards and backwards 
"""
```
## Source [^1]
- 
## References

[^1]: 