---
Source:
  - https://leetcode.com/problems/generate-parentheses/
Reviewed: false
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

## Source[^2]
### (1) Brute Force
```python
class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        res = []

        def valid(s: str):
            open = 0
            for c in s:
                open += 1 if c == '(' else -1
                if open < 0:
                    return False
            return not open

        def dfs(s: str):
            if n * 2 == len(s):
                if valid(s):
                    res.append(s)
                return
            
            dfs(s + '(')
            dfs(s + ')')
        
        dfs("")
        return res
```
Time Complexity: $O(2^{2n}*n)$
Space Complexity: $O(2^{2n}*n)$
### (2) Backtracking
```python
class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        stack = []
        res = []

        def backtrack(openN, closedN):
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
Time Complexity: $O(\frac{4^n}{\sqrt{n}})$
Space Complexity: $O(n)$

### (3) Dynamic Programming
```python
class Solution:
    def generateParenthesis(self, n):
        res = [[] for _ in range(n+1)]
        res[0] = [""]
        
        for k in range(n + 1):
            for i in range(k):
                for left in res[i]:
                    for right in res[k-i-1]:
                        res[k].append("(" + left + ")" + right)
        
        return res[-1]
```
Time Complexity: $O(\frac {4^n}{\sqrt{n}})$
Space Complexity: $O(n)$
## References

[^1]: [Generate Parentheses - Stack - Leetcode 22](https://www.youtube.com/watch?v=s9fokUqJ76A)
[^2]: https://neetcode.io/solutions/generate-parentheses