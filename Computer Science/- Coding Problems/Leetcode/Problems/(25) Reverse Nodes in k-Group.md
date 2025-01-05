---
Source:
  - https://leetcode.com/problems/reverse-nodes-in-k-group/
Reviewed: false
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
## Source

### (1) Recursion
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        cur = head
        group = 0
        while cur and group < k:
            cur = cur.next
            group += 1

        if group == k:
            cur = self.reverseKGroup(cur, k)
            while group > 0:
                tmp = head.next
                head.next = cur
                cur = head
                head = tmp
                group -= 1
            head = cur
        return head
```
Time Complexity: $O(n)$
Space Complexity: $O(\frac {n}{k})$
### (2) Iteration
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
Time Complexity: $O(n)$
Space Complexity: $O(1)$
## References

[^1]: https://www.youtube.com/watch?v=1UOPsfP85V4