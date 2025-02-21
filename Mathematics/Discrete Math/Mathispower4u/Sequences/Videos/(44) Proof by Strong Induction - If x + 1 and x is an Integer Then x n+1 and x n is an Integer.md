---
Source:
  - https://www.youtube.com/watch?v=3p4X2-1qTYA
Reviewed: false
---
- ![[Screenshot 2025-02-20 at 12.35.45 PM.png]]
	- Proof by [[strong induction]]
		- Strong induction proof structure:
			- Start by saying what you want to prove "Let P(n) be the statement..." Then establish two facts:
				- (1) Base case: Prove that $P(0)$ is true
				- (2) Inductive Case: Assume $P(k)$ is true for all $k < n$. Prove $P(n)$ is true
			- Conclude, "therefore, by strong induction, P(n) is true for all n $\ge$ 0"
				- Of course, it is acceptable to replace 0 with a larger base case if needed
		- Suppose that a particular real number x has the property that $x + \frac 1x$ is an integer. Prove that $x^n + \frac{1}{x^n}$ is an integer for all natural numbers n