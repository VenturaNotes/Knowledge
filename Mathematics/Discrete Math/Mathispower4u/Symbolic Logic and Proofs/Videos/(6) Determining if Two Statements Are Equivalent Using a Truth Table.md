---
Source:
  - https://www.youtube.com/watch?v=0LqKs4LHBZc
Reviewed: false
---
- ![[Screenshot 2025-05-14 at 1.23.15 AM.png]]
	- Propositional Logic: Verifying Two statements are logically equivalent
		- Example 3.1.5 Are the statements $(P \lor Q) \to R$ and $(P \to R) \lor (Q \to R)$ logically equivalent? Make a truth table. 
		- Steps
			- $(P \lor Q) \to R$ is false only when $P \lor Q$ is true and R is false
			- $(P \to R) \lor (Q \to R)$ is false only when $P \to R$ is false and $Q \to R$ isfalse.
			- The last two columns are not identical
			- Therefore, the statements are not logically equivalent
		- While we don't have logical equivalence, it is the case that whenever $(P \lor Q) \to R$ is true, so is $(P \to R) \lor (Q \to R)$. This tells us that we can deduce $(P \to R) \lor (Q \to R)$ from $(P \lor Q) \to R$, just not the reverse direction. 