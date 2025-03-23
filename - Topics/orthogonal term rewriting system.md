## Synthesis
- 
## Source [^1]
- There are several useful conditions on the set $E$ of equations defining a term rewriting system that lead to a well-behaved reduction system $\rightarrow_{E}$. A commonly used condition is orthogonality. If a set $E$ of equations is orthogonal then its term rewriting system $\rightarrow_{E}$ is Church-Rosser. A set of equations is orthogonal if it is left-linear and nonoverlapping:
	- the set $E$ of equations is left-linear if for all $t=t \vee E$, each variable that appears in $t$ does so only once;
	- the set $E$ of equations is nonoverlapping if
		- (a) for any pair of different equations $t=t^{\prime}, r=r \vee E$, the terms $t$ and $r$ do not overlap in the following sense-there exist closed substitutions $\tau \rho$ of $t, r$ such that $\rho(r)$ is a subterm of $\tau(t)$ and the outermost function symbol of $\rho(r)$ occurs as part of $t$,
		- (b) for any rule $t=t \vee E, t$ does not overlap with itself in the following sense-there exist closed substitutions $\tau, \rho$ of $t$ such that $\tau(t)$ is a proper subterm of $\rho(t)$ and the outermost function symbol of $\tau(t)$ occurs as a part of $t$.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]