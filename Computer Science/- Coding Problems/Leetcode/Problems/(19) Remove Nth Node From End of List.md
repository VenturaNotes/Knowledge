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
## Source[^2]
### (1) Brute Force
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        nodes = []
        cur = head
        while cur:
            nodes.append(cur)
            cur = cur.next
        
        removeIndex = len(nodes) - n
        if removeIndex == 0:
            return head.next
        
        nodes[removeIndex - 1].next = nodes[removeIndex].next
        return head
```
Time Complexity: $O(N)$
Space Complexity: $O(N)$

### (2) Iteration (Two Pass)
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        N = 0
        cur = head
        while cur:
            N += 1
            cur = cur.next
        
        removeIndex = N - n
        if removeIndex == 0:
            return head.next
        
        cur = head
        for i in range(N - 1):
            if (i + 1) == removeIndex:
                cur.next = cur.next.next
                break
            cur = cur.next
        return head
```
Time Complexity: $O(N)$
Space Complexity: $O(1)$
### (3) Recursion
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def rec(self, head, n):
        if not head:
            return None

        head.next = self.rec(head.next, n)
        n[0] -= 1
        if n[0] == 0:
            return head.next
        return head

    def removeNthFromEnd(self, head, n):
        return self.rec(head, [n])
```
Time Complexity: $O(N)$
Space Complexity: $O(N)$

### (4) Two Pointers
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

        while n > 0:
            right = right.next
            n -= 1

        while right:
            left = left.next
            right = right.next

        left.next = left.next.next
        return dummy.next
```
Time Complexity: $O(N)$
Space Complexity: $O(1)$
## References

[^1]: [Remove Nth Node from End of List - Oracle Interview Question - Leetcode 19](https://www.youtube.com/watch?v=XVuQxVej6y8)
[^2]: https://neetcode.io/solutions/remove-nth-node-from-end-of-list