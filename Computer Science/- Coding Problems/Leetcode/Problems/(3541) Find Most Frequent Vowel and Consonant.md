---
Source:
  - https://leetcode.com/problems/find-most-frequent-vowel-and-consonant/description/?envType=problem-list-v2&envId=v66iao7e
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def maxFreqSum(self, s: str) -> int:
        my_dict_vowels = {}
        my_dict_consonants = {}
        max_value_vowel = 0
        max_value_consonant = 0
        for i in s:
            if i in {'a', 'e', 'i', 'o', 'u'}:
                my_dict_vowels[i] = my_dict_vowels.get(i,0)+1
            else:
                my_dict_consonants[i] = my_dict_consonants.get(i,0)+1
        
        if my_dict_vowels:
            max_value_vowel = max(my_dict_vowels, key=my_dict_vowels.get)
            max_value_vowel = my_dict_vowels[max_value_vowel] 
        
        if my_dict_consonants:
            max_value_consonant = max(my_dict_consonants, key=my_dict_consonants.get)
            max_value_consonant = my_dict_consonants[max_value_consonant]

        return max_value_vowel + max_value_consonant
```
## Source [^1]
- 
## References

[^1]: 