---
Source:
  - https://leetcode.com/problems/restore-finishing-order/description
Approaches: "1"
---
## Synthesis
### My Solution
```python
class Solution:
    def recoverOrder(self, order: List[int], friends: List[int]) -> List[int]:
        set_friends = set(friends)
        ID_order = []

        for i in range(len(order)):
            if order[i] in set_friends:
                ID_order.append(order[i])
        return ID_order


"""
Integer array: Order (length n)
    Contains every integer from 1 to n exactly once (represents IDS of participants
    of a race in their finishing order)
Integer array: Friends
    IDs sorted in strictcly increasing order. Each ID guranteed to be in `Order` array
"""
```
## Source [^1]
- 
## References

[^1]: 