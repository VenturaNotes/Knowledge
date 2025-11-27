---
Source:
  - https://leetcode.com/problems/sort-the-people/
Reviewed: false
Approaches: "1"
---
## Synthesis
```python
class Solution:
    def sortPeople(self, names: List[str], heights: List[int]) -> List[str]:
        index_list = []
        for i in range(len(heights)):
            index_list.append(names[heights.index(max(heights))])
            heights[heights.index(max(heights))] = 0
        return index_list
        

"""
my_list.index(1)
my_list.index(max_value)
"""
```
## Source [^1]
- 
## References

[^1]: 