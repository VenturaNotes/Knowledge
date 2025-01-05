---
Source:
  - https://leetcode.com/problems/reverse-linked-list/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-16 at 7.19.12 PM.png]]
- reverse a [[linked list]]
- Could do this iteratively or recursively
- Could use [[two pointer technique]]
Iterative Solution
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # Time complexity is O(n) so T O(n)
        # Memory complexity is O(1) so M O(1)
        prev, curr = None, head

        while curr:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        return prev
```
Recursive solution (not that optimal since requires more memory)
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # Time complexity is O(n)
        # Memory complexity is O(n)
        # Memory is linear because if we were given a linked list
        # of size 2, our recursive call is going to be size 2
        # Must maintain last node as new head

        # need base case first as with most recursive functions
        if not head:
            return None

        newHead = head
        if head.next:
            newHead = self.reverseList(head.next)
            head.next.next = head
        head.next = None

        return newHead
```
## Source[^2]
### (1) Recursion
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if not head:
            return None

        newHead = head
        if head.next:
            newHead = self.reverseList(head.next)
            head.next.next = head
        head.next = None
        
        return newHead
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$

### (2) Iteration
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        prev, curr = None, head

        while curr:
            temp = curr.next
            curr.next = prev
            prev = curr
            curr = temp
        return prev
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$
## References

[^1]: https://www.youtube.com/watch?v=G0_I-ZF0S38
[^2]: https://neetcode.io/solutions/reverse-linked-list