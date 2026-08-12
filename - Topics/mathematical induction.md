## Synthesis
- 
## Source [^1]
- The method of proof ‘by mathematical induction’ is based on the following principle:
- Principle of mathematical induction
	- Let there be associated, with each positive integer $n$, a proposition $P(n)$, which is either true or false. If
		- (i) $P(1)$ is true,
		- (ii) for all $k$, $P(k)$ implies $P(k + 1)$,
	- then $P(n)$ is true for all positive integers $n$.
- The following are typical of results that can be proved by induction:
	- (a) For all positive integers $n$, $$\sum_{r=1}^{n} r^2 = \frac{1}{6}n(n+1)(2n+1).$$
	- (b) For all positive integers $n$, the $n$th derivative of $\frac{1}{x}$ is $(-1)^n \frac{n!}{x^{n+1}}$.
	- (c) For all positive integers $n$, $(\cos \theta + i \sin \theta)^n = \cos n\theta + i \sin n\theta$. See DE MOIVRE’S THEOREM.
- In each case, it is clear what the proposition $P(n)$ should be and that (i), the base case, can be verified. The method by which the so-called inductive step (ii), where the inductive hypothesis $P(k)$ is assumed, is proved depends upon the particular result to be established.
- There is a so-called ‘strong form’ of the principle of induction which is equivalent. It states:
	- If
		- (i’) $P(1)$ is true,
		- (ii’) for all $k$, the truth of $P(1), P(2), \dots, P(k-1), P(k)$ implies $P(k + 1)$,
		- then $P(n)$ is true for all positive integers $n$.
- This is a useful alternative when the inductive step proving $P(k + 1)$ relies on the truth of some previous proposition $P(i)$ which is not necessarily $P(k)$.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]