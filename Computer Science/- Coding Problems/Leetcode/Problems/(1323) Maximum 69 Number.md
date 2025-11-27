---
Source:
  - https://leetcode.com/problems/maximum-69-number/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def maximum69Number (self, num: int) -> int:
        test = list(str(num))

        for i in range(len(test)):
            if test[i] == '6':
                test[i] = '9'
                break
        return int("".join(test))
```
## Source [^1]
- 
## References

[^1]: 