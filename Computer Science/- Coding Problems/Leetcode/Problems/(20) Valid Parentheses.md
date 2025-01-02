---
Source:
  - https://leetcode.com/problems/valid-parentheses
Reviewed: false
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-10-16 at 3.22.27 PM.png|400]]
- Super common question from phone interviews and online assessments
- Order and type must be true
- Will always remove from top of list or top of stack
- Helpful for us to use a [[stack]] data structure to solve this problem.
- As we're closing a parenthesis, always will be popping from the top
	- Closing parenthesis is always going to be matched to the most recent opening parenthesis
- Will use a [[HashMap]]
- Algorithm is O(n) because only need to go through every input character once. Will take $O(n)$ memory as we're using a stack. The stack could be up to the size of the input which is n. So time and memory complexity will be $O(n)$ in this case
```python
class Solution:
	def isValid(self, s: str) -> bool:
		stack = []
		closeToOpen = { ")" : "(", "]" : "[", "}" : "{"}

		for c in s:
			if c in closeToOpen:
				if stack and stack[-1] == closeToOpen[c]:
					stack.pop()
				else:
					return False
			else:
				stack.append(c)
		return True if not stack else False
```
## References

[^1]: https://www.youtube.com/watch?v=WTzjTskDFMg