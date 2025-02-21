---
Source:
  - https://www.youtube.com/watch?v=2tEOFuIEyzc
Reviewed: false
---
- ![[Screenshot 2025-02-20 at 10.38.08 AM.png]]
	- Solving Recurrence Relations: Characteristic Root Technique with Repeated Root
		- Suppose the recurrence relation $a_n + \alpha a_{n-1} + \beta a_{n-2} = 0$, has a characteristic polynomial with only one root r. Then the solution to the recurrence relation is $a_n = ar^n + bnr^n$, where a and b are constants determined by the initial conditions.
		- Example: Solve the recurrence relation $a_n = 8a_{n-1} - 16a_{n-2}$ with initial terms $a_0 = 1$ and $a_1 = 6$
		- Rewriting the equation in the proper form: $a_n - 8a_{n-1} + 16a_{n-2} = 0$
		- The [[Characteristic Root Technique]]
			- Given a recurrence relation of the form $a_n + \alpha a_{n-1} + \beta a_{n-2} = 0$, the characteristic polynomial is $x^2 + \alpha x + \beta$ giving the characteristic equation: $x^2 + \alpha x + \beta = 0$
			- If $r_1$ and $r_2$ are two distinct roots of the characteristic polynomial, then the solution to the recurrence relation is: $a_n = ar_1^n + br_2^n$, where a and b are constants determined by the initial conditions.
				- Note: If we have a repeated root or only 1 root, we use $a_n = ar_1^n + bnr_2^n$ 
	- Solving Recurrence Relations: Characteristic Root Technique with Repeated Root
		- Solving for a and b here
			- #comment Will have an `n` in second term