---
Source:
  - https://leetcode.com/problems/number-of-senior-citizens/description/?envType=problem-list-v2&envId=v66iao7e
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def countSeniors(self, details: List[str]) -> int:
        count = 0
        for i in details:
            if int(i[11:-2]) > 60:
                count+=1
        return count
"""
Need to split string by removing last 2 characters
and removing first letter. I guess I could always remove the 11th character? 
"""
```
## Source [^1]
- 
## References

[^1]: 