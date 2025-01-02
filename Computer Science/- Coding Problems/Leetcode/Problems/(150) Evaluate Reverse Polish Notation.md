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
## References

[^1]: https://www.youtube.com/watch?v=iu0082c4HDE