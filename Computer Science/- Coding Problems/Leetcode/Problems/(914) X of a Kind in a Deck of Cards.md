---
Source:
  - https://leetcode.com/problems/x-of-a-kind-in-a-deck-of-cards/
Reviewed: false
tags:
  - leetcode/solved
---
## Synthesis
### My Solution
```python
class Solution:
    def hasGroupsSizeX(self, deck: List[int]) -> bool:
        
        mydict = {}
        myset = set()

        for i in deck:
            mydict[i] = mydict.get(i,0)+1
        print(mydict)

        min_value = min(mydict.values())

        print(min_value)

        if min_value <= 1:
            return False
        
        multiple = 2
        multiple_list = []

        # Prime Factorization
        while True:
            if multiple == min_value:
                multiple_list.append(multiple)
                break
            if min_value % multiple == 0:
                min_value = min_value // multiple
                multiple_list.append(multiple)
            else:
                multiple+=1
        
        for i in multiple_list:
            valid = True
            for value in mydict.values():
                if value % i != 0:
                    valid = False
            if valid:
                return True
        
        return False
```
## Source [^1]
- 
## References

[^1]: 