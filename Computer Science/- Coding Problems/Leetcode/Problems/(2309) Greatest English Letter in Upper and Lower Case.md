---
Source:
  - https://leetcode.com/problems/greatest-english-letter-in-upper-and-lower-case/
Reviewed: false
---
## Synthesis
### My Solution
```python
class Solution:
    def greatestLetter(self, s: str) -> str:
        test = [''] * 26

        for i in s:
            if i not in test[ord(i.lower()) - ord('a')]:
                test[ord(i.lower()) - ord('a')] += i

        test.reverse()
        for i in test:
            if len(i) == 2:
                return i[0].upper()
        return ''
```
- I first made an empty `test` list of 26 indexes so that each element can potentially contain `aA`. I looped through the string and added them in the `test` list. Then I reversed the string and whichever string had a length of 2 was the greatest english letter which contained both an upper and lower case. 
## Source [^1]
- 
## References

[^1]: 