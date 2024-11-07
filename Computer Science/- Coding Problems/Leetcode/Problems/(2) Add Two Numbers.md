---
Source:
  - https://leetcode.com/problems/add-two-numbers/
---
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

## Source 2[^1]

## References

[^1]: https://www.youtube.com/watch?v=wgFPrzTjm7s 