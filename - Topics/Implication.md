---
aliases:
  - implications
  - conditional statement
  - implies
  - conditional
---
## Synthesis
- 
## Source[^1]
### Truth Table

| $p$ | $q$ | $p \implies q$ |
| --- | --- | -------------- |
| T   | T   | T              |
| $\textcolor{hotpink}{T}$   | $\textcolor{hotpink}{F}$   | $\textcolor{hotpink}{F}$          |
| F   | T   | T              |
| F   | F   | T              |

- Only false when $p$ is true and $q$ is false
- Implications are also called conditional statements [^2]
## Source[^3]
### Negation
- Example
	- $\lnot (p \implies q)$ $\iff$ $p \land \lnot q$ 
## Source [^4]
### Equivalences
- $p \implies q$ is logically equivalent to $\lnot p \lor q$

## Source[^5]

| ![[Screenshot 2024-12-11 at 2.31.51 PM.png\|200]] |
| ------------------------------------------------- |
| Conditional [[Truth Table]]                       |
- ![[Screenshot 2024-12-12 at 8.02.14 AM.png]]
- Given $A \land B \to B$
	- In this conditional, the [[conjunction]] ($\land$) binds closer than the conditional arrow ($\to$).
		- Therefore, we don't need any parentheses here.
	- Since the above is a [[tautology]], we can write it as $A \land B \implies B$ as the double arrow tells us that it's a tautology
		- We will call this an [[implication]], as it's a normal conditional with extra information

## Source[^6]
- Equivalent statements for implications ($P \to Q$)
- If P then Q
- If P, Q
- P is sufficient for Q
- Q if P
- Q when P
- Q whenever P
- Q is necessary for P
- P is a necessary condition for Q[^7]
- A necessary condition for P is Q
- Q unless $\lnot$P
- P implies Q
- P only if Q
- P is sufficient for Q
- P is a sufficient condition for Q
- Q follows from P
- $\lnot Q \to \lnot P$ (contrapositive)
- P $\to$ Q $\equiv$ $\lnot P \lor Q$
## References

[^1]: [[Home Page - Algebra 1 - Groups, Rings, Fields and Arithmetic by Ramji Lal#^26r0fb]]
[^2]: https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/A_Spiral_Workbook_for_Discrete_Mathematics_(Kwong)/02%3A_Logic/2.03%3A_Implications#:~:text=Conditional%20statements%20are%20also%20called,true%20in%20all%20other%20situations.
[^3]: https://sites.math.washington.edu/~aloveles/Math300Winter2011/m300Quantifiers.pdf
[^4]: [[Home Page - Building Blocks for Theoretical Computer Science by Margaret M. Fleck#^5upwyw]]
[^5]: [[(4) Start Learning Logic - Part 3 - Conditional, Biconditional, Implication and Deduction Rules]]
[^6]: [[(14) Equivalent Statements to an Implication]]
[^7]: https://calcworkshop.com/logic/logical-implication/