---
aliases:
  - PMI
  - induction
References:
---
## Synthesis
- 
## Source [^1]
- Used to prove statements about natural numbers
- Consists of two steps
	- Base Case: Prove that the statement holds for the smallest number in the domain (usually n = 0 or n = 1)
	- [[Inductive step]]: Assume the statement hold for $n = k$ (the [[inductive hypothesis]]), and then prove it holds for $n = k + 1$ 
- Principle of Mathematical Induction is a little different from [[Induction Principle]] which is more commonly used in logic, computer science, or formal mathematical systems ([[Peano Arithmetic]], [[type theory]], or [[proof theory]])
### Incomplete Example
- To prove $S(n): 1 + 2 + ... + n = \frac{n(n+1)}{2}$ 
	- Prove $S(1)$: $\frac {n(n+1)}{2}=\frac {1(1+1)}{2} = \frac {2}{2} = 1$ 
	- Assume $S(k)$ is true, and use it to prove $S(k + 1)$ 
	- #question What is the complete solution?
	- #question Is the colon there appropriate? 

## References

[^1]: ChatGPT