---
Source:
  - https://leetcode.com/problems/merge-two-sorted-lists/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-16 at 7.25.07 PM.png]]
- Merge two sorted lists and return it as a new sorted list
- Create initial dummy node to avoid first edge case
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def mergeTwoLists(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        # Only l1 or l2 is non-null
        dummy = ListNode()
        tail = dummy

        while l1 and l2:
            if l1.val < l2.val:
                tail.next = l1
                l1 = l1.next
            else:
                tail.next = l2
                l2 = l2.next
            tail = tail.next
        if l1:
            tail.next = l1
        elif l2:
            tail.next = l2
        
        return dummy.next
```
- Neetcode inconsistent with "faster than" for online submissions.
## References

[^1]: https://www.youtube.com/watch?v=XIdigk956u0