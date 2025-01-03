---
Source:
  - https://www.youtube.com/watch?v=iuoOq5aqwU4
Reviewed: false
---
-  
	- [[Proof by Exhaustion|proof by cases]]
		- Sometimes when we are trying to prove $p \implies q$ is true, it may be easier to use an equivalent disjunction $p_1 \lor p_2 \lor ... \lor p_k$ instead of using p as the hypothesis
			- Generally can be used when proving something involving even or odd numbers or divisibility rules
				- There's only 2 possible types of integers, even and odd
			- We have to prove that q is true for all possible cases of p for the overall statement to be true
	- Example 1: Let n $\in$ $\mathbb{Z}$. Prove that $n^2 + 3n + 5$ is an odd integer
	- Example 2: Let x, y, $\in$ $\mathbb{Z}$. Prove that x and y are of the same [[parity]] if and only if x + y is even
		- Parity means even or odd
		- Could use proof by [[contraposition]]
		- Assume x is even y is odd [[without loss of generality]]
			- We'd think we need to do cases 
				- x is even and y is odd
				- y is even and x is odd
			- However, this is without loss of generality because we'll get the exact same answer. They're variables so it doesn't matter which one is even or odd if we're just adding them up. Don't need to do both cases