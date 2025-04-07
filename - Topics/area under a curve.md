## Synthesis
- 
## Source [^1]
- Suppose that the curve $y=f(x)$ lies above the $x$-axis, so that $f(x) \geq 0$ for all $x$ in $[a, b]$. The area under the curve, that is, the area of the region bounded by the curve, the $x$-axis, and the lines $x=a$ and $x=b$, equals$$\int_{a}^{b} f(x) \mathrm{d} x$$
- The definition of integral is made precisely in order to achieve this result.
	- ![[Screenshot 2025-04-06 at 10.04.24 PM.png]]
		- When the function is positive
- If $f(x) \leq 0$ for all $x$ in $[a, b]$, the integral above is negative. However, it is still the case that its absolute value is equal to the area of the region bounded by the curve, the $x$-axis and the lines $x=a$ and $x=b$. If $y=f(x)$ crosses the $x$-axis, appropriate results hold. For example, if the regions $A$ and $B$ are as shown in the figure below, then
	- ![[Screenshot 2025-04-06 at 10.05.01 PM.png]]
		- When the function changes sign
- area of region $A=\int_{a}^{b} f(x) \mathrm{d} x$ and area of region $B=-\int_{b}^{c} f(x) \mathrm{d} x$.
	- It follows that$$\begin{aligned}& \int_{a}^{c} f(x) \quad \mathrm{d} x=\int_{a}^{b} f(x) \mathrm{d} x+\int_{b}^{c} f(x) \mathrm{d} x \\& =\text { area of region } A-\text { area of region } B .\end{aligned}$$
- The combined areas of regions A and B is given by the integral $\int_{a}^{b}|f(x)| \mathrm{d} x$, See SIGNED AREA.
- Polar areas
	- If a curve has an equation $r=r(\theta)$ in polar coordinates, there is an integral that gives the area of the region bounded by an arc $A B$ of the curve and the two radial lines $O A$ and $O B$. Suppose that $\angle x O A=\alpha$ and $\angle x O B=\beta$. The area of the region described equals $$\int_\alpha^\beta\frac 12r^2d\theta.$$
	- ![[Screenshot 2025-04-06 at 10.09.10 PM.png]]
		- Area of a polar sector
## References

[^1]: [[Home Page - The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]