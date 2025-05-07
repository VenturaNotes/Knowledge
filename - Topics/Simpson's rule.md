## Synthesis
- 
## Source [^1]
- The approximation$$\int_{x_{i}}^{x_{i}+2} f(x) \mathrm{d} x \approx 1 / 3 h\left(f\left(x_{i}\right)+4 f\left(x_{i+1}\right)+f\left(x_{i+2}\right)\right)$$where $h=x_{i+1}-x_{i}$. It is used in numerical integration.

## Source[^2]
- A rule to find approximations for the definite integral $$\int_a^bf(x)dx.$$Divide $[a,b]$ into $n$ equal subintervals of length $h$ by the partition $$a=x_0 < x_1 < x_2 < \cdots < x_{n-1} < x_n = b,$$where $x_{i+1}-x_i=h=(b-a)/n$, where $n$ is even. Denote $f(x_i)$ by $f_i$, and let $P_i$ be the point $(x_i, f_i)$. Take an arc of the parabola through the points $P_0, P_1, \text{ and } P_2$, an arc of a parabola through $P_2, P_2, \text{ and } P_4$, similarly, and so on. This is why $n$ is necessarily even. The resulting Simpson's rule gives $$\frac 13h(f_0 + 4f_1+2f_2+4f_3+2f_4+\cdots+2f_{n-2}+4f_{n-1}+f_n)$$as an approximation to the integral. In general, Simpson's rule is much more accurate than the trapezium rule, and the error is bounded by $$\frac{(b-a)^5}{2880n^4}\underset{a \le x \le b}{\text{max}}|f''''(x)|.$$The rule is named after the English mathematician Thomas Simpson (1710-61), though the rule is due to Newton, as Simpson himself acknowledged. 
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[Home Page - The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]