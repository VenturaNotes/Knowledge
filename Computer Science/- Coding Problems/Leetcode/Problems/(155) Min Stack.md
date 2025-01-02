---
Source:
  - https://leetcode.com/problems/min-stack/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-10-18 at 1.06.39 AM.png]]
- Must design a stack class that supports 4 operations
	- push, pop, top value, retrieve minimum element constant time
- By default, a [[stack]] data structure supports pushing, popping and getting top value in O(1) time.
	- Could implement with array or linked list
- We end up making two stacks
	- First stack tells us the values
	- Second stack tells us what the minimum value we have added so far
```python
class MinStack:
    def __init__(self):
        self.stack = []
        self.minStack = []
        
    def push(self, val: int) -> None:
        self.stack.append(val)
        # Makes sure the min stack is not empty
        val = min(val, self.minStack[-1] if self.minStack else val)
        self.minStack.append(val)

    def pop(self) -> None:
        self.stack.pop()
        self.minStack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.minStack[-1]
```
## References

[^1]: https://www.youtube.com/watch?v=qkLl7nAwDPo