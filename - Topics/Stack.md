---
aliases:
  - stacks
---
## Synthesis

### Python
- A pythonic stack is using a list
- Use collections.deque to create a stack
```python
from collections import deque

stack = deque()

stack.append(10)
stack.append(20)
stack.append(30)

top = stack.pop()  # pop from the right by default
print(top) # 30
print(stack) # deque([10, 20])


# 30 is returned because that was removed from 'stack'
```
- #question What exactly is `deque()`? What does it do?
- #question What is type deque? 
- Use `deque` if performance matters or the stack gets very large
## Source [^1]
### Description
- The time complexity of push or pop for stack is constant
### Push Procedure
```
Procedure Push
	IF Top = MaximumSize THEN
		OUTPUT "Stack overflow"
	ELSE
		Top = Top + 1
		ArrayStack(Top) = new item
	END IF
END PROCDURE
```
- #comment 
	- `Top` appears to be a number which keeps track of the size of the stack. If it equals the MaximumSize value that we've set and we try to push another element onto it, it will just output "Stack overflow"
	- Otherwise, the value of `Top` will be incremented by 1, and the `ArrayStack` will insert the new `item` in that position given by the number of `Top`
### Pop Procedure
```
Procedure Pop
	IF Top = 0 THEN
		OUTPUT "Stack is empty"
	ELSE
		copy item = ArrayStack(Top)
		Top = Top - 1
	END IF
END Procedure
```
- #comment 
	- If the value of `Top` is equal to 0, then it signifies the stack is empty and will print out "Stack is empty"
	- Otherwise, make a copy of the element at the top of the stack and then decrement by 1. I guess in this case, the `ArrayStack` will still keep the value there if the value of `Top` increases again
		- #question Shouldn't the top of the stack be removed rather than just the pointer given by `Top`?

## Source[^2]
- (pushdown stack, pushdown list, LIFO list) 
- (1) A linear list where all accesses, insertions, and removals are made at one end of the list, called the top. This implies access on a last in first out (LIFO) basis: the most recently inserted item on the list is the first to be removed. The operations push and [[pop]] refer respectively to the insertion and removal of items at the top of the stack. Stacks occur frequently in computing and in particular are closely associated with recursion.
- (2) Loosely, a linear list where accesses, insertions, and removals are made at one end or both ends of the list. This includes a pushdown stack, described above. When the earliest inserted item on the linear list is the first to be removed (first in first out, FIFO), it is a pushup stack, more properly known as a queue. When insertions and deletions may be made at both ends, it is a double-ended queue, or deque.
- A stack may be implemented in hardware as a specialized kind of addressless memory, with a control mechanism to implement any of the insertion/removal regimes. See also stack processing
---
- Pushdown stack: pushdown list. Other names for stack (def. 1).
- pushup stack, pushup list. Other names for queue. See also STACK (def. 2).
## References

[^1]: [[(2) Big O Part 2 – Constant Complexity]]
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]