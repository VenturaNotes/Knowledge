## Synthesis
- 
## Source [^1]
- Let $f$ be a function that is continuous on $[a, b]$ and differentiable in $(a, b)$. The mean value theorem then states that there is a number $c$ with $a < c < b$ such that$$f'(c) = \frac{f(b) - f(a)}{b - a}.$$
- This is equivalently expressed as:there is a point $C$ on the graph of $f$ where the tangent is parallel to the line segment joining $A(a, f(a))$ to $B(b, f(b))$. If $A$, with coordinates $(a, f(a))$, and $B$, with coordinates $(b, f(b))$, are the points on the graph corresponding to the end-points of the interval, there must be a point $C$ on the graph between $A$ and $B$ at which the tangent is parallel to the chord $AB$.
- ![[Pasted image 20260909042005.png|277]]
	- Mean gradient achieved at C
- Rolle’s Theorem is a special case of the mean value theorem. Taylor’s Theorem is an extension of the mean value theorem. The mean value theorem has two immediate corollaries:
	- (i) if $f'(x) = 0$ for all $x$, then $f$ is a constant function,
	- (ii) if $f'(x) > 0$ for all $x$, then $f$ is strictly increasing.
### For Integrals
- (for integrals) Let $f$ and $g$ be two real functions on the interval $[a, b]$ and assume that $g(x) > 0$ for all $x$.
- If $m \le f(x) \le M$ for all $x$, then$$m \int_{a}^{b} g(x) dx \le \int_{a}^{b} f(x)g(x) dx \le M \int_{a}^{b} g(x) dx.$$
- If $f$ is a continuous function on $[a, b]$, then there exists $c$ in $(a, b)$ such that$$\int_{a}^{b} f(x)g(x) dx = f(c) \int_{a}^{b} g(x) dx.$$
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]