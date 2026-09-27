## Synthesis
- 
## Source [^1]
- The approximation$$\begin{aligned}& \int_{x_{i}}^{x_{i}+1} f(x) \mathrm{d} x\simeq1 / 2 h\left(f\left(x_{i}\right)+f\left(x_{i+1}\right)\right) \\& h=x_{i+1}-x_{i}\end{aligned}$$used as the basis for an extrapolation method in numerical integration.
## Source[^2]
- An approximate value can be found for the definite integral$$\int_a^b f(x) \, dx,$$using the values of $f(x)$ at equally spaced values of $x$ between $a$ and $b$. Divide the interval $[a, b]$ into $n$ equal subintervals of length $h$ by the partition$$a = x_0 < x_1 < x_2 < \dots < x_{n-1} < x_n = b,$$where $x_{i+1} - x_i = h = (b - a)/n$. Denote $f(x_i)$ by $f_i$, and let $P_i$ be the point $(x_i, f_i)$. If the line segment $P_i P_{i+1}$ is used as an approximation to the curve $y = f(x)$ between $x_i$ and $x_{i+1}$, the area under that part of the curve is approximately the area of the trapezium shown in the figure, which equals $\frac{1}{2}h(f_i + f_{i+1})$. By adding up the areas of all the trapezia, the trapezium rule gives
- ![[Pasted image 20260925221254.png|260]]
- A single trapezium from the trapezium rule$$\frac{1}{2}h(f_0 + 2f_1 + 2f_2 + \dots + 2f_{n-1} + f_n)$$as an approximation to the value of the integral. The error between this approximation and the definite integral is bounded above by$$\frac{(b - a)^3}{12n^2} \max_{a \le x \le b} |f''(x)|.$$
- Simpson’s rule is significantly more accurate.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]