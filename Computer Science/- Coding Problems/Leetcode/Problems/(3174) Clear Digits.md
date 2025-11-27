---
Source:
  - https://leetcode.com/problems/clear-digits/?envType=problem-list-v2&envId=v66iao7e
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def clearDigits(self, s: str) -> str:
        my_list = list(s)

        while True:
            flag = False
            for i in range(len(my_list)):
                if my_list[i].isdigit():
                    temp = i
                    my_list.pop(i)
                    temp -= 1
                    while temp >= 0:
                        if not my_list[temp].isdigit():
                            flag = True
                            my_list.pop(temp)
                            break
                        temp -= 1
                if flag:
                    break
            print(my_list)
            if flag:
                flag = False
            else:
                break
        return "".join(my_list)
            
"""
It seems like a good practice when removing an index
is by removing it through reverse order
"""
```
## Source [^1]
- 
## References

[^1]: 