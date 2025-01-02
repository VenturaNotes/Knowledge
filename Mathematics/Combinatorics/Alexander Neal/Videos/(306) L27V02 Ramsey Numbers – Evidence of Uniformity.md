---
Source:
  - https://youtube.com/watch?v=Sh_fxPDuzL0
Reviewed: false
---
## Ramsey Numbers
- Definition
	- For positive integers m and n, the Ramsey number R(m, n) is the least positive integer `t` so that if G is any graph on `t` vertices, then either G contains a clique of size  `m` or G contains an independent set of size n.
- Examples
	- R(m,n) = R(n,m), R(m,1) = 1 for all m, and R(m,2) = m for all m
- Theorem
	- The Ramsey number R(m, n) exists and satisfies the inequality $R(m, n) \le C(m + n - 2, m-1)$ 
- Proof
	- The argument is an easy induction and will be done in class. This will involve showing that $$R(m, n) \le R(m,n-1) + R(m-1,n) \text{ when } m, n \ge 2.)$$