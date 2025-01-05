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
## Source[^2]
### (1) Recursion
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        if list1 is None:
            return list2
        if list2 is None:
            return list1
        if list1.val <= list2.val:
            list1.next = self.mergeTwoLists(list1.next, list2)
            return list1
        else:
            list2.next = self.mergeTwoLists(list1, list2.next)
            return list2
```
Time Complexity: $O(n+m)$
Space Complexity: $O(n+m)$
- Where $n$ is the length of $list1$ and $m$ is the length of $list2$

### (2) Iteration
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def mergeTwoLists(self, list1: ListNode, list2: ListNode) -> ListNode:
        dummy = node = ListNode()

        while list1 and list2:
            if list1.val < list2.val:
                node.next = list1
                list1 = list1.next
            else:
                node.next = list2
                list2 = list2.next
            node = node.next

        node.next = list1 or list2

        return dummy.next
```
Time Complexity: $O(n+m)$
Space Complexity: $O(1)$
- Where $n$ is the length of $list1$ and $m$ is the length of $list2$
## References

[^1]: https://www.youtube.com/watch?v=XIdigk956u0
[^2]: https://neetcode.io/solutions/merge-two-sorted-lists