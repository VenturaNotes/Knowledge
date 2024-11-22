---
Source:
  - https://leetcode.com/problems/reverse-nodes-in-k-group/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-20 at 8.04.09 PM.png]]
- Will need a dummy node
- Need to reverse groups of nodes in the list
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        groupPrev = dummy

        while True:
            kth = self.getKth(groupPrev, k)
            if not kth:
                break
            groupNext = kth.next

            # reverse group
            prev, curr = kth.next, groupPrev.next
            while curr != groupNext:
                tmp = curr.next
                curr.next = prev
                prev = curr
                curr = tmp
            
            tmp = groupPrev.next
            groupPrev.next = kth
            groupPrev = tmp
        return dummy.next
    
    def getKth(self, curr, k):
        while curr and k > 0:
            curr = curr.next
            k -= 1
        return curr
```
## References

[^1]: https://www.youtube.com/watch?v=1UOPsfP85V4