---
Source:
  - https://youtube.com/watch?v=EdLoNRo0s28
Reviewed: false
---
- ![[Screenshot 2024-12-18 at 4.09.50 PM.png]]
	- "Special" ways to determine linear independence (by that, we mean we don't have to do the math or the row operations)
		- One vector: 
			- Iff v $\ne$ 0, then it's [[Linear Independence|linearly independent]]
				- Assuming v is not zero, the only solution is the [[trivial solution]]
		- Two or more vectors:
			- By multiples
				- If one vector is a multiple of another, then they are not independent
				- $\vec x$ and $\vec w$ are linearly dependent because you can multiply $\vec x$ by a constant to get to $\vec w$. This is not possible to get from $\vec x$ to $\vec z$ making them linearly independent
				- Multiplying by some constant
			- By Theorem 8: (looks like it is from theorem 8[^1])
				- If a set contains more vectors than there are entries in each vector (more columns than rows) then the set is linearly dependent
				- So for in the example above: {x, w, z} is linearly dependent because there are 3 columns but only 2 rows meaning more columns than rows or rather more vectors than entries in each vector.
			- Proof: A = $[v_1 v_2 ... v_p]$, A is $n \times p$, Ax = 0, n equations, p unknowns, p > n
				- This is not a formal proof. Just reasoning through.
				- If A is a matrix, then the dimensions will be $n \times p$. This will tell us that $Ax = 0$ corresponds to a system where there are n equations and p unknowns. If p > n, then there are more variables than equations so there must be a free variable. Because there is a free variable, that means there is a non-trivial solution and therefore they are dependent.
	- Practice
		- Are the following sets linearly independent?
			- (1) Linearly independent because not multiples of one another
				- Yes
			- (2) Linearly independent because no free variables after doing the math
				- Have to do math for this one
				- Yes
			- (3) if more columns than rows, then linearly dependent 
				- No

## References
[^1]: https://math.berkeley.edu/~arash/54/notes/01_07.pdf