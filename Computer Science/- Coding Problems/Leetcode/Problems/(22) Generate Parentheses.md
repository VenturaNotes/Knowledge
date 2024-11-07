---
Source:
  - https://leetcode.com/problems/generate-parentheses/
---
## Synthesis
- 
## Source [^1]
- ![[Screenshot 2024-10-18 at 12.35.51 PM.png]]
- Generate all combinations of well-formed parentheses
- We can only add a closing parentheses if the count of closing parentheses is less than the count of open parentheses
- Will do this recursively and will create a stack
	- Using a base case
- ![[Screenshot 2024-10-18 at 12.36.28 PM.png]]
```python
class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        # only add open paranthesis if open < n
        # only add a closing paranthesis if closed < open
        # valid IIF open == closed == n
    
        stack = []
        res = []

        def backtrack (openN, closedN):
	        # Checks to see if number of closed and open parenthesis is
	        # equal to "n"
            if openN == closedN == n:
                res.append("".join(stack))
                return
            if openN < n:
                stack.append("(")
                backtrack(openN + 1, closedN)
                stack.pop()
            if closedN < openN:
                stack.append(")")
                backtrack(openN, closedN + 1)
                stack.pop()
        
        backtrack(0, 0)
        return res
```
- If n = 3, output is `['((()))', '(()())', '(())()', '()(())', '()()()']`
	- Giving 5 different combinations
- #question What is the time complexity and space complexity of this?

## References

[^1]: https://www.youtube.com/watch?v=s9fokUqJ76A