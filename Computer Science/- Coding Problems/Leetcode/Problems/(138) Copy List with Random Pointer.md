---
Source:
  - https://leetcode.com/problems/copy-list-with-random-pointer/
Reviewed: false
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
## Source[^2]
### (1) Hash Map (Recursion)
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
    def __init__(self):
        self.map = {}

    def copyRandomList(self, head: 'Optional[Node]') -> 'Optional[Node]':
        if head is None:
            return None
        if head in self.map:
            return self.map[head]
        
        copy = Node(head.val)
        self.map[head] = copy
        copy.next = self.copyRandomList(head.next)
        copy.random = self.map.get(head.random)
        return copy
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$

### (2) Hash Map (Two Pass)
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
        oldToCopy = {None: None}

        cur = head
        while cur:
            copy = Node(cur.val)
            oldToCopy[cur] = copy
            cur = cur.next
        cur = head
        while cur:
            copy = oldToCopy[cur]
            copy.next = oldToCopy[cur.next]
            copy.random = oldToCopy[cur.random]
            cur = cur.next
        return oldToCopy[head]
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
### (3) Hash Map (One Pass)
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
        oldToCopy = collections.defaultdict(lambda: Node(0))
        oldToCopy[None] = None
        
        cur = head
        while cur:
            oldToCopy[cur].val = cur.val
            oldToCopy[cur].next = oldToCopy[cur.next]
            oldToCopy[cur].random = oldToCopy[cur.random]
            cur = cur.next
        return oldToCopy[head]
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$

### (4) Space Optimized - I
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
        if head is None:
            return None
        
        l1 = head
        while l1 is not None:
            l2 = Node(l1.val)
            l2.next = l1.next
            l1.next = l2
            l1 = l2.next
            
        newHead = head.next
        
        l1 = head
        while l1 is not None:
            if l1.random is not None:
                l1.next.random = l1.random.next
            l1 = l1.next.next
            
        l1 = head
        while l1 is not None:
            l2 = l1.next
            l1.next = l2.next
            if l2.next is not None:
                l2.next = l2.next.next
            l1 = l1.next
            
        return newHead
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$

### (5) Space Optimized - II
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
        if head is None:
            return None

        l1 = head
        while l1:
            l2 = Node(l1.val)
            l2.next = l1.random
            l1.random = l2
            l1 = l1.next
        
        newHead = head.random
        
        l1 = head
        while l1:
            l2 = l1.random
            l2.random = l2.next.random if l2.next else None
            l1 = l1.next
            
        l1 = head
        while l1 is not None:
            l2 = l1.random
            l1.random = l2.next
            l2.next = l1.next.random if l1.next else None
            l1 = l1.next

        return newHead
```
Time Complexity: $O(n)$
Space Complexity: $O(1)$
## References

[^1]: [Copy List with Random Pointer - Linked List - Leetcode 138](https://www.youtube.com/watch?v=5Y2EiZST97Y)
[^2]: https://neetcode.io/solutions/copy-list-with-random-pointer