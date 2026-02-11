---
Source:
  - https://leetcode.com/problems/longest-common-prefix
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        rotation = 0
        stored = ''
        while True:
            potential = ''
            for i in strs:
                if potential == '':
                    if rotation < len(i):
                        potential += i[rotation]
                    else:
                        return stored
                else:
                    if rotation < len(i) and i[rotation] == potential[0]:
                        continue
                    else:
                        return stored
            stored += potential
            rotation += 1             

"""
Ideas:

Write for loop that iterates through every string in the list
If it's valid, then you check the second letter if it exists.
If it does not, then you just output what you have

Note:
String length can be 0
String will always have lowercase English letters unless empty
"""
```
- I kept track of the rotation number, the potential to store a character, and the stored values in which I would return if they match the other prefixes. I also used `length` to ensure that the string I was interacting with would contain the index I'm searching for. 
## Source [^1]
- 
## References

[^1]: [Longest Common Prefix - Leetcode 14 - Python](https://www.youtube.com/watch?v=0sWShKIJoo4)