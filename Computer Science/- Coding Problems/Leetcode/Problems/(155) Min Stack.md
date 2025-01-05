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
## Source[^2]
### (1) Brute Force
```python
class MinStack:

    def __init__(self):
        self.stack = []

    def push(self, val: int) -> None:
        self.stack.append(val)

    def pop(self) -> None:
        self.stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        tmp = []
        mini = self.stack[-1]

        while len(self.stack):
            mini = min(mini, self.stack[-1])
            tmp.append(self.stack.pop())
        
        while len(tmp):
            self.stack.append(tmp.pop())
        
        return mini
```
Time Complexity: $O(n)$ for getMin() and $O(1)$ for other operations
Space Complexity: $O(n)$ for getMin() and $O(1)$ for other operations

### (2) Two Stacks
```python
class MinStack:
    def __init__(self):
        self.stack = []
        self.minStack = []

    def push(self, val: int) -> None:
        self.stack.append(val)
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
Time Complexity: $O(1)$ for all operations
Space Complexity: $O(n)$

### (3) One Stack
```python
class MinStack:
    def __init__(self):
        self.min = float('inf')
        self.stack = []

    def push(self, x: int) -> None:
        if not self.stack:
            self.stack.append(0)
            self.min = x
        else:
            self.stack.append(x - self.min)
            if x < self.min:
                self.min = x

    def pop(self) -> None:
        if not self.stack:
            return
        
        pop = self.stack.pop()
        
        if pop < 0:
            self.min = self.min - pop

    def top(self) -> int:
        top = self.stack[-1]
        if top > 0:
            return top + self.min
        else:
            return self.min

    def getMin(self) -> int:
        return self.min
```
Time Complexity: $O(1)$ for all operations
Space Complexity: $O(n)$
## References

[^1]: https://www.youtube.com/watch?v=qkLl7nAwDPo
[^2]: https://neetcode.io/solutions/min-stack