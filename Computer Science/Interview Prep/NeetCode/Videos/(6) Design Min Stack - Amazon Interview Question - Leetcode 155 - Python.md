[Video](https://www.youtube.com/watch?v=qkLl7nAwDPo)

- ![[Screenshot 2023-08-31 at 1.09.11 AM.png]]
	- This is a good design problem
		- Design a [[stack]] that supports, push, pop, top, and retrieving the minimum element in constant time
	- By default, a stack can support push, pop, and top in $O(1)$ time
		- Could implement it with a linked list or with an array
	- Getting a minimum element in $O(1)$ is not supported by stack by default
		- Good hint for designing this is to consider each node in the stack having a minimum value
		- One stack will tell us the values we've added so far in the order we added them
		- The other stack will tell us what's the minimum value that we have added so far in each position of the stack
			- When using the "getMin" operation, we're going to be looking at the top of our minimum Stack
- Code
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
        


# Your MinStack object will be instantiated and called as such:
# obj = MinStack()
# obj.push(val)
# obj.pop()
# param_3 = obj.top()
# param_4 = obj.getMin()
```
- `self.stack = []` is python's implementation of a regular stack using an array
- For `val = min(val, self.minStack[-1] if self.minStack else val)`
	- `[]` is considered false when a list is empty
		- Therefore `self.minStack` will return true if it's not empty and therefore
			- `self.min_Stack[-1]`
		- If it is false, then it will just use `val` to evaluate the `min`
- Each one of the four functions is done in $O(1)$ time.