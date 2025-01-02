---
Source:
  - https://leetcode.com/problems/reorder-list/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-16 at 7.32.32 PM.png]]
- Given a head of singly linked list and want to re-arrange it into a different order
	- So given original list, put first value in first position. Last value in second position and so on back and forth.
- Time complexity for solution of O(n)
- And memory complexity will be O(1)
	- If using extra space, would put linked list in array, and then use pointers to create new linked list
	- Can do this without using extra memory though
- Will take second portion of list and reverse it
- Then will take both portions of list and merge them together
- Could use a slow and fast pointer (to split the lists)
	- #question what is this?
	- Will shift slow pointer by 1 and fast pointer by 2
		- Keep going until fast pointer reaches end of list or reaches last value of list
		- If even list, slow pointer will be at halfway point
			- Then we know `slow.next` will be beginning of second half of list
		- Different for odd list
- Want last pointer to be pointing at null
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def reorderList(self, head: Optional[ListNode]) -> None:
        # find middle
        slow, fast = head, head.next
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next

        # reverse second half
        second = slow.next
        prev = slow.next = None
        while second:
            tmp = second.next
            second.next = prev
            prev = second
            second = tmp
        
        # merge two halfs
        first, second = head, prev
        while second:
            tmp1, tmp2 = first.next, second.next
            first.next = second
            second.next = tmp1
            first, second = tmp1, tmp2
```
- Not using any extra memory
- Doing this in linear time (although we are iterating through the list twice.)
## References

[^1]: https://www.youtube.com/watch?v=S5bfdUTrKLM