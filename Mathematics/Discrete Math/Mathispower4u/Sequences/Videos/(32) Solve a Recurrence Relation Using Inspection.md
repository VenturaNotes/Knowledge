---
Source:
  - https://www.youtube.com/watch?v=0VBqlUJi3JQ
Reviewed: false
---
- ![[Screenshot 2025-02-14 at 11.51.48 AM.png]]
	- Solving recurrence relations: Inspection
		- Solve the recurrence relation $a_n = a_{n-1} + 2n$ with $a_0 = 3$
		- [[Inspection]]: Write down the first few terms beginning from the initial condition(s) and look for either of these two patterns to find a closed formula
			- Geometric Series Partial Sum
				- $S = a_1 (\frac{1-r^n}{1-r})$ or $S = a_0 (\frac{1-r^{n+1}}{1-r})$
			- Arithmetic Series Partial Sum
				- $S = \frac n2 (a_1 + a_n)$ or $S = \frac {n+1}{2} (a_0 + a_n)$ 
		- 2 + 4 + 6 + ... + 2n
			- To find the sum we can use reverse and add or the partial sums formula for an arithmetic series