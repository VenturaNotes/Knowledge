---
Source:
  - https://leetcode.com/problems/remove-nth-node-from-end-of-list
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-16 at 9.39.41 PM.png]]
- Given linked list, remove nth node from end of list
	- So if given `[1, 2, 3,4,5]` and we're told to remove `n=2`, then we remove node 4
- Could reverse linked list (but requires reversing linked list which we don't have to do)
- Could use [[two pointer technique]]
	- When right pointer is at null, we've found the 2nd to last node in linked list for example
- Complexity is O(n). This works by placing the left node before the head node.
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        left = dummy
        right = head

        while n > 0 and right:
            right = right.next
            n -= 1
        
        while right:
            left = left.next
            right = right.next

        # delete
        left.next = left.next.next
        return dummy.next
```
## References

[^1]: https://www.youtube.com/watch?v=XVuQxVej6y8