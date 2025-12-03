---
Source:
  - https://leetcode.com/problems/minimum-absolute-difference/
Reviewed: false
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def minimumAbsDifference(self, arr: List[int]) -> List[List[int]]:
        my_list = arr
        my_list.sort()

        min_dif = 0
        res = []

        for i in range(len(my_list)-1):
            if min_dif == 0 or abs(my_list[i]-my_list[i+1]) < min_dif:
                min_dif = abs(my_list[i]-my_list[i+1])
                res.clear()
                res.append([my_list[i],my_list[i+1]])
            elif  abs(my_list[i]-my_list[i+1]) == min_dif:
                res.append([my_list[i],my_list[i+1]])
        return res
"""
Find pairs of elements with minimum absolute difference
of any two elements
"""
```
## Source [^1]
- 
## References

[^1]: 