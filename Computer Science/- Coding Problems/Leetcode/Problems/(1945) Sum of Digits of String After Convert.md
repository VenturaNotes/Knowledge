---
Source:
  - https://leetcode.com/problems/sum-of-digits-of-string-after-convert/
Approaches: "1"
Reviewed: false
---
## Synthesis
### My Solution
```python
class Solution:
    def getLucky(self, s: str, k: int) -> int:
        my_list = ""
        for i in s:
            my_list += str((ord(i) - ord('a')+1))
        
        s = 0
        temp = 0
        while s < k:
            for i in my_list:
                temp += int(i)
            s+=1
            my_list = str(temp)
            temp = 0

        return int(my_list)
```
## Source [^1]
- 
## References

[^1]: 