---
Source:
  - https://leetcode.com/problems/vowel-consonant-score
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def vowelConsonantScore(self, s: str) -> int:
        vowels = {'a', 'e', 'i', 'o', 'u'}
        consonants = {'b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','y','z'}

        vowel_count = 0
        consonant_count = 0
        # s consists of letters, spaces, or digits

        for i in s:
            if i in vowels:
                vowel_count += 1
            elif i in consonants:
                consonant_count +=1

        if consonant_count > 0:
            return floor(vowel_count / consonant_count)
        else:
            return 0
```
## Source [^1]
- 
## References

[^1]: 