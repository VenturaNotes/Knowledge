---
Source:
  - https://leetcode.com/problems/evaluate-reverse-polish-notation/
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-10-18 at 12.12.30 PM.png]]
- Will add, subtract, multiply, and divide
	- Division should truncate towards zero
- Reverse Polish Notation
- In Java, C++ and most languages, it usually rounds towards zero automatically
	- Not Python though
- [[Stack]] is a great data structure for this
- Overall time complexity will be O(2n) or other words O(n)
	- Will read through input string and remove at most once each for stack
- Memory complexity is O(n)
- In python, can just use a list for a stack
- Using the `int(b/a)` will convert to integer and round to zero at the same time
```python
class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        stack = []
        for c in tokens:
            if c == "+":
                stack.append(stack.pop() + stack.pop())
            elif c == "-":
                a, b = stack.pop(), stack.pop()
                stack.append(b-a)
            elif c == "*":
                stack.append(stack.pop() * stack.pop())
            elif c == "/":
                a, b = stack.pop(), stack.pop()
                stack.append(int(b/a))
            else:
                stack.append(int(c))
        return stack[0]
```
## Source[^2]
### (1) Brute Force
```python
class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        while len(tokens) > 1:
            for i in range(len(tokens)):
                if tokens[i] in "+-*/":
                    a = int(tokens[i-2])
                    b = int(tokens[i-1])
                    if tokens[i] == '+':
                        result = a + b
                    elif tokens[i] == '-':
                        result = a - b
                    elif tokens[i] == '*':
                        result = a * b
                    elif tokens[i] == '/':
                        result = int(a / b)
                    tokens = tokens[:i-2] + [str(result)] + tokens[i+1:]
                    break
        return int(tokens[0])
```
Time Complexity: $O(n^2)$
Space Complexity: $O(n)$

### (2) Doubly Linked List
```python
class DoublyLinkedList:
    def __init__(self, val, next=None, prev=None):
        self.val = val
        self.next = next
        self.prev = prev

class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        head = DoublyLinkedList(tokens[0])
        curr = head

        for i in range(1, len(tokens)):
            curr.next = DoublyLinkedList(tokens[i], prev=curr)
            curr = curr.next

        while head is not None:
            if head.val in "+-*/":
                l = int(head.prev.prev.val)
                r = int(head.prev.val)
                if head.val == '+':
                    res = l + r
                elif head.val == '-':
                    res = l - r
                elif head.val == '*':
                    res = l * r
                else:
                    res = int(l / r)

                head.val = str(res)
                head.prev = head.prev.prev.prev
                if head.prev is not None:
                    head.prev.next = head

            ans = int(head.val)
            head = head.next

        return ans
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
### (3) Recursion
```python
class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        def dfs():
            token = tokens.pop()
            if token not in "+-*/":
                return int(token)
            
            right = dfs()
            left = dfs()
            
            if token == '+':
                return left + right
            elif token == '-':
                return left - right
            elif token == '*':
                return left * right
            elif token == '/':
                return int(left / right)
        
        return dfs()
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$

### (4) Stack
```python
class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        stack = []
        for c in tokens:
            if c == "+":
                stack.append(stack.pop() + stack.pop())
            elif c == "-":
                a, b = stack.pop(), stack.pop()
                stack.append(b - a)
            elif c == "*":
                stack.append(stack.pop() * stack.pop())
            elif c == "/":
                a, b = stack.pop(), stack.pop()
                stack.append(int(float(b) / a))
            else:
                stack.append(int(c))
        return stack[0]
```
Time Complexity: $O(n)$
Space Complexity: $O(n)$
## References

[^1]: https://www.youtube.com/watch?v=iu0082c4HDE
[^2]: https://neetcode.io/solutions/evaluate-reverse-polish-notation