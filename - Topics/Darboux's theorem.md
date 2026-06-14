## Synthesis
- 
## Source [^1]
- Let $f(x)$ be real function which is continuous (see continuous function) on the interval $[a,b]$ and differentiable on the interval $(a,b)$. If $f'(a) < K < f'(b)$ then there exists $c$ in $(a,b)$ such that $f'(c) = K$. This may appear to be a consequence of the intermediate value theorem, but no assumption is made that that $f'(x)$ is itself continuous.
---
- (Darboux integral) Darboux's integral is an alternative theory of integration which is equivalent to Riemann's. Let $f(x)$ be a bounded real-valued function on the interval $[a,b].$ Then both of the following are well-defined $$\int_a^bf(x)~~ dx=\sup\int_a^b\varphi(x)dx|\varphi\text{ is a step function,} \varphi \le f\}$$$$\int_a^bf(x)~~ dx=\inf\int_a^b\varphi(x)dx|\varphi\text{ is a step function,} \varphi \ge f$$
	- #question Why is there a closing bracket when there is no opening bracket in the first equation?
- These are respectively referred to as the lower and upper Riemann or Darboux integrals of $f$. Then $f$ is said to be Darboux integrable if the lower and upper integrals are equal, and this is equivalent to being Riemann integrable. The Dirichlet function on $[a,b]$ has lower integral $0$ and upper integral $b\textendash a$ and so is not Darboux or Riemann integrable.
	- #question Is the $\textendash$ correct here?
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]