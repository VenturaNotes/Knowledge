---
Source:
  - https://leetcode.com/problems/jewels-and-stones/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def numJewelsInStones(self, jewels: str, stones: str) -> int:
        my_list = list(jewels)
        count = 0
        for i in my_list:
            for j in stones:
                if i == j:
                    count +=1
        return count
```
## Source [^1]
- 
## References

[^1]: 