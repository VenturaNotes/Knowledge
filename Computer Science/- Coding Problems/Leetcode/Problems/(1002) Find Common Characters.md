---
Source:
  - https://leetcode.com/problems/find-common-characters/
Reviewed: false
Approaches: "1"
---
## Synthesis
### Approach #1
```python
class Solution:
    def commonChars(self, words: List[str]) -> List[str]:
        
        # Create a list with 26 indices of value 0
        freq = [0] * 26
        
        # Find frequency of characters in first word
        for ch in words[0]:
            freq[ord(ch) - ord('a')] += 1

        # Loop through strings in words (not including first)
        for w in words[1:]:

            #Empty list of 26 indices
            curr = [0] * 26
            # Find frequency of characters in word
            for ch in w:
                curr[ord(ch) - ord('a')] += 1
            
            # Keep the minimum value of each character within
            # freq or curr
            for i in range(26):
                freq[i] = min(freq[i], curr[i])

        res = []
        # Converts result to ASCII 
        # If freq[i] = 0, then nothing will be added
        # Doing i + ord('a') to get correct character
        for i in range(26):
            res += [chr(i + ord('a'))] * freq[i]

        return res
    
"""
String array: Words
Return characters that show up in all strings
ANswer may be returned in any order
"""
```

## Source [^1]
- 
## References

[^1]: 