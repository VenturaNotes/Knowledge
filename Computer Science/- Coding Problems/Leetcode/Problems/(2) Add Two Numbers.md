---
Source:
  - https://leetcode.com/problems/add-two-numbers/
Reviewed: false
tags:
  - in-progress
---
## Synthesis

### My Solution
```python
# Definition for singly-linked list.
# class ListNode:
	  # parameterized constructor
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        #Creates a head recursion function 
        def loop_first_list(first):
            mystr = ''
            if first.next is not None:
                mystr += loop_first_list(first.next)
            mystr += str(first.val)
            return mystr

        result = int(loop_first_list(l1)) + int(loop_first_list(l2))

        test = ListNode(result%10)
        temp = test
        result = result//10
    
        while result > 0:
            test.next = ListNode(result%10)
            test = test.next
            print(result)
            result = result//10

        return temp
```

### [Approach 1: Elementary Math](https://leetcode.com/problems/add-two-numbers/solutions/127833/add-two-numbers/)
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
	def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
		dummyHead = ListNode(0)
		curr = dummyHead
		carry = 0
		while l1 != None or l2 != None or carry != 0:
			l1Val = l1.val if l1 else 0
			l2Val = l2.val if l2 else 0
			columnSum = l1Val + l2Val + carry
			carry = columnSum // 10
			newNode = ListNode(columnSum % 10)
			curr.next = newNode
			curr = newNode
			l1 = l1.next if l1 else None
			l2 = l2.next if l2 else None
		return dummyHead.next
```

- Dissection
	- Creates a node with value 0
		```python
		dummyHead = ListNode(0)
		```
	- `curr` is pointing to the node `dummyHead`. This is so if we do `dummyHead.next`, we would still have access to the first node in the linked-list.
		```python
		curr = dummyHead
		```
	- Seems like `carry` will keep track of the number we use when doing addition. Doing something like "5 + 7 = 12" means we need to carry over the "1" to do addition for the subsequent place-value. "25 + 47 = 72" because "5+7=12" and carrying the "1" gives "2 + 4 + 1 = 7" giving a sum of "72"
		```python
		carry = 0
		```
	- Checks if the value of `l1` or `l2` is `None` and making sure `carry` is not equal to 0. 
		```python
		while l1 != None or l2 != None or carry != 0:
		```
		- Uses a ternary operator
			```python
			l1Val = l1.val if l1 else 0
			```

## Source [^1]
- ![[Screenshot 2024-11-20 at 2.37.35 AM.png|500]]
	- Just need to add two numbers together
	- Many edge cases
	- Will have 2 non-empty linked lists
	- Non-negative integers
	- Digits stored in reverse order (helps us)
		- Each node contains a single digit
	- For each digit, we'll need to create a separate node
	- Need to remember there might be no extra nodes when doing 7 + 5. Solution is 12 So need to carry the 2 over
	- Seems like 2 main edge cases to consider
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode()
        cur = dummy

        carry = 0
        while l1 or l2 or carry:
            v1 = l1.val if l1 else 0
            v2 = l2.val if l2 else 0

            # new digit
            val = v1 + v2 + carry
            carry = val // 10
            val = val % 10
            cur.next = ListNode(val)

            # update ptrs
            cur = cur.next
            l1 = l1.next if l1 else None
            l2 = l2.next if l2 else None
        return dummy.next
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
    def add(self, l1: Optional[ListNode], l2: Optional[ListNode], carry: int) -> Optional[ListNode]:
        if not l1 and not l2 and carry == 0:
            return None
        
        v1 = l1.val if l1 else 0
        v2 = l2.val if l2 else 0
        
        carry, val = divmod(v1 + v2 + carry, 10)
        
        next_node = self.add(
            l1.next if l1 else None, 
            l2.next if l2 else None, 
            carry
        )
        return ListNode(val, next_node)

    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        return self.add(l1, l2, 0)
```
Time Complexity: $O(m+n)$
Space Complexity: $O(m+n)$
- Where $m$ is the length of $l1$ and $n$ is the length of $l2$
### (2) Iteration
```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode()
        cur = dummy

        carry = 0
        while l1 or l2 or carry:
            v1 = l1.val if l1 else 0
            v2 = l2.val if l2 else 0

            # new digit
            val = v1 + v2 + carry
            carry = val // 10
            val = val % 10
            cur.next = ListNode(val)

            # update ptrs
            cur = cur.next
            l1 = l1.next if l1 else None
            l2 = l2.next if l2 else None

        return dummy.next
```
Time Complexity: $O(m+n)$
Space Complexity: $O(1)$
- Where $m$ is the length of $l1$ and $n$ is the length of $l2$
## References

[^1]: https://www.youtube.com/watch?v=wgFPrzTjm7s 
[^2]: https://neetcode.io/solutions/add-two-numbers