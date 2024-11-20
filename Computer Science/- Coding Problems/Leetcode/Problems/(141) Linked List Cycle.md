---
Source:
  - https://leetcode.com/problems/linked-list-cycle/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-20 at 2.49.47 AM.png]]
- Tortoise and hair algorithm on a linked list cycle works
	- It's a linear time algorithm
- Test if there is a cycle in list
- Maintain a [[HashSet]]
	- Take node itself and add it to HashSet
	- The node is just an object and you usually can hash an object
	- If we detect same node twice, we know that a cycle exists
- Time complexity and space complexity are both O(n)
	- As all nodes could be stored in the HashSet
- It is possible to do without HashSet though and can do in O(1) memory and this is the slightly complicated algorithm but will show why it works
- [[Floyd's Tortoise & Hare]]
	- Slower pointer s and fast pointer f
		- Slow pointer shifted by 1
		- Fast pointer shifted by 2
			- Will reach end of linked list first. If we do that, we can return false. No cycle exists in a linked list then
	- If there is a cycle though, the slow and fast pointers will meet again. They will meet at same position which means a cycle exists
	- It's always the case that the fast pointer will catch up with the slow pointer and will happen in linear time O(n)
	- Gap will always be integer value
		- Whatever the gap happens to be. It can only be maximum the entire length of list
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        slow, fast = head, head

        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow == fast:
                return True
        
        return False
```
## References

[^1]: https://www.youtube.com/watch?v=gBTe7lFR3vc