---
aliases:
  - local scope
  - function scope
---
## Synthesis
- 
## Source [^1]
- Code block or body of any Python function or lambda expression
- Contains names you define inside the function
	- Names only visible from code of function
	- Created at function call, not definition. You'll have as many different local scopes as function calls
- Each call of a function will result in a new local scope being created
## References

[^1]: https://realpython.com/python-scope-legb-rule/#:~:text=Enclosing%20(or%20nonlocal)%20scope%20is,define%20in%20the%20enclosing%20function.