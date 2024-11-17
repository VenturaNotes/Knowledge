---
Source:
  - https://leetcode.com/problems/copy-list-with-random-pointer/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-11-16 at 9.50.23 PM.png]]
- Big problem but can just pay attention to the example
- It's a singly linked list for the most part
- Will do two passes for this problem (two loops)
	- First pass will be creating a deep copy of the nodes
	- First pass will also create a hashmap where we map the original node to the new node
		- Will map every old node to new copy 
	- In 2nd pass, will do pointer connecting
- Can solve this problem in linear time O(n)
- Hashmap will take O(n) memory since we'll store every single node inside of our hashmap
```python
"""
# Definition for a Node.
class Node:
    def __init__(self, x: int, next: 'Node' = None, random: 'Node' = None):
        self.val = int(x)
        self.next = next
        self.random = random
"""

class Solution:
    def copyRandomList(self, head: 'Optional[Node]') -> 'Optional[Node]':
        # Just mapping that null points to null
        oldToCopy = {None : None}

        cur = head
        while cur:
            copy = Node(cur.val)
            oldToCopy[cur] = copy
            cur = cur.next
        
        cur = head
        while cur:
            copy = oldToCopy[cur]
            copy.next = oldToCopy[cur.next]
            copy.random = oldToCopy [cur.random]
            cur = cur.next
        
        return oldToCopy[head]
```
## References

[^1]: https://www.youtube.com/watch?v=5Y2EiZST97Y